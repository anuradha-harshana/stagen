export interface Milestone {
  name: string;
  status: "completed" | "pending" | "upcoming" | "scheduled";
  date?: string;
}

export interface ProgressStage {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  startDate: string;
  endDate: string;
  isEstimated: boolean;
  milestones: Milestone[];
}

export interface ProgressPhoto {
  id: number;
  label: string;
  date: string;
  url: string;
  stageId: string;
  stageName: string;
  description: string;
}

export interface ProgressUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  stageId: string;
  stageName: string;
  type: "success" | "in-progress" | "info" | "warning";
}

export interface ProgressPageData {
  percentage: number;
  statusLabel: string;
  currentStageName: string;
  estimatedCompletion: string;
  daysRemaining: number;
  startedDate: string;
  stages: ProgressStage[];
  photos: ProgressPhoto[];
  updates: ProgressUpdate[];
}

// ---------------------------------------------------------
// 1. NOT STARTED (EMPTY STATE)
// ---------------------------------------------------------
export const notStartedData: ProgressPageData = {
  percentage: 0,
  statusLabel: "Pre-construction",
  currentStageName: "None Started",
  estimatedCompletion: "Dec 15, 2024 (Estimated)",
  daysRemaining: 150,
  startedDate: "Not Started",
  stages: [
    {
      id: "site-cut",
      name: "Site Cut",
      description: "Clearing the block, excavation of soil, leveling the building footprint, and setting up initial site drainage.",
      status: "upcoming",
      startDate: "Pending start",
      endDate: "Pending completion",
      isEstimated: true,
      milestones: [
        { name: "Site Pegout & Excavation", status: "upcoming" },
        { name: "Soil Compaction Assessment", status: "upcoming" }
      ]
    },
    {
      id: "slab",
      name: "Slab",
      description: "Underfloor plumbing lines laid, steel reinforcement grids installed, concrete poured and finished to form the foundation.",
      status: "upcoming",
      startDate: "Pending start",
      endDate: "Pending completion",
      isEstimated: true,
      milestones: [
        { name: "Underfloor Drainage Pipes", status: "upcoming" },
        { name: "Steel Reinforcement Inspection", status: "upcoming" },
        { name: "Foundation Concrete Pour", status: "upcoming" }
      ]
    },
    {
      id: "frame",
      name: "Frame",
      description: "Timber or steel framing erected for internal and external walls, structural support beams, and roof trusses installed.",
      status: "upcoming",
      startDate: "Pending start",
      endDate: "Pending completion",
      isEstimated: true,
      milestones: [
        { name: "Lower & Upper Wall Frames", status: "upcoming" },
        { name: "Structural Support Steelwork", status: "upcoming" },
        { name: "Roof Trusses and Gables", status: "upcoming" },
        { name: "Independent Frame Inspection", status: "upcoming" }
      ]
    },
    {
      id: "lockup",
      name: "Lockup",
      description: "External brickwork/cladding complete, roofing tiles/sheets laid, windows and external doors installed so the house is weather-tight.",
      status: "upcoming",
      startDate: "Pending start",
      endDate: "Pending completion",
      isEstimated: true,
      milestones: [
        { name: "Facia, Guttering & Roofing", status: "upcoming" },
        { name: "External Brickwork / Cladding", status: "upcoming" },
        { name: "Windows & Sliding Doors", status: "upcoming" }
      ]
    },
    {
      id: "fixing",
      name: "Fixing",
      description: "Internal plasterboard, skirting, internal doors, architraves, built-in cabinets, vanities, and kitchen cupboards are fitted.",
      status: "upcoming",
      startDate: "Pending start",
      endDate: "Pending completion",
      isEstimated: true,
      milestones: [
        { name: "Wall Plasterboard & Insulation", status: "upcoming" },
        { name: "Architraves & Skirtings", status: "upcoming" },
        { name: "Kitchen & Bathroom Joinery", status: "upcoming" }
      ]
    },
    {
      id: "completion",
      name: "Completion",
      description: "Painting, tiling, floor coverings, electrical and plumbing fit-offs, appliances installed, shower screens fitted, and final clean.",
      status: "upcoming",
      startDate: "Pending start",
      endDate: "Pending completion",
      isEstimated: true,
      milestones: [
        { name: "Internal Tiling & Paintwork", status: "upcoming" },
        { name: "Electrical & Plumbing Fittings", status: "upcoming" },
        { name: "Floor Coverings & Clean", status: "upcoming" }
      ]
    },
    {
      id: "handover",
      name: "Handover",
      description: "Final walkthrough with your site supervisor to inspect workmanship, address minor touch-ups, and receive the keys to your new home.",
      status: "upcoming",
      startDate: "Pending start",
      endDate: "Pending completion",
      isEstimated: true,
      milestones: [
        { name: "Pre-Handover Inspection (PCI)", status: "upcoming" },
        { name: "Key Handover Ceremony", status: "upcoming" }
      ]
    }
  ],
  photos: [],
  updates: []
};

