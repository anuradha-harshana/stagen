"use client";

import React from "react";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

interface ProjectsHeaderProps {
  onCreateClick: () => void;
}

export default function ProjectsHeader({ onCreateClick }: ProjectsHeaderProps) {
  return (
    <PageHeader
      icon={<FolderKanban className="h-5 w-5 text-burning-flame" />}
      title="Build Projects"
      subtitle="Create and manage construction sites, progress, and assign supervisors."
      rightContent={
        <Button
          onClick={onCreateClick}
          className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/95 text-xs font-semibold px-4 h-10 shadow-sm rounded-xl"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Project
        </Button>
      }
    />
  );
}
