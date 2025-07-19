import React from "react";
import { ActivityCard } from "./ActivityCard";
import type { Activity, UserActivity } from "@/types/types";

interface ActivitiesListProps {
  title: string;
  activities: (Activity | UserActivity)[];
  isUserActivities?: boolean;
  onEdit?: (activity: UserActivity) => void;
  onDelete?: (id: number) => void;
  isDeletingId?: number;
  emptyMessage?: string;
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  title,
  activities,
  isUserActivities = false,
  onEdit,
  onDelete,
  isDeletingId,
  emptyMessage = "No activities available.",
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard
              key={`${isUserActivities ? "user" : "global"}-${activity.id}`}
              activity={activity}
              isUserActivity={isUserActivities}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeletingId === activity.id}
            />
          ))
        ) : (
          <div className="text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};
