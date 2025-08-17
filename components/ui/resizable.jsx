"use client";

import * as React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "react-resizable-panels";

import { cn } from "./utils";

function ResizablePanelGroup({
  className,
  ...props
}) {
  return (
    <ResizablePanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  className,
  ...props
}) {
  return (
    <ResizablePanel
      data-slot="resizable-panel"
      className={cn("flex h-full w-full items-center justify-center", className)}
      {...props}
    />
  );
}

function ResizableHandle({
  className,
  withHandle,
  ...props
}) {
  return (
    <ResizableHandle
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:h-24 after:w-1 after:bg-primary after:opacity-0 after:transition-opacity after:data-[panel-group-direction=vertical]:h-1 after:data-[panel-group-direction=vertical]:w-24 after:data-[panel-group-direction=vertical]:group-data-[panel-group-direction=vertical]:-top-3 group-data-[panel-group-direction=vertical]:h-px group-data-[panel-group-direction=vertical]:w-full group-data-[panel-group-direction=vertical]:after:-left-3 hover:after:opacity-100 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border-foreground z-10 flex h-4 w-4 items-center justify-center rounded-full border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-2.5"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      )}
    </ResizableHandle>
  );
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
};
