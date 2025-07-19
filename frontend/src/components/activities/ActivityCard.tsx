import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getIconComponent } from "@/constants/icons";
import type { Activity, UserActivity } from "@/types/types";

interface ActivityCardProps {
  activity: Activity | UserActivity;
  isUserActivity?: boolean;
  onEdit?: (activity: UserActivity) => void;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isUserActivity = false,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const IconComponent = getIconComponent(activity.icon);

  const handleEdit = () => {
    if (onEdit && isUserActivity) {
      onEdit(activity as UserActivity);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(activity.id);
    }
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-full transition-all"
            style={{ backgroundColor: activity.color }}
          >
            {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
          </div>
          <span className="font-medium text-foreground">{activity.name}</span>
        </div>

        {isUserActivity && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              disabled={isDeleting}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
