import type { TimelinePageData as BaseTimeline, DelayLogEntry as BaseDelay } from "../timeline/data";
export type { TimelineStage, TimelineMilestone } from "../timeline/data";
export type DelayLogEntry = Omit<BaseDelay, "id" | "type"> & { id: string | number; type: BaseDelay["type"] | "other" };
export type TimelinePageData = Omit<BaseTimeline, "delayLog"> & { delayLog: DelayLogEntry[] };
export interface CustomerTimelineProject {
  id: string;
  name: string;
  address: string;
  timeline: TimelinePageData;
}
