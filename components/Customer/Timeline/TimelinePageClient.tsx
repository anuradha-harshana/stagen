"use client";

import { useEffect, useState } from "react";
import TimelineHeader from "./TimelineHeader";
import ZoomToggle, { ZoomScale } from "./ZoomToggle";
import GanttChart from "./GanttChart";
import MobileTimeline from "./MobileTimeline";
import DelayLog from "./DelayLog";
import type { CustomerTimelineProject } from "@/lib/customer/timelineTypes";

export default function TimelinePageClient() {
  const [projects, setProjects] = useState<CustomerTimelineProject[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [zoomScale, setZoomScale] = useState<ZoomScale>("project");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/customer/timeline", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message ?? "Unable to load your timeline");
        return result as { projects: CustomerTimelineProject[] };
      })
      .then(result => { if (!controller.signal.aborted) { setProjects(result.projects); setError(""); } })
      .catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load your timeline"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);

  const refresh = () => { setLoading(true); setError(""); setRevision(value => value + 1); };
  if (loading) return <div className="p-6 text-blue-fantastic" role="status">Loading your timeline…</div>;
  if (error) return <div className="p-6 text-blue-fantastic" role="alert">{error} <button className="ml-3 underline" onClick={refresh}>Retry</button></div>;
  const project = projects.find(p => p.id === selectedId) ?? projects[0];
  if (!project) return <div className="p-6 text-blue-fantastic" role="status">No project is linked to your account yet. <button className="ml-3 underline" onClick={refresh}>Refresh</button></div>;

  const data = project.timeline;
  const today = new Date().toLocaleDateString("en-CA");
  const scheduledStages = data.stages.filter(s => s.plannedStart && s.plannedEnd && Date.parse(s.plannedEnd) >= Date.parse(s.plannedStart));
  const unscheduledStages = data.stages.filter(s => !scheduledStages.includes(s));
  const chartReady = scheduledStages.length > 0 && !!data.startDate && !!data.currentProjectedCompletion;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex items-center justify-between gap-3 flex-wrap text-blue-fantastic">
        {projects.length > 1 ? <label className="text-sm font-semibold">Project
          <select className="ml-3 rounded-lg border p-2" value={project.id} onChange={e => setSelectedId(e.target.value)}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name} — {p.address}</option>)}
          </select>
        </label> : <p className="text-sm font-semibold">{project.name}{project.address && ` — ${project.address}`}</p>}
        <button className="text-sm underline" onClick={refresh}>Refresh timeline</button>
      </div>
      <TimelineHeader percentage={data.percentage} startDate={data.startDate || "Not scheduled"}
        originalEstCompletion={data.originalEstCompletion || "Not scheduled"}
        currentProjectedCompletion={data.currentProjectedCompletion || "Not scheduled"}
        statusFlag={data.statusFlag} delayDays={data.delayDays} stages={data.stages} />
      {data.stages.length === 0 ? <p className="text-blue-fantastic/70">No construction stages have been scheduled yet.</p> : <>
        <div className="flex items-center justify-between gap-4 bg-white/80 border border-blue-fantastic/5 px-6 py-3 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">Build Schedule Visualization</span>
          {chartReady && <div className="hidden md:block"><ZoomToggle currentScale={zoomScale} onChange={setZoomScale} /></div>}
        </div>
        <div className="hidden md:block w-full">
          {chartReady ? <>
            <GanttChart data={{ ...data, stages: scheduledStages }} zoomScale={zoomScale} simulatedToday={today} />
            {unscheduledStages.length > 0 && <div className="mt-6"><MobileTimeline key={`${project.id}-unscheduled`} stages={unscheduledStages} /></div>}
          </> : <MobileTimeline key={project.id} stages={data.stages} />}
        </div>
        <div className="block md:hidden w-full"><MobileTimeline key={project.id} stages={data.stages} /></div>
      </>}
      <DelayLog logs={data.delayLog} />
    </div>
  );
}
