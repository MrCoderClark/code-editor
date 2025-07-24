import EmptyState from "@/components/empty-state";
import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getAllPlaygroundForUser,
} from "@/features/dashboard/actions";
import AddNewButton from "@/features/dashboard/components/add-new-button";
import AddRepoButton from "@/features/dashboard/components/add-repo";
import ProjectTable from "@/features/dashboard/components/project-table";

const Page = async () => {
  const playgroundsData = await getAllPlaygroundForUser();
  const playgrounds = playgroundsData?.map(playground => ({
    ...playground,
    title: playground.title || "Untitled Project",
    description: playground.description || "",
    user: {
      ...playground.user,
      name: playground.user.name || "Unknown User",
      image: playground.user.image || ""
    }
  }));
  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepoButton />
      </div>

      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Create a new Project to get started"
            imageSrc="/empty-state.svg"
          />
        ) : (
          <ProjectTable
            projects={playgrounds || []}
            onDeleteProject={deleteProjectById}
            onUpdateProject={editProjectById}
            onDuplicateProject={async (id: string) => {
              await duplicateProjectById(id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
