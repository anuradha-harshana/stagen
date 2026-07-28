"use client";

import { INITIAL_PROJECTS, Project } from "@/lib/db-mock/projectsData";

export interface SitePhoto {
  id: string;
  projectId: string;
  stageName: string;
  url: string;
  fileName: string;
  fileSize: number; // bytes
  uploaderName: string;
  uploaderId: string;
  timestamp: string;
  caption?: string;
  gradient?: string;
}

export const STAGE_NAMES = [
  "Site Cut",
  "Slab",
  "Frame",
  "Lockup",
  "Fixing",
  "Completion",
  "Handover",
] as const;

export type StageName = typeof STAGE_NAMES[number];

// Initial mock photo gallery data for supervisor portal demonstration
export const INITIAL_SITE_PHOTOS: SitePhoto[] = [
  // Lot 104 - Site Cut
  {
    id: "photo-104-sc-1",
    projectId: "lot-104",
    stageName: "Site Cut",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=800",
    fileName: "site_excavation_lot104.jpg",
    fileSize: 2450000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "Mar 12, 2026 09:30 AM",
    caption: "Soil leveling completed. Retaining wall footings marked out.",
  },
  {
    id: "photo-104-sc-2",
    projectId: "lot-104",
    stageName: "Site Cut",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    fileName: "survey_pegs_lot104.jpg",
    fileSize: 1890000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "Mar 14, 2026 02:15 PM",
    caption: "Surveyor pegs verified for boundary set-back clearance.",
  },
  // Lot 104 - Slab
  {
    id: "photo-104-sl-1",
    projectId: "lot-104",
    stageName: "Slab",
    url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800",
    fileName: "slab_pour_inspection.jpg",
    fileSize: 3120000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "Apr 02, 2026 11:00 AM",
    caption: "Concrete pour complete. Curing compound applied evenly.",
  },
  {
    id: "photo-104-sl-2",
    projectId: "lot-104",
    stageName: "Slab",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    fileName: "underslab_plumbing.jpg",
    fileSize: 2040000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "Apr 05, 2026 04:45 PM",
    caption: "Under-slab drainage test passed with Council inspector.",
  },
  // Lot 104 - Frame
  {
    id: "photo-104-fr-1",
    projectId: "lot-104",
    stageName: "Frame",
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
    fileName: "wall_frames_ground_floor.jpg",
    fileSize: 2850000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "Jul 10, 2026 10:20 AM",
    caption: "Ground floor timber frames erected and braced.",
  },
  {
    id: "photo-104-fr-2",
    projectId: "lot-104",
    stageName: "Frame",
    url: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=800",
    fileName: "roof_trusses_lift.jpg",
    fileSize: 3400000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "Jul 18, 2026 01:15 PM",
    caption: "Roof trusses craned into position and tied off.",
  },

  // Lot 208 - Site Cut
  {
    id: "photo-208-sc-1",
    projectId: "lot-208",
    stageName: "Site Cut",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    fileName: "lot208_excavation.jpg",
    fileSize: 1950000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "May 04, 2026 08:30 AM",
    caption: "Site cut cleared and prepped for drainage installation.",
  },
  // Lot 208 - Slab
  {
    id: "photo-208-sl-1",
    projectId: "lot-208",
    stageName: "Slab",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    fileName: "lot208_formwork.jpg",
    fileSize: 2210000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "Jun 12, 2026 03:10 PM",
    caption: "Slab formwork set up. Awaiting mesh delivery after rain delay.",
  },

  // Lot 312 - Lockup
  {
    id: "photo-312-lk-1",
    projectId: "lot-312",
    stageName: "Lockup",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    fileName: "brickwork_west_elevation.jpg",
    fileSize: 2780000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "May 22, 2026 04:00 PM",
    caption: "Brick veneer cladding progress on west elevation.",
  },
  // Lot 312 - Fixing
  {
    id: "photo-312-fx-1",
    projectId: "lot-312",
    stageName: "Fixing",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    fileName: "plasterboard_fixing.jpg",
    fileSize: 3100000,
    uploaderName: "Eric (Supervisor)",
    uploaderId: "7ab56015-4412-494e-8aff-dbb5095e0097",
    timestamp: "Jul 15, 2026 02:45 PM",
    caption: "Plasterboard sheeting & architrave installation in progress.",
  },
];

export const MOCK_EXTRA_PROJECTS: Project[] = [
  ...INITIAL_PROJECTS,
  {
    id: "lot-405",
    clientName: "David & Claire Miller",
    address: "Lot 405, 14 Parkview Crescent, Berwick VIC",
    status: "On Track",
    progress: 90,
    currentStage: "Completion",
    startDate: "Nov 10, 2025",
    estHandover: "Aug 30, 2026",
    imageGradient: "from-blue-fantastic/40 to-abyssal-blue/80",
    stages: [
      { name: "Site Cut", status: "Completed", progress: 100, checklist: [] },
      { name: "Slab", status: "Completed", progress: 100, checklist: [] },
      { name: "Frame", status: "Completed", progress: 100, checklist: [] },
      { name: "Lockup", status: "Completed", progress: 100, checklist: [] },
      { name: "Fixing", status: "Completed", progress: 100, checklist: [] },
      { name: "Completion", status: "Active", progress: 60, checklist: [] },
      { name: "Handover", status: "Pending", progress: 0, checklist: [] },
    ],
    delays: [],
    questions: [],
  },
  {
    id: "lot-510",
    clientName: "Robert & Hannah Taylor",
    address: "Lot 510, 77 Meadowbank Way, Point Cook VIC",
    status: "On Track",
    progress: 5,
    currentStage: "Site Cut",
    startDate: "Jul 01, 2026",
    estHandover: "Mar 15, 2027",
    imageGradient: "from-truffle-trouble/40 to-abyssal-blue/80",
    stages: [
      { name: "Site Cut", status: "Active", progress: 40, checklist: [] },
      { name: "Slab", status: "Pending", progress: 0, checklist: [] },
      { name: "Frame", status: "Pending", progress: 0, checklist: [] },
      { name: "Lockup", status: "Pending", progress: 0, checklist: [] },
      { name: "Fixing", status: "Pending", progress: 0, checklist: [] },
      { name: "Completion", status: "Pending", progress: 0, checklist: [] },
      { name: "Handover", status: "Pending", progress: 0, checklist: [] },
    ],
    delays: [],
    questions: [],
  },
];

/**
 * Returns construction projects assigned to a given supervisor.
 */
export function getAssignedProjects(supervisorId?: string): Project[] {
  return MOCK_EXTRA_PROJECTS;
}
