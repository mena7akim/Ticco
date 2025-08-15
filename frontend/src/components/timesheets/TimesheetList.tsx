import { useState } from "react";
import type { Timesheet } from "@/types/types";
import { TimesheetCard } from "./TimesheetCard";
import { useDeleteTimesheet } from "@/hooks/useTimesheets";
import { toast } from "react-hot-toast";

interface TimesheetListProps {
  timesheets: Timesheet[];
  emptyMessage?: string;
}

export function TimesheetList({
  timesheets,
  emptyMessage = "No timesheets available.",
}: TimesheetListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const deleteTimesheetMutation = useDeleteTimesheet();

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTimesheetMutation.mutateAsync(id);
      toast.success("Timesheet deleted successfully");
    } catch (error) {
      toast.error("Failed to delete timesheet");
      console.error("Error deleting timesheet:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {timesheets.length > 0 ? (
        timesheets.map((timesheet) => (
          <TimesheetCard
            key={timesheet.id}
            timesheet={timesheet}
            onDelete={handleDelete}
            isDeleting={deletingId === timesheet.id}
          />
        ))
      ) : (
        <div className="text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
