export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Stage {
  name: "Site Cut" | "Slab" | "Frame" | "Lockup" | "Fixing" | "Completion" | "Handover";
  status: "Completed" | "Active" | "Pending";
  progress: number; // 0-100 for this stage
  checklist: ChecklistItem[];
}

export interface DelayLog {
  id: string;
  type: "Weather" | "Materials" | "Inspections" | "Trade Availability";
  durationDays: number;
  description: string;
  date: string;
}

export interface CustomerQuestion {
  id: string;
  customerName: string;
  questionText: string;
  date: string;
  replied: boolean;
  replyText?: string;
}

export interface Project {
  id: string;
  clientName: string;
  address: string;
  status: "On Track" | "Delayed" | "Action Required" | "Completed";
  progress: number; // overall progress 0-100
  currentStage: "Site Cut" | "Slab" | "Frame" | "Lockup" | "Fixing" | "Completion" | "Handover";
  startDate: string;
  estHandover: string;
  imageGradient: string;
  stages: Stage[];
  delays: DelayLog[];
  questions: CustomerQuestion[];
  supervisorName?: string;
  region?: "NSW" | "VIC" | "QLD" | "WA" | "SA";
  delayDays?: number;
  lastUpdate?: string;
  riskSeverity?: "Critical" | "High" | "Medium" | "Low";
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "lot-104",
    clientName: "Anuradha Harshana",
    address: "Lot 104, 12 Harrison Street, Richmond VIC",
    status: "On Track",
    progress: 45,
    currentStage: "Frame",
    startDate: "Mar 10, 2026",
    estHandover: "Nov 15, 2026",
    imageGradient: "from-blue-fantastic/40 to-abyssal-blue/80",
    supervisorName: "Eric",
    stages: [
      {
        name: "Site Cut",
        status: "Completed",
        progress: 100,
        checklist: [
          { id: "sc-1", label: "Soil testing & site survey", completed: true },
          { id: "sc-2", label: "Excavation & site leveling", completed: true },
          { id: "sc-3", label: "Retaining walls (if required)", completed: true }
        ]
      },
      {
        name: "Slab",
        status: "Completed",
        progress: 100,
        checklist: [
          { id: "sl-1", label: "Under-slab plumbing drainage", completed: true },
          { id: "sl-2", label: "Formwork & steel reinforcement", completed: true },
          { id: "sl-3", label: "Concrete pour & curing check", completed: true },
          { id: "sl-4", label: "Termite protection collar install", completed: true }
        ]
      },
      {
        name: "Frame",
        status: "Active",
        progress: 60,
        checklist: [
          { id: "fr-1", label: "Wall frames erection", completed: true },
          { id: "fr-2", label: "Roof trusses & bracing install", completed: true },
          { id: "fr-3", label: "Window & external door frames", completed: false },
          { id: "fr-4", label: "Structural steel lintels", completed: false }
        ]
      },
      {
        name: "Lockup",
        status: "Pending",
        progress: 0,
        checklist: [
          { id: "lk-1", label: "Roof cladding (tiles/colorbond)", completed: false },
          { id: "lk-2", label: "Brickwork / external cladding", completed: false },
          { id: "lk-3", label: "Electrical & plumbing rough-in", completed: false },
          { id: "lk-4", label: "External wall insulation", completed: false }
        ]
      },
      {
        name: "Fixing",
        status: "Pending",
        progress: 0,
        checklist: [
          { id: "fx-1", label: "Plasterboard lining & sheeting", completed: false },
          { id: "fx-2", label: "Architraves, skirting & doors fixing", completed: false },
          { id: "fx-3", label: "Waterproofing of wet areas", completed: false },
          { id: "fx-4", label: "Cabinetry & vanities install", completed: false }
        ]
      },
      {
        name: "Completion",
        status: "Pending",
        progress: 0,
        checklist: [
          { id: "cp-1", label: "Tiling & flooring installation", completed: false },
          { id: "cp-2", label: "Painting & electric trim fit-off", completed: false },
          { id: "cp-3", label: "PC items & tapware installation", completed: false },
          { id: "cp-4", label: "Final cleaning & quality audit", completed: false }
        ]
      },
      {
        name: "Handover",
        status: "Pending",
        progress: 0,
        checklist: [
          { id: "ho-1", label: "Practical Completion Inspection (PCI)", completed: false },
          { id: "ho-2", label: "Rectification of PCI items", completed: false },
          { id: "ho-3", label: "Final payment & keys handover", completed: false }
        ]
      }
    ],
    delays: [
      {
        id: "d-1",
        type: "Weather",
        durationDays: 4,
        description: "Heavy rainfall delayed foundation earthworks",
        date: "Mar 15, 2026"
      }
    ],
    questions: [
      {
        id: "q-101",
        customerName: "Anuradha Harshana",
        questionText: "Hi John, when are the windows scheduled to be delivered? I noticed the frames are up but no glass yet.",
        date: "Jul 21, 2026",
        replied: false
      },
      {
        id: "q-102",
        customerName: "Anuradha Harshana",
        questionText: "Can we arrange a site walkthrough once the frame stage is complete?",
        date: "Jul 20, 2026",
        replied: true,
        replyText: "Hi Anuradha, absolutely. Once the certifier signs off on the framing next week, I will schedule our walkthrough inspection."
      }
    ]
  },
  {
    id: "lot-208",
    clientName: "Sarah Jenkins",
    address: "Lot 208, 45 Windmill Lane, Sunbury VIC",
    status: "Delayed",
    progress: 18,
    currentStage: "Slab",
    startDate: "May 1, 2026",
    estHandover: "Jan 20, 2027",
    imageGradient: "from-truffle-trouble/40 to-abyssal-blue/80",
    supervisorName: "Eric",
    stages: [
      {
        name: "Site Cut",
        status: "Completed",
        progress: 100,
        checklist: [
          { id: "sc-201", label: "Soil testing & site survey", completed: true },
          { id: "sc-202", label: "Excavation & site leveling", completed: true },
          { id: "sc-203", label: "Retaining walls (if required)", completed: true }
        ]
      },
      {
        name: "Slab",
        status: "Active",
        progress: 30,
        checklist: [
          { id: "sl-201", label: "Under-slab plumbing drainage", completed: true },
          { id: "sl-202", label: "Formwork & steel reinforcement", completed: false },
          { id: "sl-203", label: "Concrete pour & curing check", completed: false },
          { id: "sl-204", label: "Termite protection collar install", completed: false }
        ]
      },
      {
        name: "Frame",
        status: "Pending",
        progress: 0,
        checklist: [
          { id: "fr-201", label: "Wall frames erection", completed: false },
          { id: "fr-202", label: "Roof trusses & bracing install", completed: false },
          { id: "fr-203", label: "Window & external door frames", completed: false },
          { id: "fr-204", label: "Structural steel lintels", completed: false }
        ]
      },
      {
        name: "Lockup",
        status: "Pending",
        progress: 0,
        checklist: []
      },
      {
        name: "Fixing",
        status: "Pending",
        progress: 0,
        checklist: []
      },
      {
        name: "Completion",
        status: "Pending",
        progress: 0,
        checklist: []
      },
      {
        name: "Handover",
        status: "Pending",
        progress: 0,
        checklist: []
      }
    ],
    delays: [
      {
        id: "d-201",
        type: "Weather",
        durationDays: 8,
        description: "Extended rainy period prevented under-slab plumbing works",
        date: "May 10, 2026"
      },
      {
        id: "d-202",
        type: "Materials",
        durationDays: 5,
        description: "Delay in delivery of steel reinforcement mesh",
        date: "Jun 02, 2026"
      }
    ],
    questions: [
      {
        id: "q-201",
        customerName: "Sarah Jenkins",
        questionText: "Hello! We noticed there hasn't been much activity on-site since the plumbing lines were laid down. Is everything okay?",
        date: "Jul 18, 2026",
        replied: false
      }
    ]
  },
  {
    id: "lot-312",
    clientName: "Marcus & Elena Vance",
    address: "Lot 312, 88 Ridgeview Drive, Croydon VIC",
    status: "On Track",
    progress: 75,
    currentStage: "Fixing",
    startDate: "Jan 15, 2026",
    estHandover: "Sep 5, 2026",
    imageGradient: "from-burning-flame/30 to-abyssal-blue/80",
    stages: [
      {
        name: "Site Cut",
        status: "Completed",
        progress: 100,
        checklist: [
          { id: "sc-301", label: "Soil testing & site survey", completed: true },
          { id: "sc-302", label: "Excavation & site leveling", completed: true }
        ]
      },
      {
        name: "Slab",
        status: "Completed",
        progress: 100,
        checklist: [
          { id: "sl-301", label: "Under-slab plumbing drainage", completed: true },
          { id: "sl-302", label: "Formwork & concrete slab pour", completed: true }
        ]
      },
      {
        name: "Frame",
        status: "Completed",
        progress: 100,
        checklist: [
          { id: "fr-301", label: "Frames & truss installation", completed: true }
        ]
      },
      {
        name: "Lockup",
        status: "Completed",
        progress: 100,
        checklist: [
          { id: "lk-301", label: "Brickwork & roofing tile sheet", completed: true },
          { id: "lk-302", label: "Windows and outer doors lockup", completed: true }
        ]
      },
      {
        name: "Fixing",
        status: "Active",
        progress: 50,
        checklist: [
          { id: "fx-301", label: "Plasterboard sheeting", completed: true },
          { id: "fx-302", label: "Wet area waterproofing", completed: true },
          { id: "fx-303", label: "Architraves & doors hanging", completed: false },
          { id: "fx-304", label: "Cabinetry installation", completed: false }
        ]
      },
      {
        name: "Completion",
        status: "Pending",
        progress: 0,
        checklist: [
          { id: "cp-301", label: "Floor tiling & carpet installation", completed: false },
          { id: "cp-302", label: "Electrical & plumbing trim fit-out", completed: false }
        ]
      },
      {
        name: "Handover",
        status: "Pending",
        progress: 0,
        checklist: [
          { id: "ho-301", label: "PCI and final sign-off", completed: false }
        ]
      }
    ],
    delays: [],
    questions: [
      {
        id: "q-301",
        customerName: "Marcus Vance",
        questionText: "Can we select the paint finish for the feature wall now, or is it too late?",
        date: "Jul 22, 2026",
        replied: false
      }
    ]
  },
  {
    id: "P-1028",
    clientName: "John Smith",
    address: "14 Sydney Harbour Way, Parramatta NSW",
    status: "Delayed",
    progress: 62,
    currentStage: "Lockup",
    startDate: "Feb 01, 2026",
    estHandover: "Oct 30, 2026",
    imageGradient: "from-truffle-trouble/40 to-abyssal-blue/80",
    supervisorName: "John Smith",
    region: "NSW",
    delayDays: 7,
    lastUpdate: "May 13, 2024",
    riskSeverity: "Critical",
    stages: [
      { name: "Site Cut", status: "Completed", progress: 100, checklist: [] },
      { name: "Slab", status: "Completed", progress: 100, checklist: [] },
      { name: "Frame", status: "Completed", progress: 100, checklist: [] },
      { name: "Lockup", status: "Active", progress: 62, checklist: [] },
      { name: "Fixing", status: "Pending", progress: 0, checklist: [] },
      { name: "Completion", status: "Pending", progress: 0, checklist: [] },
      { name: "Handover", status: "Pending", progress: 0, checklist: [] }
    ],
    delays: [
      { id: "d-1028", type: "Weather", durationDays: 7, description: "Heavy torrential rain damaged external cladding rough-in.", date: "May 10, 2024" }
    ],
    questions: []
  },
  {
    id: "P-1033",
    clientName: "Emily Johnson",
    address: "78 Collins Street, Melbourne VIC",
    status: "Delayed",
    progress: 47,
    currentStage: "Fixing",
    startDate: "Jan 12, 2026",
    estHandover: "Nov 05, 2026",
    imageGradient: "from-truffle-trouble/40 to-abyssal-blue/80",
    supervisorName: "David Brown",
    region: "VIC",
    delayDays: 5,
    lastUpdate: "May 12, 2024",
    riskSeverity: "High",
    stages: [
      { name: "Site Cut", status: "Completed", progress: 100, checklist: [] },
      { name: "Slab", status: "Completed", progress: 100, checklist: [] },
      { name: "Frame", status: "Completed", progress: 100, checklist: [] },
      { name: "Lockup", status: "Completed", progress: 100, checklist: [] },
      { name: "Fixing", status: "Active", progress: 47, checklist: [] },
      { name: "Completion", status: "Pending", progress: 0, checklist: [] },
      { name: "Handover", status: "Pending", progress: 0, checklist: [] }
    ],
    delays: [
      { id: "d-1033", type: "Materials", durationDays: 5, description: "Delay in delivery of custom plasterboard sheeting.", date: "May 08, 2024" }
    ],
    questions: []
  },
  {
    id: "P-1041",
    clientName: "Michael Williams",
    address: "23 Gold Coast Hwy, Surfers Paradise QLD",
    status: "Action Required",
    progress: 35,
    currentStage: "Frame",
    startDate: "Mar 01, 2026",
    estHandover: "Dec 12, 2026",
    imageGradient: "from-burning-flame/40 to-abyssal-blue/80",
    supervisorName: "Michael Lee",
    region: "QLD",
    delayDays: 4,
    lastUpdate: "May 11, 2024",
    riskSeverity: "Medium",
    stages: [
      { name: "Site Cut", status: "Completed", progress: 100, checklist: [] },
      { name: "Slab", status: "Completed", progress: 100, checklist: [] },
      { name: "Frame", status: "Active", progress: 35, checklist: [] },
      { name: "Lockup", status: "Pending", progress: 0, checklist: [] },
      { name: "Fixing", status: "Pending", progress: 0, checklist: [] },
      { name: "Completion", status: "Pending", progress: 0, checklist: [] },
      { name: "Handover", status: "Pending", progress: 0, checklist: [] }
    ],
    delays: [
      { id: "d-1041", type: "Trade Availability", durationDays: 4, description: "Carpenter shortage on structural framing inspection.", date: "May 07, 2024" }
    ],
    questions: []
  },
  {
    id: "P-1048",
    clientName: "Sarah Brown",
    address: "5 Ocean Drive, Perth WA",
    status: "Action Required",
    progress: 18,
    currentStage: "Slab",
    startDate: "Apr 05, 2026",
    estHandover: "Jan 18, 2027",
    imageGradient: "from-burning-flame/40 to-abyssal-blue/80",
    supervisorName: "Sarah Johnson",
    region: "WA",
    delayDays: 3,
    lastUpdate: "May 10, 2024",
    riskSeverity: "Low",
    stages: [
      { name: "Site Cut", status: "Completed", progress: 100, checklist: [] },
      { name: "Slab", status: "Active", progress: 18, checklist: [] },
      { name: "Frame", status: "Pending", progress: 0, checklist: [] },
      { name: "Lockup", status: "Pending", progress: 0, checklist: [] },
      { name: "Fixing", status: "Pending", progress: 0, checklist: [] },
      { name: "Completion", status: "Pending", progress: 0, checklist: [] },
      { name: "Handover", status: "Pending", progress: 0, checklist: [] }
    ],
    delays: [
      { id: "d-1048", type: "Inspections", durationDays: 3, description: "Council certifier delayed soil density signoff.", date: "May 09, 2024" }
    ],
    questions: []
  }
];

export const INITIAL_ACTIVITIES = [
  { id: "act-1", text: "Plasterboard sheeting completed for Lot 312", time: "2 hours ago", project: "Lot 312" },
  { id: "act-2", text: "Wet area waterproofing certified for Lot 312", time: "1 day ago", project: "Lot 312" },
  { id: "act-3", text: "Wall frames erection completed & signed off for Lot 104", time: "2 days ago", project: "Lot 104" },
  { id: "act-4", text: "Under-slab plumbing drainage inspect passed for Lot 208", time: "3 days ago", project: "Lot 208" },
  { id: "act-5", text: "Roof trusses & bracing installed for Lot 104", time: "5 days ago", project: "Lot 104" }
];
