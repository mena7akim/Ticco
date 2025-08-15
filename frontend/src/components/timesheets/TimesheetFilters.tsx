import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivitySelector } from "./ActivitySelector";

interface TimesheetFiltersProps {
  onFilterChange: (filters: {
    startDate?: string;
    endDate?: string;
    activityId?: number;
  }) => void;
}

export function TimesheetFilters({ onFilterChange }: TimesheetFiltersProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [activityId, setActivityId] = useState<number | undefined>(undefined);

  const handleDateChange = (date: Date | undefined, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }

    // Apply filters
    onFilterChange({
      startDate:
        type === "start"
          ? date
            ? format(date, "yyyy-MM-dd")
            : undefined
          : startDate
          ? format(startDate, "yyyy-MM-dd")
          : undefined,
      endDate:
        type === "end"
          ? date
            ? format(date, "yyyy-MM-dd")
            : undefined
          : endDate
          ? format(endDate, "yyyy-MM-dd")
          : undefined,
      activityId,
    });
  };

  const handleActivityChange = (id: number | undefined) => {
    setActivityId(id);

    // Apply filters
    onFilterChange({
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      activityId: id,
    });
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setActivityId(undefined);

    // Clear all filters
    onFilterChange({});
  };

  return (
    <div className="flex flex-col gap-3 mb-4 p-4 bg-muted/30 rounded-lg">
      <h3 className="font-medium">Filter Timesheets</h3>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Activity Selector */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Activity</p>
          <ActivitySelector
            value={activityId}
            onChange={(id) => handleActivityChange(id)}
          />
        </div>

        {/* Start Date */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">From</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PP") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateChange(date, "start")}
                initialFocus
                disabled={(date) => (endDate ? date > endDate : false)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">To</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PP") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateChange(date, "end")}
                initialFocus
                disabled={(date) => (startDate ? date < startDate : false)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(startDate || endDate || activityId) && (
        <Button variant="ghost" onClick={clearFilters} className="self-start">
          <X className="h-4 w-4 mr-1" /> Clear Filters
        </Button>
      )}
    </div>
  );
}