// ---------------------------------------------------------
// 2. ACTIVE BUILD (CURRENT STATE - 42% COMPLETE)
// ---------------------------------------------------------
export const activeBuildData: ProgressPageData = {
  percentage: 42,
  statusLabel: "In Progress",
  currentStageName: "Frame",
  estimatedCompletion: "Aug 28, 2024",
  daysRemaining: 78,
  startedDate: "May 10, 2024",
  stages: [
    {
      id: "site-cut",
      name: "Site Cut",
      description: "Clearing the block, excavation of soil, leveling the building footprint, and setting up initial site drainage.",
      status: "completed",
      startDate: "May 10, 2024",
      endDate: "May 12, 2024",
      isEstimated: false,
      milestones: [
        { name: "Site Pegout & Excavation", status: "completed", date: "May 11, 2024" },
        { name: "Soil Compaction Assessment", status: "completed", date: "May 12, 2024" }
      ]
    },
    {
      id: "slab",
      name: "Slab",
      description: "Underfloor plumbing lines laid, steel reinforcement grids installed, concrete poured and finished to form the foundation.",
      status: "completed",
      startDate: "May 14, 2024",
      endDate: "May 18, 2024",
      isEstimated: false,
      milestones: [
        { name: "Underfloor Drainage Pipes", status: "completed", date: "May 15, 2024" },
        { name: "Steel Reinforcement Inspection", status: "completed", date: "May 17, 2024" },
        { name: "Foundation Concrete Pour", status: "completed", date: "May 18, 2024" }
      ]
    },
    {
      id: "frame",
      name: "Frame",
      description: "Timber or steel framing erected for internal and external walls, structural support beams, and roof trusses installed.",
      status: "in-progress",
      startDate: "May 20, 2024",
      endDate: "July 18, 2024 (Est.)",
      isEstimated: true,
      milestones: [
        { name: "Lower & Upper Wall Frames", status: "completed", date: "June 10, 2024" },
        { name: "Structural Support Steelwork", status: "completed", date: "June 24, 2024" },
        { name: "Roof Trusses and Gables", status: "completed", date: "July 2, 2024" },
        { name: "Independent Frame Inspection", status: "scheduled", date: "July 22, 2024" }
      ]
    },
    {
      id: "lockup",
      name: "Lockup",
      description: "External brickwork/cladding complete, roofing tiles/sheets laid, windows and external doors installed so the house is weather-tight.",
      status: "upcoming",
      startDate: "July 24, 2024 (Est.)",
      endDate: "Aug 10, 2024 (Est.)",
      isEstimated: true,
      milestones: [
        { name: "Facia, Guttering & Roofing", status: "upcoming" },
        { name: "External Brickwork / Cladding", status: "upcoming" },
        { name: "Windows & Sliding Doors", status: "upcoming" }
      ]
    },
    {
      id: "fixing",
      name: "Fixing",
      description: "Internal plasterboard, skirting, internal doors, architraves, built-in cabinets, vanities, and kitchen cupboards are fitted.",
      status: "upcoming",
      startDate: "Aug 12, 2024 (Est.)",
      endDate: "Aug 26, 2024 (Est.)",
      isEstimated: true,
      milestones: [
        { name: "Wall Plasterboard & Insulation", status: "upcoming" },
        { name: "Architraves & Skirtings", status: "upcoming" },
        { name: "Kitchen & Bathroom Joinery", status: "upcoming" }
      ]
    },
    {
      id: "completion",
      name: "Completion",
      description: "Painting, tiling, floor coverings, electrical and plumbing fit-offs, appliances installed, shower screens fitted, and final clean.",
      status: "upcoming",
      startDate: "Aug 28, 2024 (Est.)",
      endDate: "Sep 12, 2024 (Est.)",
      isEstimated: true,
      milestones: [
        { name: "Internal Tiling & Paintwork", status: "upcoming" },
        { name: "Electrical & Plumbing Fittings", status: "upcoming" },
        { name: "Floor Coverings & Clean", status: "upcoming" }
      ]
    },
    {
      id: "handover",
      name: "Handover",
      description: "Final walkthrough with your site supervisor to inspect workmanship, address minor touch-ups, and receive the keys to your new home.",
      status: "upcoming",
      startDate: "Sep 15, 2024 (Est.)",
      endDate: "Sep 18, 2024 (Est.)",
      isEstimated: true,
      milestones: [
        { name: "Pre-Handover Inspection (PCI)", status: "upcoming" },
        { name: "Key Handover Ceremony", status: "upcoming" }
      ]
    }
  ],
  photos: [
    {
      id: 1,
      label: "Site Clearing & Cutting",
      date: "May 11, 2024",
      url: "/images/building.png",
      stageId: "site-cut",
      stageName: "Site Cut",
      description: "Earthmoving equipment completed leveling of the building footprint and prepared the foundation soil base."
    },
    {
      id: 2,
      label: "Steel Mesh Reinforcement",
      date: "May 16, 2024",
      url: "/images/building.png",
      stageId: "slab",
      stageName: "Slab",
      description: "Steel reinforcement rebar grid and drainage lines completed in preparation for tomorrow's structural inspection."
    },
    {
      id: 3,
      label: "Slab Foundation Poured",
      date: "May 18, 2024",
      url: "/images/building.png",
      stageId: "slab",
      stageName: "Slab",
      description: "Concrete poured, leveled, and finished. The slab will cure for 48 hours before framing materials are delivered."
    },
    {
      id: 4,
      label: "Exterior Timber Frame Setup",
      date: "June 10, 2024",
      url: "/images/framing_front.png",
      stageId: "frame",
      stageName: "Frame",
      description: "Lower level timber studs framing completed. The structural shape of the house begins to emerge."
    },
    {
      id: 5,
      label: "Interior Frame Sections",
      date: "June 25, 2024",
      url: "/images/interior_frame.png",
      stageId: "frame",
      stageName: "Frame",
      description: "Wall frames and support lintels erected for internal bedrooms, hallway, and living room areas."
    },
    {
      id: 6,
      label: "Roof Trusses Assembled",
      date: "July 2, 2024",
      url: "/images/roof_trusses.png",
      stageId: "frame",
      stageName: "Frame",
      description: "Roof trusses hoisted and braced in place. Ready for fascia boards, roof sheet insulation, and wall wraps."
    }
  ],
  updates: [
    {
      id: 1,
      title: "Roof trusses braced and anchored",
      description: "The main structural roof trusses have been successfully hoisted and locked onto the wall top-plates.",
      date: "July 2, 2024 - 03:30 PM",
      stageId: "frame",
      stageName: "Frame",
      type: "success"
    },
    {
      id: 2,
      title: "Framing timber delivered to site",
      description: "All structural pine framing timber for roof trusses and structural beams arrived safely at the building site.",
      date: "June 28, 2024 - 10:15 AM",
      stageId: "frame",
      stageName: "Frame",
      type: "info"
    },
    {
      id: 3,
      title: "Internal walls frame check complete",
      description: "Supervisor verified load-bearing wall timber placement and alignment against building architectural designs.",
      date: "June 20, 2024 - 11:30 AM",
      stageId: "frame",
      stageName: "Frame",
      type: "success"
    },
    {
      id: 4,
      title: "Lower level timber frame erected",
      description: "Carpenters have completed the framing for all ground-floor bedrooms, kitchen, and bathroom dividers.",
      date: "June 10, 2024 - 04:00 PM",
      stageId: "frame",
      stageName: "Frame",
      type: "success"
    },
    {
      id: 5,
      title: "Weather delay expected this week",
      description: "Strong winds and storms might impact external building framing schedules. Safety first on scaffolding.",
      date: "May 28, 2024 - 08:00 AM",
      stageId: "frame",
      stageName: "Frame",
      type: "warning"
    },
    {
      id: 6,
      title: "Concrete slab poured",
      description: "Concrete mixers poured foundation mix. Supervisors confirmed smooth, flat slab finish according to structural guidelines.",
      date: "May 18, 2024 - 02:45 PM",
      stageId: "slab",
      stageName: "Slab",
      type: "success"
    },
    {
      id: 7,
      title: "Underfloor plumbing lines inspection",
      description: "Plumbing inspector signed off on underfloor PVC drain connections and copper pipes routing.",
      date: "May 15, 2024 - 09:30 AM",
      stageId: "slab",
      stageName: "Slab",
      type: "success"
    },
    {
      id: 8,
      title: "Ground excavation completed",
      description: "Excavator cleared high-level soil, leveled building outline, and layered gravel for slab under-fill.",
      date: "May 12, 2024 - 01:15 PM",
      stageId: "site-cut",
      stageName: "Site Cut",
      type: "success"
    }
  ]
};

