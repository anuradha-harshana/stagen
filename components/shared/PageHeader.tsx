"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  rightContent,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pb-4 border-b border-blue-fantastic/15 font-sans w-full",
        className
      )}
    >
      <div className="flex items-center justify-between flex-wrap gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            {icon}
          </div>
          <div>
            <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
              {title}
            </h1>
            <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
              {subtitle}
            </p>
          </div>
        </div>

        {rightContent && (
          <div className="flex items-center gap-3 flex-wrap">{rightContent}</div>
        )}
      </div>
    </div>
  );
}
