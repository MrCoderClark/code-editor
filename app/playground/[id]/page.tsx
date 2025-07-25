"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PlaygroundEditor from "@/features/playground/components/playground-editor";
import { TemplateFileTree } from "@/features/playground/components/template-file-tree";

import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { TemplateFile } from "@/features/playground/types";
import { Bot, FileText, Save, Settings, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  useEffect(() => {
    setPlaygroundId(id!);
  }, [id, setPlaygroundId]);
  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  // const wrappedHandleAddFile = useCallback(
  //   (newFile: TemplateFile, parentPath: string) => {
  //     return handleAddFile(
  //       newFile,
  //       parentPath,
  //       writeFileSync!,
  //       instance,
  //       saveTemplateData
  //     );
  //   },
  //   [handleAddFile, saveTemplateData]
  // );

  // const wrappedHandleAddFolder = useCallback(
  //   (newFolder: TemplateFolder, parentPath: string) => {
  //     return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
  //   },
  //   [handleAddFolder, saveTemplateData]
  // );

  // const wrappedHandleRanemFile = useCallback(
  //   (
  //     file: TemplateFile,
  //     newFilename: string,
  //     newExtension: string,
  //     parentPath: string
  //   ) => {
  //     return handleRenameFile(
  //       file,
  //       newFilename,
  //       newExtension,
  //       parentPath,
  //       saveTemplateData
  //     );
  //   },
  //   [handleRenameFile, saveTemplateData]
  // );

  // const wrappedHandleDeleteFile = useCallback(
  //   (file: TemplateFile, parentPath: string) => {
  //     return handleDeleteFile(file, parentPath, saveTemplateData);
  //   },
  //   [handleDeleteFile, saveTemplateData]
  // );

  // const wrappedHandleDeleteFolder = useCallback(
  //   (folder: TemplateFolder, parentPath: string) => {
  //     return handleDeleteFolder(folder, parentPath, saveTemplateData);
  //   },
  //   [handleDeleteFolder, saveTemplateData]
  // );

  // const wrappedHandleRenameFolder = useCallback(
  //   (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
  //     return handleRenameFolder(
  //       folder,
  //       newFolderName,
  //       parentPath,
  //       saveTemplateData
  //     );
  //   },
  //   [handleRenameFolder, saveTemplateData]
  // );

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const handleFileSelect = (file: TemplateFile) => {
    try {
      openFile(file);
      console.log("openFile completed successfully");
    } catch (error) {
      console.error("Error in openFile:", error);
    }
  };

  // Convert OpenFile back to TemplateFile for the selectedFile prop
  const selectedTemplateFile: TemplateFile | undefined = activeFile
    ? {
        filename: activeFile.filename,
        fileExtension: activeFile.fileExtension,
        content: activeFile.content,
      }
    : undefined;

  console.log(openFiles);

  return (
    <TooltipProvider>
      {templateData && (
        <TemplateFileTree
          data={templateData}
          onFileSelect={handleFileSelect}
          selectedFile={selectedTemplateFile}
        />
      )}

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <div className="flex flex-1 items-center gap-2">
            <div className="flex flex-col flex-1">
              <h1 className="text-sm font-medium">
                {playgroundData?.title || "Code Playground"}
              </h1>

              <p className="text-xs text-muted-foreground">
                {openFiles.length} Files(s) open
                {hasUnsavedChanges && " • Unsaved changes"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {}}
                    disabled={!activeFile || !activeFile.hasUnsavedChanges}
                  >
                    <Save className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save (Ctrl + S)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {}}
                    disabled={!hasUnsavedChanges}
                  >
                    <Save className="size-4" /> All
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {}}
                    disabled={!hasUnsavedChanges}
                  >
                    <Bot className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle AI</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Settings className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                  >
                    {isPreviewVisible ? "Hide" : "Show"} Preview
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={closeAllFiles}>
                    Close All Files
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="h-[calc(100vh-4rem)]">
          {openFiles.length > 0 ? (
            <div className="h-full flex flex-col">
              <div className="border-b bg-muted/30">
                <Tabs
                  value={activeFileId || ""}
                  onValueChange={setActiveFileId}
                >
                  <div className="flex items-center justify-between px-4 py-2">
                    <TabsList className="h-8 bg-transparent p-0">
                      {openFiles.map((file) => (
                        <TabsTrigger
                          key={file.id}
                          value={file.id}
                          className="relative h-8 px-3 data-[state=active]:shadow-sm group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="size-3" />
                            <span>
                              {file.filename}.{file.fileExtension}
                            </span>
                            {file.hasUnsavedChanges && (
                              <span className="h-2 w-2 rounded-full bg-orange-500" />
                            )}
                            <span
                              className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 duration-200 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                closeFile(file.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </span>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {openFiles.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={closeAllFiles}
                      >
                        Close All
                      </Button>
                    )}
                  </div>
                </Tabs>
              </div>

              <div className="flex-1">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                    <PlaygroundEditor
                      activeFile={activeFile}
                      content={activeFile?.content || ""}
                      onContentChange={(value) =>
                        activeFileId && updateFileContent(activeFileId, value)
                      }
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
              <FileText className="size-16 text-gray-300" />
              <div className="text-center">
                <p className="text-lg font-medium">No files open</p>
                <p className="text-sm text-gray-500">
                  Select a file from the sidebar to start editing.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div> */}
      </SidebarInset>
    </TooltipProvider>
  );
};

export default Page;
