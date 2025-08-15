import type { Timesheet } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimesheetCardProps {
  timesheet: Timesheet;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export function TimesheetCard({
  timesheet,
  onDelete,
  isDeleting,
}: TimesheetCardProps) {
  // Calculate duration if we have both start and end times
  const duration = timesheet.endTime
    ? timesheet.durationMinutes
      ? timesheet.durationMinutes * 60 * 1000
      : new Date(timesheet.endTime).getTime() -
        new Date(timesheet.startTime).getTime()
    : 0;

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Badge style={{ backgroundColor: timesheet.activity.color }}>
              {timesheet.activity.name}
            </Badge>
            <span className="text-muted-foreground text-sm">
              {formatDateTime(timesheet.startTime)}
            </span>
          </div>

          {timesheet.endTime && (
            <div className="font-mono mt-1">
              Duration: {formatDuration(duration)}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={isDeleting}
          onClick={() => onDelete(timesheet.id)}
        >
          {isDeleting ? (
            <span className="animate-spin">⌛</span>
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
