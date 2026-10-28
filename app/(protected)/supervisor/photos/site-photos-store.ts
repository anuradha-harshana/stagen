"use client";

import { Project } from "@/lib/types/project";

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

// Empty initial state; records are fetched through the supervisor API.
export const INITIAL_SITE_PHOTOS: SitePhoto[] = [];

export const EMPTY_PROJECTS: Project[] = [];

/**
 * Returns construction projects assigned to a given supervisor.
 */
export function getAssignedProjects(supervisorId?: string): Project[] {
  return EMPTY_PROJECTS;
}
