const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const syncFs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(syncFs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
let currentUser;
const originalLoad = Module._load;
Module._load = function(request, parent, ...rest) {
  if (request === '@/lib/auth/auth') return { getCurrentUser: async () => currentUser };
  if (request.startsWith('@/')) request = path.join(root, request.slice(2));
  return originalLoad.call(this, request, parent, ...rest);
};
const route = require('../app/api/customer/timeline/route.ts');
const { getCustomerTimelines } = require('../lib/customer/timeline.ts');
test('customer timeline JSON API', async t => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'stagen-customer-timeline-'));
  const cwd = process.cwd();
  const read = async file => JSON.parse(await fs.readFile(path.join(temp, 'data/tenants', file), 'utf8'));
  const write = async (file, value) => fs.writeFile(path.join(temp, 'data/tenants', file), JSON.stringify(value));
  try {
    await fs.cp(path.join(root, 'data/tenants'), path.join(temp, 'data/tenants'), { recursive: true });
    process.chdir(temp);
    const projects = await read('tenants.json');
    const project = projects.find(p => p.client_user_id);
    assert.ok(project);
    const customer = { id: project.client_user_id, role: 'customer' };
    await t.test('requires a signed-in customer and exposes no write handlers', async () => {
      currentUser = null; assert.equal((await route.GET()).status, 401);
      currentUser = { id: customer.id, role: 'supervisor' }; assert.equal((await route.GET()).status, 403);
      for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) assert.equal(route[method], undefined);
      currentUser = customer;
    });
    await t.test('returns only linked projects, no identity or financial fields', async () => {
      const response = await route.GET(); assert.equal(response.status, 200);
      assert.equal(response.headers.get('cache-control'), 'private, no-store');
      const result = await response.json();
      assert.deepEqual(result.projects.map(p => p.id), [project.tenant_id]);
      assert.equal(result.projects[0].timeline.percentage, project.progress);
      assert.equal(result.projects[0].contract_value, undefined);
      const original = await read('tenant_delays.json');
      assert.deepEqual(result.projects[0].timeline.delayLog.map(d => d.id), original.filter(d => d.tenant_id === project.tenant_id).map(d => d.id));
      assert.equal(result.projects[0].timeline.delayLog[0].type, 'weather');
    });
    await t.test('does not invent missing stage dates or demo stages', async () => {
      const rows = await read('tenant_stages.json');
      const existing = rows.find(r => r.tenant_id === project.tenant_id).stages;
      const result = (await getCustomerTimelines(customer.id))[0];
      assert.equal(result.timeline.stages.length, existing.length);
      assert.equal(result.timeline.stages[0].plannedStart, '');
      assert.equal(result.timeline.stages[0].status, 'completed-on-time');
    });
    await t.test('fresh reads reflect persisted supervisor schedule and stage changes', async () => {
      const rows = await read('tenant_timelines.json');
      const timeline = rows.find(r => r.tenant_id === project.tenant_id);
      timeline.stages = [{ id: 'site-cut', name: 'Site Cut', status: 'completed-late', plannedStart: '2026-03-10', plannedEnd: '2026-03-20', actualStart: '2026-03-10', actualEnd: '2026-03-22', milestones: [{ name: 'Inspection', date: '2026-03-22', type: 'inspection', status: 'completed' }] }];
      timeline.current_projected_completion = '2026-12-01';
      await write('tenant_timelines.json', rows);
      const result = (await getCustomerTimelines(customer.id))[0].timeline;
      assert.equal(result.currentProjectedCompletion, '2026-12-01');
      assert.equal(result.stages[0].plannedStart, '2026-03-10');
      assert.equal(result.stages[0].status, 'completed-late');
      assert.equal(result.stages[0].milestones[0].name, 'Inspection');
      const stages = await read('tenant_stages.json');
      stages.find(r => r.tenant_id === project.tenant_id).stages[0].status = 'Pending';
      await write('tenant_stages.json', stages);
      assert.equal((await getCustomerTimelines(customer.id))[0].timeline.stages[0].status, 'upcoming');
    });
    await t.test('supports customer assignments and does not treat supervisor assignments as ownership', async () => {
      const other = projects.find(p => p.tenant_id !== project.tenant_id);
      await write('tenant_assignments.json', [{ tenant_id: other.tenant_id, user_id: customer.id, role: 'supervisor' }]);
      assert.equal((await getCustomerTimelines(customer.id)).length, 1);
      await write('tenant_assignments.json', { tenant_id: other.tenant_id, user_id: customer.id, role: 'customer' });
      assert.equal((await getCustomerTimelines(customer.id)).length, 2);
      assert.deepEqual(await getCustomerTimelines('unlinked-user'), []);
    });
    await t.test('singleton files and missing timeline details remain readable without writes', async () => {
      await write('tenants.json', project);
      await write('tenant_assignments.json', []);
      await write('tenant_stages.json', { tenant_id: project.tenant_id, stages: [] });
      await write('tenant_timelines.json', []);
      await write('tenant_delays.json', []);
      const before = await read('tenants.json');
      const data = (await getCustomerTimelines(customer.id))[0];
      assert.deepEqual(data.timeline.stages, []); assert.deepEqual(data.timeline.delayLog, []);
      assert.equal(data.timeline.percentage, project.progress);
      assert.deepEqual(await read('tenants.json'), before);
    });
    await t.test('unreadable JSON returns an error instead of demo data', async () => {
      await fs.writeFile(path.join(temp, 'data/tenants/tenant_timelines.json'), '{bad JSON');
      const log = console.error; console.error = () => {};
      try { assert.equal((await route.GET()).status, 500); } finally { console.error = log; }
    });
  } finally {
    process.chdir(cwd);
    assert.equal(path.dirname(path.resolve(temp)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temp).startsWith('stagen-customer-timeline-'));
    await fs.rm(temp, { recursive: true, force: true });
  }
});
