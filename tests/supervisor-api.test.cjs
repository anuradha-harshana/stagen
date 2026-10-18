const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const syncFs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
// Transpile the actual helpers without a new test-runner dependency.
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(syncFs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
let currentUser;
const originalLoad = Module._load;
Module._load = function(request, parent, ...rest) {
  if (request === '../auth/auth' && parent?.filename.endsWith(path.join('supervisor', 'api.ts'))) return { getCurrentUser: async () => currentUser };
  return originalLoad.call(this, request, parent, ...rest);
};
const { supervisorApi } = require('../lib/supervisor/api.ts');
const store = require('../lib/supervisor/store.ts');
const api = (resource, method = 'GET', body, headers = {}) => supervisorApi(new Request(`http://localhost/api/supervisor/${resource}`, { method, headers: { ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...headers }, body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body) }), resource.split('?')[0]);
async function ok(resource, method, body) { const response = await api(resource, method, body); const result = await response.json(); assert.ok(response.ok, JSON.stringify(result)); return result; }
test('supervisor JSON API workflows (isolated copy of existing data)', async t => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'stagen-supervisor-'));
  const cwd = process.cwd();
  try {
    await fs.cp(path.join(root, 'data'), path.join(temp, 'data'), { recursive: true });
    await fs.mkdir(path.join(temp, 'data', 'sessions'), { recursive: true });
    await fs.writeFile(path.join(temp, 'data', 'sessions', 'sessions.json'), '[]');
    process.chdir(temp);
    const users = await store.read('users');
    const supervisor = users.find(u => u.role === 'supervisor');
    assert.ok(supervisor);
    currentUser = supervisor;
    const originalCustomerProfile = (await store.read('profile'))[0];
    let project, question, delayId;
    await t.test('authentication, role and project isolation', async () => {
      currentUser = null; assert.equal((await api('projects')).status, 401);
      currentUser = users.find(u => u.role !== 'supervisor'); assert.equal((await api('projects')).status, 403);
      currentUser = supervisor;
      const projects = await ok('projects'); project = projects.find(p => p.stages.some(s => s.status === 'Active')) ?? projects[0];
      const assignments = await store.read('assignments');
      assert.ok(projects.every(p => assignments.some(a => a.tenant_id === p.id && a.user_id === supervisor.id)));
      const other = (await store.read('projects')).find(p => !projects.some(v => v.id === p.tenant_id));
      assert.equal((await api('stage-updates', 'POST', { tenantId: other.tenant_id, text: 'Forbidden' })).status, 404);
      assert.equal((await api('settings', 'PUT', { section: 'general', values: { language: 'English' } }, { origin: 'https://elsewhere.test' })).status, 403);
      assert.equal((await api('photos', 'POST', {})).status, 405);
      for (const resource of ['dashboard', 'timeline', 'stage-updates', 'delays', 'messages', 'questions', 'documents', 'photos', 'notifications', 'profile', 'settings']) assert.equal((await api(resource)).status, 200, resource);
    });
    await t.test('answers, comments, likes and customer notification persist', async () => {
      // The repository intentionally has no questions yet. Seed only this temporary fixture.
      const qs = await store.read('questions');
      qs.push({ id: 'test-question', tenant_id: project.id, customer_user_id: users.find(u => u.role === 'customer').id, customer_name: 'Test customer', date_asked: '2026-10-11', category: 'Build Progress', question_title: 'Test question', question_details: 'Test details', status: 'PENDING', answer_text: null });
      await store.write('questions', qs);
      question = (await ok('questions'))[0]; assert.ok(question);
      await ok('questions', 'PUT', { id: question.id, answerText: 'Persistent test answer', notifyCustomer: true });
      const q = (await ok('questions')).find(q => q.id === question.id);
      assert.equal(q.status, 'ANSWERED'); assert.equal(q.answerText, 'Persistent test answer');
      await ok('questions', 'PATCH', { id: q.id, commentText: 'Site follow-up', isOfficialAnswer: false });
      await ok('questions', 'PATCH', { id: q.id, like: true });
      await ok('questions', 'PATCH', { id: q.id, like: true });
      const updated = (await ok('questions')).find(v => v.id === q.id);
      assert.equal(updated.likesCount, 1); assert.equal(updated.comments.length, q.comments.length + 1);
      assert.ok((await store.read('notifications')).some(n => n.source_entity_id === q.id));
      const before = JSON.stringify(await store.read('questions'));
      assert.equal((await api('questions', 'PUT', { id: q.id, answerText: ' ' })).status, 400);
      assert.equal(JSON.stringify(await store.read('questions')), before);
    });
    await t.test('stage completion synchronizes stages, project and timeline', async () => {
      const stage = project.stages.find(s => s.status === 'Active'); assert.ok(stage);
      await ok('stage-updates', 'PUT', { tenantId: project.id, stageName: stage.name, checklist: stage.checklist.map(c => ({ id: c.id, completed: true })), progress: 100, complete: true });
      const p = (await ok('projects')).find(p => p.id === project.id);
      assert.equal(p.stages.find(s => s.name === stage.name).status, 'Completed');
      const timelines = await ok('timeline'); assert.equal(timelines[p.id].percentage, p.progress);
      await ok('timeline', 'PUT', { tenantId: p.id, stages: timelines[p.id].stages });
      await ok('stage-updates', 'POST', { tenantId: p.id, text: 'Persisted progress note' });
      assert.ok((await store.read('activities')).some(a => a.description === 'Persisted progress note'));
    });
    await t.test('create, edit, delete delay and keep timeline totals consistent', async () => {
      const body = { tenantId: project.id, stageName: project.stages[0].name, title: 'Test delay', reason: 'Weather', type: 'weather', fromDate: '2026-10-11', toDate: '2026-10-14' };
      await ok('delays', 'POST', body);
      delayId = (await ok('delays')).find(d => d.title === 'Test delay').id;
      await ok('delays', 'PUT', { ...body, id: delayId, toDate: '2026-10-16' });
      assert.equal((await store.read('delays')).find(d => d.id === delayId).duration_days, 5);
      assert.equal((await api('delays', 'POST', { ...body, toDate: '2026-10-01' })).status, 400);
      const total = (await store.read('delays')).filter(d => d.tenant_id === project.id).reduce((n,d) => n + d.duration_days, 0);
      assert.equal((await ok('timeline'))[project.id].delayDays, total);
      await ok('messages', 'POST', { projectId: project.id, delayId, recipientName: project.clientName, recipientEmail: project.customerEmail || 'test@example.com', stageName: body.stageName, subject: 'Delay notice', body: 'Test notice' });
      assert.ok((await ok('messages')).some(m => m.delayId === delayId));
      await ok('delays', 'DELETE', { id: delayId });
      assert.ok(!(await ok('delays')).some(d => d.id === delayId));
    });
    await t.test('document bytes, visibility, authorization and deletion', async () => {
      const form = new FormData();
      for (const [key, value] of Object.entries({ projectCode: project.id, title: 'Test document', documentType: 'Engineering Report', description: 'Test', visibility: 'Internal Team Only', dateOfUpdate: '2026-10-11' })) form.set(key, value);
      form.set('file', new File(['test file contents'], 'test.txt', { type: 'text/plain' }));
      await ok('documents', 'POST', form);
      const doc = (await ok('documents')).find(d => d.title === 'Test document');
      assert.equal(doc.hasFile, true);
      const response = await api(`documents?file=${doc.id}`); assert.equal(await response.text(), 'test file contents');
      await ok('documents', 'PUT', { id: doc.id, visibility: 'Visible to Customer' });
      assert.equal((await store.read('documents')).find(d => d.id === doc.id).visibility, 'customer');
      await ok('documents', 'DELETE', { id: doc.id });
      assert.equal((await api(`documents?file=${doc.id}`)).status, 404);
    });
    await t.test('profile, certificates and preferences preserve other users', async () => {
      await ok('profile', 'PATCH', { availability: 'Onsite', professionalInfo: { yearsOfExperience: 9, expertise: ['Residential'] }, certifications: [{ id: 'test-cert', name: 'Test cert', licenseNo: '123', issuedDate: '2026-01-01', expiryDate: 'Never Expires', status: 'ACTIVE', fileName: 'test.txt', fileContent: 'aGVsbG8=' }] });
      assert.equal((await ok('profile')).availability, 'Onsite');
      assert.equal((await ok('profile')).certifications[0].fileContent, 'aGVsbG8=');
      assert.deepEqual((await store.read('profile')).find(p => p.user_id === originalCustomerProfile.user_id), originalCustomerProfile);
      await Promise.all([ok('settings', 'PATCH', { section: 'general', values: { language: 'English' } }), ok('settings', 'PATCH', { section: 'notifications', values: { siteDelays: false } })]);
      assert.equal((await ok('settings')).notifications.siteDelays, false);
      assert.equal((await ok('settings')).general.language, 'English');
      assert.equal((await api('settings', 'PUT', { section: 'general', values: { role: 'admin' } })).status, 400);
    });
    await t.test('photo captions and deletion persist without an upload endpoint', async () => {
      const photo = (await ok('photos'))[0]; assert.ok(photo);
      await ok('photos', 'PUT', { id: photo.id, caption: 'Updated caption' });
      assert.equal((await ok('photos')).find(p => p.id === photo.id).caption, 'Updated caption');
      await ok('photos', 'DELETE', { id: photo.id });
      assert.ok(!(await ok('photos')).some(p => p.id === photo.id));
    });
    await t.test('notification ownership, read state and deletion', async () => {
      const rows = await store.read('notifications');
      rows.push({ id: 'supervisor-notice', user_id: supervisor.id, tenant_id: project.id, title: 'Notice', description: 'Test', category: 'System & Safety', read: false }); await store.write('notifications', rows);
      await ok('notifications', 'PATCH', { all: true });
      assert.equal((await ok('notifications'))[0].read, true);
      const other = rows.find(n => n.user_id !== supervisor.id);
      assert.equal((await api('notifications', 'DELETE', { id: other.id })).status, 404);
      await ok('notifications', 'DELETE', { id: 'supervisor-notice' });
      assert.equal((await ok('notifications')).length, 0);
    });
    await t.test('password validation and revoke only this supervisor sessions', async () => {
      assert.equal((await api('security', 'PUT', { currentPassword: 'wrong', newPassword: 'new-password' })).status, 400);
      await ok('security', 'PUT', { currentPassword: supervisor.password, newPassword: 'new-password' });
      assert.equal((await store.read('users')).find(u => u.id === supervisor.id).password, 'new-password');
      await store.write('sessions', [{ id: 'a', userId: supervisor.id }, { id: 'b', userId: 'other' }]);
      await ok('security', 'DELETE');
      assert.deepEqual(await store.read('sessions'), [{ id: 'b', userId: 'other' }]);
    });
  } finally {
    process.chdir(cwd);
    // Only remove the exact temporary fixture directory created above.
    assert.equal(path.dirname(path.resolve(temp)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temp).startsWith('stagen-supervisor-'));
    await fs.rm(temp, { recursive: true, force: true });
  }
});
