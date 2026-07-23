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

export const mockDashboardData: DashboardData = {
  overallProgress: {
    percentage: 42,
    label: "Completed",
    stage: "Frame",
    estimatedCompletion: "Aug 28, 2024"
  },
  nextMilestone: {
    name: "Lockup",
    daysRemaining: 18,
    estimatedCompletion: "July 12, 2024"
  },
  daysToCompletion: {
    daysRemaining: 78,
    startedOn: "May 10, 2024"
  },
  stages: [
    { id: "site-cut", name: "Site Cut", label: "Completed", status: "completed" },
    { id: "slab", name: "Slab", label: "Completed", status: "completed" },
    { id: "frame", name: "Frame", label: "In Progress", status: "in-progress" },
    { id: "lockup", name: "Lockup", label: "Upcoming", status: "upcoming" },
    { id: "fixing", name: "Fixing", label: "Upcoming", status: "upcoming" },
    { id: "completion", name: "Completion", label: "Upcoming", status: "upcoming" },
    { id: "handover", name: "Handover", label: "Upcoming", status: "upcoming" }
  ],
  recentUpdates: [
    { id: 1, title: "Frame inspection completed", date: "May 20, 2024 - 10:50 AM", type: "success" },
    { id: 2, title: "Wall framing in progress", date: "May 16, 2024 - 03:15 PM", type: "in-progress" },
    { id: 3, title: "Materials delivered to site", date: "May 17, 2024 - 09:45 AM", type: "info" }
  ],
  sitePhotos: [
    { id: 1, label: "Framing Front", date: "June 10, 2024", url: "/images/framing_front.png", stage: "Frame" },
    { id: 2, label: "Interior Frame", date: "July 2, 2024", url: "/images/interior_frame.png", stage: "Frame" },
    { id: 3, label: "Roof Trusses", date: "July 15, 2024", url: "/images/roof_trusses.png", stage: "Frame" }
  ],
  notifications: [
    { id: 1, title: "Inspection scheduled for May 25, 2024", date: "May 20, 2024", type: "info" },
    { id: 2, title: "New update added by your supervisor", date: "May 18, 2024", type: "info" },
    { id: 3, title: "Weather delay expected this weekend", date: "May 17, 2024", type: "urgent" }
  ]
};
