export interface TimelineMilestone {
  name: string;
  date: string;
  type: "inspection" | "approval" | "delivery" | "delay";
  status: "completed" | "pending" | "scheduled";
}

export interface TimelineStage {
  id: string;
  name: string;
  description: string;
  status: "completed-on-time" | "completed-late" | "in-progress" | "upcoming" | "delayed";
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string; // Serves as projected end date if stage is in-progress or upcoming
  milestones: TimelineMilestone[];
}

export interface DelayLogEntry {
  id: number;
  date: string;
  stageName: string;
  title: string;
  fromDate: string;
  toDate: string;
  reason: string;
  type: "weather" | "materials" | "permits" | "machinery" | "labor";
}

export interface TimelinePageData {
  percentage: number;
  startDate: string;
  originalEstCompletion: string;
  currentProjectedCompletion: string;
  statusFlag: "on-track" | "delayed" | "ahead" | "not-started";
  delayDays: number;
  stages: TimelineStage[];
  delayLog: DelayLogEntry[];
}

// ---------------------------------------------------------
// 1. NOT STARTED (EMPTY STATE)
// ---------------------------------------------------------
export const timelineNotStartedData: TimelinePageData = {
  percentage: 0,
  startDate: "Nov 1, 2024",
  originalEstCompletion: "Apr 15, 2025",
  currentProjectedCompletion: "Apr 15, 2025",
  statusFlag: "not-started",
  delayDays: 0,
  stages: [
    {
      id: "site-cut",
      name: "Site Cut",
      description: "Clearing block, excavation, footprint leveling, and drainage.",
      status: "upcoming",
      plannedStart: "2024-11-01",
      plannedEnd: "2024-11-05",
      milestones: [
        { name: "Site Pegout & Excavation", date: "2024-11-02", type: "inspection", status: "scheduled" },
        { name: "Soil Compaction Assessment", date: "2024-11-04", type: "approval", status: "scheduled" }
      ]
    },
    {
      id: "slab",
      name: "Slab",
      description: "Underfloor plumbing, steel reinforcement grids, concrete pour.",
      status: "upcoming",
      plannedStart: "2024-11-10",
      plannedEnd: "2024-11-20",
      milestones: [
        { name: "Underfloor Drainage Pipes", date: "2024-11-12", type: "inspection", status: "scheduled" },
        { name: "Steel Reinforcement Inspection", date: "2024-11-17", type: "approval", status: "scheduled" },
        { name: "Foundation Concrete Pour", date: "2024-11-20", type: "delivery", status: "scheduled" }
      ]
    },
    {
      id: "frame",
      name: "Frame",
      description: "Timber/steel wall framing, structural support, roof trusses.",
      status: "upcoming",
      plannedStart: "2024-11-25",
      plannedEnd: "2024-12-20",
      milestones: [
        { name: "Lower & Upper Wall Frames", date: "2024-12-05", type: "inspection", status: "scheduled" },
        { name: "Roof Trusses and Gables", date: "2024-12-15", type: "delivery", status: "scheduled" },
        { name: "Frame Inspection", date: "2024-12-20", type: "approval", status: "scheduled" }
      ]
    },
    {
      id: "lockup",
      name: "Lockup",
      description: "Brickwork/cladding, roofing tiles, windows and doors.",
      status: "upcoming",
      plannedStart: "2025-01-05",
      plannedEnd: "2025-02-05",
      milestones: [
        { name: "Windows & Sliding Doors", date: "2025-01-20", type: "delivery", status: "scheduled" },
        { name: "Brickwork Completion Check", date: "2025-02-03", type: "inspection", status: "scheduled" }
      ]
    },
    {
      id: "fixing",
      name: "Fixing",
      description: "Plasterboard, architraves, skirting, built-in cabinetry.",
      status: "upcoming",
      plannedStart: "2025-02-10",
      plannedEnd: "2025-03-05",
      milestones: [
        { name: "Plasterboard Delivery", date: "2025-02-12", type: "delivery", status: "scheduled" },
        { name: "Cabinetry Installation Inspection", date: "2025-03-02", type: "inspection", status: "scheduled" }
      ]
    },
    {
      id: "completion",
      name: "Completion",
      description: "Painting, tiling, floor coverings, final clean.",
      status: "upcoming",
      plannedStart: "2025-03-10",
      plannedEnd: "2025-04-05",
      milestones: [
        { name: "Electrical Fit-off Test", date: "2025-03-25", type: "inspection", status: "scheduled" },
        { name: "Floor Coverings Installation", date: "2025-04-01", type: "delivery", status: "scheduled" }
      ]
    },
    {
      id: "handover",
      name: "Handover",
      description: "Final walkthrough with supervisor, key collection.",
      status: "upcoming",
      plannedStart: "2025-04-10",
      plannedEnd: "2025-04-15",
      milestones: [
        { name: "Pre-Handover Inspection (PCI)", date: "2025-04-12", type: "inspection", status: "scheduled" },
        { name: "Key Handover Ceremony", date: "2025-04-15", type: "approval", status: "scheduled" }
      ]
    }
  ],
  delayLog: []
};

