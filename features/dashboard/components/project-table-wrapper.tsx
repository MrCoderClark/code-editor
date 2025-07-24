"use client";

import { deleteProjectById, duplicateProjectById, editProjectById } from "@/features/dashboard/actions";
import ProjectTable from "./project-table";
import type { Project } from "../types";

interface ProjectTableWrapperProps {
  projects: Project[];
}

export default function ProjectTableWrapper({ projects }: ProjectTableWrapperProps) {
  const handleDeleteProject = async (id: string) => {
    await deleteProjectById(id);
  };

  const handleUpdateProject = async (id: string, data: { title: string; description: string }) => {
    await editProjectById(id, data);
  };

  const handleDuplicateProject = async (id: string) => {
    await duplicateProjectById(id);
  };

  return (
    <ProjectTable
      projects={projects}
      onDeleteProject={handleDeleteProject}
      onUpdateProject={handleUpdateProject}
      onDuplicateProject={handleDuplicateProject}
    />
  );
}
