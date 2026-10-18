import fs from "fs/promises";
import path from "path";

export interface AIFaqTrend {
  id: string;
  category: "Stage Timelines" | "Invoices & Payments" | "Warranty Claims" | "Site Access & Inspections" | "Variations & Specs" | string;
  question: string;
  queryCount: number;
  aiResolutionRate: number;
  escalationCount: number;
  status: "Optimized" | "Needs Review" | "Low Accuracy" | string;
  sampleAnswer: string;
  lastTrained: string;
}

const trendsFile = path.join(process.cwd(), "data", "company", "aiFaqTrends.json");

// Helper: Read trends from disk
async function readTrends(): Promise<AIFaqTrend[]> {
  try {
    const data = await fs.readFile(trendsFile, "utf8");
    return JSON.parse(data) as AIFaqTrend[];
  } catch (err) {
    return [];
  }
}

// Helper: Write trends to disk
async function writeTrends(trends: AIFaqTrend[]) {
  await fs.writeFile(trendsFile, JSON.stringify(trends, null, 2), "utf8");
}

// ── 1. GET ALL TRENDS ──
export async function getAiFaqTrends(): Promise<AIFaqTrend[]> {
  return await readTrends();
}

// ── 2. UPDATE FAQ / KNOWLEDGE BASE ANSWER ──
export async function updateAiFaqTrend(
  id: string,
  updates: Partial<AIFaqTrend>
): Promise<AIFaqTrend | null> {
  const trends = await readTrends();
  const index = trends.findIndex((item) => item.id === id);
  if (index === -1) return null;

  trends[index] = {
    ...trends[index],
    ...updates,
    lastTrained: new Date().toISOString().split("T")[0], // Update training timestamp
  };

  await writeTrends(trends);
  return trends[index];
}