// ---------------------------------------------------------
// 2. ACTIVE BUILD (CURRENT STATE)
// Simulated "Today" is 2024-07-10
// ---------------------------------------------------------
export const timelineActiveData: TimelinePageData = {
  percentage: 42,
  startDate: "May 10, 2024",
  originalEstCompletion: "Sep 8, 2024",
  currentProjectedCompletion: "Sep 16, 2024",
  statusFlag: "delayed",
  delayDays: 8,
  stages: [
    {
      id: "site-cut",
      name: "Site Cut",
      description: "Clearing block, excavation, footprint leveling, and drainage.",
      status: "completed-on-time",
      plannedStart: "2024-05-10",
      plannedEnd: "2024-05-12",
      actualStart: "2024-05-10",
      actualEnd: "2024-05-12",
      milestones: [
        { name: "Site Pegout & Excavation", date: "2024-05-11", type: "inspection", status: "completed" },
        { name: "Soil Compaction Assessment", date: "2024-05-12", type: "approval", status: "completed" }
      ]
    },
    {
      id: "slab",
      name: "Slab",
      description: "Underfloor plumbing, steel reinforcement grids, concrete pour.",
      status: "completed-late",
      plannedStart: "2024-05-14",
      plannedEnd: "2024-05-17",
      actualStart: "2024-05-14",
      actualEnd: "2024-05-19", // Finished 2 days late
      milestones: [
        { name: "Underfloor Drainage Pipes", date: "2024-05-15", type: "inspection", status: "completed" },
        { name: "Steel Reinforcement Inspection", date: "2024-05-17", type: "approval", status: "completed" },
        { name: "Pump breakdown & weather delay", date: "2024-05-18", type: "delay", status: "completed" },
        { name: "Foundation Concrete Pour", date: "2024-05-19", type: "delivery", status: "completed" }
      ]
    },
    {
      id: "frame",
      name: "Frame",
      description: "Timber/steel wall framing, structural support, roof trusses.",
      status: "in-progress", // Starts late due to slab delay, gets further weather delay
      plannedStart: "2024-05-20",
      plannedEnd: "2024-07-10",
      actualStart: "2024-05-22",
      actualEnd: "2024-07-18", // Projected to end July 18 (8 days delayed total)
      milestones: [
        { name: "Timber framing delivered", date: "2024-05-28", type: "delivery", status: "completed" },
        { name: "Lower Wall Frames erected", date: "2024-06-10", type: "inspection", status: "completed" },
        { name: "Heavy storm delay", date: "2024-06-15", type: "delay", status: "completed" },
        { name: "Upper Wall Frames & Beams", date: "2024-06-24", type: "inspection", status: "completed" },
        { name: "Roof Trusses and Gables", date: "2024-07-02", type: "delivery", status: "completed" },
        { name: "Frame Structural Inspection", date: "2024-07-16", type: "inspection", status: "scheduled" }
      ]
    },
    {
      id: "lockup",
      name: "Lockup",
      description: "Brickwork/cladding, roofing tiles, windows and doors.",
      status: "delayed", // Shifted by 8 days
      plannedStart: "2024-07-12",
      plannedEnd: "2024-07-28",
      actualStart: "2024-07-20", // Projected start
      actualEnd: "2024-08-05", // Projected end
      milestones: [
        { name: "Roofing Tile Delivery", date: "2024-07-24", type: "delivery", status: "pending" },
        { name: "Brickwork Inspection", date: "2024-08-02", type: "inspection", status: "pending" }
      ]
    },
    {
      id: "fixing",
      name: "Fixing",
      description: "Plasterboard, architraves, skirting, built-in cabinetry.",
      status: "delayed",
      plannedStart: "2024-07-30",
      plannedEnd: "2024-08-12",
      actualStart: "2024-08-07",
      actualEnd: "2024-08-20",
      milestones: [
        { name: "Cabinetry Installation", date: "2024-08-14", type: "delivery", status: "pending" },
        { name: "Fixing Carpentry Audit", date: "2024-08-18", type: "inspection", status: "pending" }
      ]
    },
    {
      id: "completion",
      name: "Completion",
      description: "Painting, tiling, floor coverings, final clean.",
      status: "delayed",
      plannedStart: "2024-08-14",
      plannedEnd: "2024-09-02",
      actualStart: "2024-08-22",
      actualEnd: "2024-09-10",
      milestones: [
        { name: "Painting Inspection", date: "2024-08-29", type: "inspection", status: "pending" },
        { name: "Tiling & Floor Coverings", date: "2024-09-04", type: "delivery", status: "pending" }
      ]
    },
    {
      id: "handover",
      name: "Handover",
      description: "Final walkthrough with supervisor, key collection.",
      status: "delayed",
      plannedStart: "2024-09-04",
      plannedEnd: "2024-09-08",
      actualStart: "2024-09-12",
      actualEnd: "2024-09-16",
      milestones: [
        { name: "Pre-Handover Inspection (PCI)", date: "2024-09-13", type: "inspection", status: "pending" },
        { name: "Key Handover Ceremony", date: "2024-09-16", type: "approval", status: "pending" }
      ]
    }
  ],
  delayLog: [
    {
      id: 1,
      date: "May 18, 2024",
      stageName: "Slab",
      title: "Slab Concrete Pour Postponed",
      fromDate: "2024-05-17",
      toDate: "2024-05-19",
      reason: "Concrete pump breakdown on site plus light afternoon storms required rescheduling the concrete pour for Monday morning.",
      type: "machinery"
    },
    {
      id: 2,
      date: "June 15, 2024",
      stageName: "Frame",
      title: "Severe Storm Delay",
      fromDate: "2024-07-10 (Original Est)",
      toDate: "2024-07-18 (Current Est)",
      reason: "High winds exceeding 60km/h and torrential rainfall halted framing works on scaffolding for 6 working days due to safety protocols.",
      type: "weather"
    }
  ]
};