// ---------------------------------------------------------
// 3. HANDOVER COMPLETE (100% COMPLETE)
// ---------------------------------------------------------
export const completedData: ProgressPageData = {
  percentage: 100,
  statusLabel: "Completed",
  currentStageName: "Handover Done",
  estimatedCompletion: "Aug 28, 2024",
  daysRemaining: 0,
  startedDate: "May 10, 2024",
  stages: [
    {
      id: "site-cut",
      name: "Site Cut",
      description: "Clearing the block, excavation of soil, leveling the building footprint, and setting up initial site drainage.",
      status: "completed",
      startDate: "May 10, 2024",
      endDate: "May 12, 2024",
      isEstimated: false,
      milestones: [
        { name: "Site Pegout & Excavation", status: "completed", date: "May 11, 2024" },
        { name: "Soil Compaction Assessment", status: "completed", date: "May 12, 2024" }
      ]
    },
    {
      id: "slab",
      name: "Slab",
      description: "Underfloor plumbing lines laid, steel reinforcement grids installed, concrete poured and finished to form the foundation.",
      status: "completed",
      startDate: "May 14, 2024",
      endDate: "May 18, 2024",
      isEstimated: false,
      milestones: [
        { name: "Underfloor Drainage Pipes", status: "completed", date: "May 15, 2024" },
        { name: "Steel Reinforcement Inspection", status: "completed", date: "May 17, 2024" },
        { name: "Foundation Concrete Pour", status: "completed", date: "May 18, 2024" }
      ]
    },
    {
      id: "frame",
      name: "Frame",
      description: "Timber or steel framing erected for internal and external walls, structural support beams, and roof trusses installed.",
      status: "completed",
      startDate: "May 20, 2024",
      endDate: "July 12, 2024",
      isEstimated: false,
      milestones: [
        { name: "Lower & Upper Wall Frames", status: "completed", date: "June 10, 2024" },
        { name: "Structural Support Steelwork", status: "completed", date: "June 24, 2024" },
        { name: "Roof Trusses and Gables", status: "completed", date: "July 2, 2024" },
        { name: "Independent Frame Inspection", status: "completed", date: "July 12, 2024" }
      ]
    },
    {
      id: "lockup",
      name: "Lockup",
      description: "External brickwork/cladding complete, roofing tiles/sheets laid, windows and external doors installed so the house is weather-tight.",
      status: "completed",
      startDate: "July 15, 2024",
      endDate: "Aug 2, 2024",
      isEstimated: false,
      milestones: [
        { name: "Facia, Guttering & Roofing", status: "completed", date: "July 22, 2024" },
        { name: "External Brickwork / Cladding", status: "completed", date: "July 30, 2024" },
        { name: "Windows & Sliding Doors", status: "completed", date: "Aug 2, 2024" }
      ]
    },
    {
      id: "fixing",
      name: "Fixing",
      description: "Internal plasterboard, skirting, internal doors, architraves, built-in cabinets, vanities, and kitchen cupboards are fitted.",
      status: "completed",
      startDate: "Aug 5, 2024",
      endDate: "Aug 20, 2024",
      isEstimated: false,
      milestones: [
        { name: "Wall Plasterboard & Insulation", status: "completed", date: "Aug 12, 2024" },
        { name: "Architraves & Skirtings", status: "completed", date: "Aug 16, 2024" },
        { name: "Kitchen & Bathroom Joinery", status: "completed", date: "Aug 20, 2024" }
      ]
    },
    {
      id: "completion",
      name: "Completion",
      description: "Painting, tiling, floor coverings, electrical and plumbing fit-offs, appliances installed, shower screens fitted, and final clean.",
      status: "completed",
      startDate: "Aug 21, 2024",
      endDate: "Aug 25, 2024",
      isEstimated: false,
      milestones: [
        { name: "Internal Tiling & Paintwork", status: "completed", date: "Aug 22, 2024" },
        { name: "Electrical & Plumbing Fittings", status: "completed", date: "Aug 24, 2024" },
        { name: "Floor Coverings & Clean", status: "completed", date: "Aug 25, 2024" }
      ]
    },
    {
      id: "handover",
      name: "Handover",
      description: "Final walkthrough with your site supervisor to inspect workmanship, address minor touch-ups, and receive the keys to your new home.",
      status: "completed",
      startDate: "Aug 26, 2024",
      endDate: "Aug 28, 2024",
      isEstimated: false,
      milestones: [
        { name: "Pre-Handover Inspection (PCI)", status: "completed", date: "Aug 27, 2024" },
        { name: "Key Handover Ceremony", status: "completed", date: "Aug 28, 2024" }
      ]
    }
  ],
  photos: [
    {
      id: 1,
      label: "Site Cutting & Clearing",
      date: "May 11, 2024",
      url: "/images/building.png",
      stageId: "site-cut",
      stageName: "Site Cut",
      description: "Preparation of foundation plot, leveling soil and packing base layer gravel."
    },
    {
      id: 2,
      label: "Pouring concrete foundation",
      date: "May 18, 2024",
      url: "/images/building.png",
      stageId: "slab",
      stageName: "Slab",
      description: "Concrete mixers pouring active slabs. Vibrators used to level and consolidate foundation cement."
    },
    {
      id: 3,
      label: "Timber frame external structural",
      date: "June 10, 2024",
      url: "/images/framing_front.png",
      stageId: "frame",
      stageName: "Frame",
      description: "Lower timber studs setup. The outline of the front porch and entry foyer are finished."
    },
    {
      id: 4,
      label: "Roof Trusses Anchor Structure",
      date: "July 2, 2024",
      url: "/images/roof_trusses.png",
      stageId: "frame",
      stageName: "Frame",
      description: "Main roof framing rafters completed and anchored securely to exterior support structure."
    },
    {
      id: 5,
      label: "Window framing & external brickwork",
      date: "July 28, 2024",
      url: "/images/building.png",
      stageId: "lockup",
      stageName: "Lockup",
      description: "Exterior brick walls constructed around lower and upper floor boundaries. Windows installed."
    },
    {
      id: 6,
      label: "Cabinetry and tiling finished",
      date: "Aug 20, 2024",
      url: "/images/building.png",
      stageId: "fixing",
      stageName: "Fixing",
      description: "Internal plaster walls coated, bathroom cabinets fitted and marble kitchen countertops secured."
    },
    {
      id: 7,
      label: "Final completed facade",
      date: "Aug 28, 2024",
      url: "/images/building.png",
      stageId: "handover",
      stageName: "Handover",
      description: "Keys collected! Handover ceremony complete and driveways cleaned up for move-in."
    }
  ],
  updates: [
    {
      id: 1,
      title: "Keys handed over to homeowners",
      description: "Congratulations! Site supervisor finished pre-handover fixes and gave customer the physical keys.",
      date: "Aug 28, 2024 - 11:30 AM",
      stageId: "handover",
      stageName: "Handover",
      type: "success"
    },
    {
      id: 2,
      title: "Pre-handover audit walkthrough complete",
      description: "Client walked through site and noted minor paint issues, which were immediate touched-up.",
      date: "Aug 27, 2024 - 09:00 AM",
      stageId: "handover",
      stageName: "Handover",
      type: "info"
    },
    {
      id: 3,
      title: "Appliances and final detailing clean",
      description: "Carpets vacuumed, floors scrubbed, kitchen range and oven installed. Final occupancy certificate obtained.",
      date: "Aug 25, 2024 - 04:30 PM",
      stageId: "completion",
      stageName: "Completion",
      type: "success"
    },
    {
      id: 4,
      title: "Plaster wall paint completed",
      description: "Interior walls received 3 coats of premium cream paint. Wet-areas tiled and silicone sealed.",
      date: "Aug 22, 2024 - 03:00 PM",
      stageId: "completion",
      stageName: "Completion",
      type: "success"
    },
    {
      id: 5,
      title: "Skirtingboards and doors hung",
      description: "Internal wood fitters completed framing inside archways, skirtings, and bedroom doors.",
      date: "Aug 16, 2024 - 12:00 PM",
      stageId: "fixing",
      stageName: "Fixing",
      type: "success"
    },
    {
      id: 6,
      title: "Roof weatherproofing complete",
      description: "Installed tiles and insulation wrap. House is now officially locked and weather-proof.",
      date: "Aug 2, 2024 - 02:00 PM",
      stageId: "lockup",
      stageName: "Lockup",
      type: "success"
    },
    {
      id: 7,
      title: "Slab foundation complete",
      description: "Foundation concrete set and inspected. Excellent strength rating obtained.",
      date: "May 18, 2024 - 02:45 PM",
      stageId: "slab",
      stageName: "Slab",
      type: "success"
    },
    {
      id: 8,
      title: "Earth cleared and pegout completed",
      description: "Excavator cleared high-level soil, leveled building outline, and layered gravel for slab under-fill.",
      date: "May 12, 2024 - 01:15 PM",
      stageId: "site-cut",
      stageName: "Site Cut",
      type: "success"
    }
  ]
};
