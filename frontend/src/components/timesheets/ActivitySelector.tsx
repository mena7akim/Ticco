import { useEffect, useState, useMemo } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { Activity, UserActivity } from "@/types/types";
import { useActivities } from "@/hooks/useActivities";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface ActivitySelectorProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: activitiesData, isLoading } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | UserActivity | null
  >(null);

  // Flatten both global and user activities into a single array
  const activities = useMemo(() => {
    return activitiesData
      ? [...activitiesData.globalActivities, ...activitiesData.userActivities]
      : [];
  }, [activitiesData]);

  // Update selected activity when value changes
  useEffect(() => {
    if (!value) {
      setSelectedActivity(null);
      return;
    }
    if (value && activities.length > 0) {
      const activity = activities.find((a) => a.id === value);
      if (activity) {
        setSelectedActivity(activity);
      }
    }
  }, [value, activities]);

  const handleSelect = (activity: Activity | UserActivity) => {
    if (selectedActivity?.id === activity.id) {
      setSelectedActivity(null);
      onChange(undefined);
      setOpen(false);
      return;
    }
    onChange(activity.id);
    setSelectedActivity(activity);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {selectedActivity ? (
            <div className="flex items-center">
              <Badge style={{ backgroundColor: selectedActivity.color }}>
                {selectedActivity.name}
              </Badge>
            </div>
          ) : (
            "Select activity..."
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search activity..." />
          <CommandList>
            <CommandEmpty>No activity found.</CommandEmpty>
            <CommandGroup>
              {activities.map((activity) => (
                <CommandItem
                  key={`activity-${activity.id}`}
                  value={activity.name}
                  onSelect={() => handleSelect(activity)}
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: activity.color }}
                    />
                    {activity.name}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedActivity?.id === activity.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
