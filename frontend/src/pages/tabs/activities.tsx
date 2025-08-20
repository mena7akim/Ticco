import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { ErrorDisplay } from "@/components/ui/error-display";
import { ActivityForm } from "@/components/activities/ActivityForm";
import { ActivitiesList } from "@/components/activities/ActivitiesList";
import {
  useActivities,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from "@/hooks/useActivities";
import type { UserActivity, CreateActivityRequest } from "@/types/types";

function Activities() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<UserActivity | null>(
    null
  );

  // React Query hooks
  const { data: activities, isLoading, error, refetch } = useActivities();
  const createMutation = useCreateActivity();
  const updateMutation = useUpdateActivity();
  const deleteMutation = useDeleteActivity();

  const handleCreateActivity = async (data: CreateActivityRequest) => {
    try {
      await createMutation.mutateAsync(data);
      setIsFormOpen(false);
      setEditingActivity(null);
    } catch (err) {
      // Error is handled by React Query
      console.error("Failed to create activity:", err);
    }
  };

  const handleUpdateActivity = async (data: CreateActivityRequest) => {
    if (!editingActivity) return;

    try {
      await updateMutation.mutateAsync({
        id: editingActivity.id,
        activity: data,
      });
      setIsFormOpen(false);
      setEditingActivity(null);
    } catch (err) {
      // Error is handled by React Query
      console.error("Failed to update activity:", err);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      // Error is handled by React Query
      console.error("Failed to delete activity:", err);
    }
  };

  const openCreateDialog = () => {
    setEditingActivity(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (activity: UserActivity) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingActivity(null);
  };

  if (isLoading) {
    return <Loading message="Loading activities..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        message={
          error instanceof Error ? error.message : "Failed to load activities"
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!activities) {
    return (
      <ErrorDisplay
        message="No activities data available"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Activities</h1>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Activity
        </Button>
      </div>

      {/* Global Activities */}
      <ActivitiesList
        title="Global Activities"
        activities={activities.globalActivities}
        isUserActivities={false}
      />

      {/* User Activities */}
      <ActivitiesList
        title="My Activities"
        activities={activities.userActivities}
        isUserActivities={true}
        onEdit={openEditDialog}
        onDelete={handleDeleteActivity}
        isDeletingId={
          deleteMutation.isPending ? deleteMutation.variables : undefined
        }
        emptyMessage="No custom activities yet. Create your first activity!"
      />

      {/* Activity Form Dialog */}
      <ActivityForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingActivity ? handleUpdateActivity : handleCreateActivity}
        editingActivity={editingActivity}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

export default Activities;
