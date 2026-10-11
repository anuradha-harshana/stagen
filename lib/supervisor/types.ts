import type { DelayLogEntry as BaseDelay, TimelinePageData as BaseTimeline } from "../timeline/data";
export type { TimelineStage, TimelineMilestone } from "../timeline/data";
export type DelayLogEntry = Omit<BaseDelay, "id"> & { id: string | number };
export type TimelinePageData = Omit<BaseTimeline, "delayLog"> & { delayLog: DelayLogEntry[] };
