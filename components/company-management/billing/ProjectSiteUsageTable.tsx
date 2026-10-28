"use client";
import { RegionChart } from "../dashboard/RegionChart";
export function RegionalBillingChart({ onAction }: { onAction?: (message: string) => void }) { return <RegionChart />; }
export const ProjectSiteUsageTable = RegionalBillingChart;
