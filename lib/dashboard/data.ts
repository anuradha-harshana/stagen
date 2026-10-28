export interface Stage {
  id: string;
  name: string;
  label: string;
  status: "completed" | "in-progress" | "upcoming";
}

export interface RecentUpdate {
  id: number;
  title: string;
  date: string;
  type: "success" | "in-progress" | "info";
}

export interface SitePhoto {
  id: number;
  label: string;
  date: string;
  url: string;
  stage: string;
}

export interface NotificationData {
  id: number;
  title: string;
  date: string;
  type: "info" | "urgent";
}

export interface DashboardData {
  overallProgress: {
    percentage: number;
    label: string;
    stage: string;
    estimatedCompletion: string;
  };
  nextMilestone: {
    name: string;
    daysRemaining: number;
    estimatedCompletion: string;
  };
  daysToCompletion: {
    daysRemaining: number;
    startedOn: string;
  };
  stages: Stage[];
  recentUpdates: RecentUpdate[];
  sitePhotos: SitePhoto[];
  notifications: NotificationData[];
}
