export type TenantSummary = {
  tenant_id: string;
  display_name: string;
  client_name: string;
  address: string;
  status: string;
  progress: number;
  current_stage: string;
  start_date: string;
  est_handover: string;
  outstanding: number;
  next_due_label: string;
};

export type Assignment = {
  id: string;
  tenant_id: string;
  user_id: string;
  role: string;
};

export type ActivityRecord = {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  date: string;
  stage_id: string;
  stage_name: string;
  type: string;
  created_by: string;
};

export type QuestionRecord = {
  id: string;
  tenant_id: string;
  customer_user_id: string;
  customer_name: string;
  date_asked: string;
  category: string;
  question_title: string;
  question_details: string;
  status: string;
  answer_text: string | null;
  answered_by: string | null;
  answered_date: string | null;
  notify_customer: boolean;
};

export type StageRecord = {
  tenant_id: string;
  stages: Array<{
    id: string;
    name: string;
    description: string;
    status: string;
    supervisor_status: string;
    progress: number;
    start_date: string;
    end_date: string;
    is_estimated: boolean;
    checklist: Array<{ id: string; label: string; completed: boolean }>;
    milestones: Array<{ name: string; status: string; date: string }>;
  }>;
};

export type DelayRecord = {
  id: string;
  tenant_id: string;
  date: string;
  stage_name: string;
  title: string;
  from_date: string;
  to_date: string;
  reason: string;
  type: string;
  duration_days: number;
  created_by: string;
};

export type SupervisorProjectSummary = {
  id: string;
  lot: string;
  clientName: string;
  address: string;
  status: string;
  progress: number;
  currentStage: string;
  estHandover: string;
  outstanding: number;
  nextDueLabel: string;
};

export type SupervisorQuestion = {
  id: string;
  tenantId: string;
  customerName: string;
  date: string;
  category: string;
  questionText: string;
  projectLot: string;
  projectName: string;
};

export type SupervisorActivity = {
  id: string;
  project: string;
  time: string;
  text: string;
};

export type SupervisorDelayAlert = {
  tenantId: string;
  tenantName: string;
  stageName: string;
  title: string;
  reason: string;
  fromDate: string;
  toDate: string;
};

export type SupervisorDashboardData = {
  projects: SupervisorProjectSummary[];
  unansweredQuestions: SupervisorQuestion[];
  recentActivities: SupervisorActivity[];
  delayedProjectsCount: number;
  completedStagesCount: number;
  delayAlert: SupervisorDelayAlert | null;
};