// ---------------------------------------------------------
// 3. COMPLETED (SUCCESS STATE)
// Simulated "Today" is 2024-09-10 (Build complete)
// ---------------------------------------------------------
export const timelineCompletedData: TimelinePageData = {
  percentage: 100,
  startDate: "May 10, 2024",
  originalEstCompletion: "Sep 8, 2024",
  currentProjectedCompletion: "Sep 6, 2024",
  statusFlag: "ahead",
  delayDays: -2,
  stages: [
    {
      id: "site-cut",
      name: "Site Cut",
      description: "Clearing block, excavation, footprint leveling, and drainage.",
      status: "completed-on-time",
      plannedStart: "2024-05-10",
      plannedEnd: "2024-05-12",
      actualStart: "2024-05-10",
      actualEnd: "2024-05-12",
      milestones: [
        { name: "Site Pegout & Excavation", date: "2024-05-11", type: "inspection", status: "completed" },
        { name: "Soil Compaction Assessment", date: "2024-05-12", type: "approval", status: "completed" }
      ]
    },
    {
      id: "slab",
      name: "Slab",
      description: "Underfloor plumbing, steel reinforcement grids, concrete pour.",
      status: "completed-late",
      plannedStart: "2024-05-14",
      plannedEnd: "2024-05-17",
      actualStart: "2024-05-14",
      actualEnd: "2024-05-19",
      milestones: [
        { name: "Underfloor Drainage Pipes", date: "2024-05-15", type: "inspection", status: "completed" },
        { name: "Steel Reinforcement Inspection", date: "2024-05-17", type: "approval", status: "completed" },
        { name: "Foundation Concrete Pour", date: "2024-05-19", type: "delivery", status: "completed" }
      ]
    },
    {
      id: "frame",
      name: "Frame",
      description: "Timber/steel wall framing, structural support, roof trusses.",
      status: "completed-late",
      plannedStart: "2024-05-20",
      plannedEnd: "2024-07-10",
      actualStart: "2024-05-22",
      actualEnd: "2024-07-18",
      milestones: [
        { name: "Timber framing delivered", date: "2024-05-28", type: "delivery", status: "completed" },
        { name: "Lower Wall Frames erected", date: "2024-06-10", type: "inspection", status: "completed" },
        { name: "Upper Wall Frames & Beams", date: "2024-06-24", type: "inspection", status: "completed" },
        { name: "Roof Trusses and Gables", date: "2024-07-02", type: "delivery", status: "completed" },
        { name: "Frame Structural Inspection", date: "2024-07-18", type: "inspection", status: "completed" }
      ]
    },
    {
      id: "lockup",
      name: "Lockup",
      description: "Brickwork/cladding, roofing tiles, windows and doors.",
      status: "completed-late", // Still late relative to original, but ahead of active delay
      plannedStart: "2024-07-12",
      plannedEnd: "2024-07-28",
      actualStart: "2024-07-20",
      actualEnd: "2024-08-03", // Shaved 2 days off delay
      milestones: [
        { name: "Roofing Tile Delivery", date: "2024-07-23", type: "delivery", status: "completed" },
        { name: "Brickwork Inspection", date: "2024-07-31", type: "inspection", status: "completed" }
      ]
    },
    {
      id: "fixing",
      name: "Fixing",
      description: "Plasterboard, architraves, skirting, built-in cabinetry.",
      status: "completed-late",
      plannedStart: "2024-07-30",
      plannedEnd: "2024-08-12",
      actualStart: "2024-08-05",
      actualEnd: "2024-08-16", // Caught up 4 more days
      milestones: [
        { name: "Cabinetry Installation", date: "2024-08-11", type: "delivery", status: "completed" },
        { name: "Fixing Carpentry Audit", date: "2024-08-15", type: "inspection", status: "completed" }
      ]
    },
    {
      id: "completion",
      name: "Completion",
      description: "Painting, tiling, floor coverings, final clean.",
      status: "completed-on-time", // Finished on/ahead of original schedule
      plannedStart: "2024-08-14",
      plannedEnd: "2024-09-02",
      actualStart: "2024-08-17",
      actualEnd: "2024-08-31", // Finished 2 days early!
      milestones: [
        { name: "Painting Inspection", date: "2024-08-25", type: "inspection", status: "completed" },
        { name: "Tiling & Floor Coverings", date: "2024-08-28", type: "delivery", status: "completed" }
      ]
    },
    {
      id: "handover",
      name: "Handover",
      description: "Final walkthrough with supervisor, key collection.",
      status: "completed-on-time",
      plannedStart: "2024-09-04",
      plannedEnd: "2024-09-08",
      actualStart: "2024-09-02",
      actualEnd: "2024-09-06", // Keys collected early!
      milestones: [
        { name: "Pre-Handover Inspection (PCI)", date: "2024-09-03", type: "inspection", status: "completed" },
        { name: "Key Handover Ceremony", date: "2024-09-06", type: "approval", status: "completed" }
      ]
    }
  ],
  delayLog: [
    {
      id: 1,
      date: "May 18, 2024",
      stageName: "Slab",
      title: "Slab Concrete Pour Postponed",
      fromDate: "2024-05-17",
      toDate: "2024-05-19",
      reason: "Concrete pump breakdown on site plus light afternoon storms required rescheduling the concrete pour for Monday morning.",
      type: "machinery"
    },
    {
      id: 2,
      date: "June 15, 2024",
      stageName: "Frame",
      title: "Severe Storm Delay",
      fromDate: "2024-07-10 (Original Est)",
      toDate: "2024-07-18 (Current Est)",
      reason: "High winds exceeding 60km/h and torrential rainfall halted framing works on scaffolding for 6 working days due to safety protocols.",
      type: "weather"
    },
    {
      id: 3,
      date: "Aug 20, 2024",
      stageName: "Fixing & Completion",
      title: "Double Crew Mobilisation",
      fromDate: "2024-09-08 (Est)",
      toDate: "2024-09-06 (Actual)",
      reason: "Supervisor scheduled dual plastering and tiling teams to work weekend shifts to accelerate completion and claw back 8 storm delay days.",
      type: "labor"
    }
  ]
};
