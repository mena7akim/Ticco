import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IconSelector } from "./IconSelector";
import { ColorSelector } from "./ColorSelector";
import { AVAILABLE_ICONS, PREDEFINED_COLORS } from "@/constants/icons";
import type { UserActivity, CreateActivityRequest } from "@/types/types";

// Validation schema
const activityFormSchema = z.object({
  name: z
    .string()
    .min(1, "Activity name is required")
    .max(100, "Activity name must not exceed 100 characters")
    .trim(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Please select a valid color"),
  icon: z
    .string()
    .min(1, "Please select an icon"),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityRequest) => void;
  editingActivity?: UserActivity | null;
  isLoading?: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingActivity,
  isLoading = false,
}) => {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      name: "",
      color: PREDEFINED_COLORS[0],
      icon: AVAILABLE_ICONS[0].name,
    },
  });

  // Reset form when dialog opens/closes or editing activity changes
  useEffect(() => {
    if (editingActivity) {
      form.reset({
        name: editingActivity.name,
        color: editingActivity.color,
        icon: editingActivity.icon,
      });
    } else {
      form.reset({
        name: "",
        color: PREDEFINED_COLORS[0],
        icon: AVAILABLE_ICONS[0].name,
      });
    }
  }, [editingActivity, isOpen, form]);

  const handleSubmit = (values: ActivityFormValues) => {
    onSubmit(values);
  };

  const handleClose = () => {
    onClose();
    // Reset form after a delay to avoid visual glitch
    setTimeout(() => {
      form.reset();
    }, 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingActivity ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter activity name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Icon</FormLabel>
                  <FormControl>
                    <IconSelector
                      selectedIcon={field.value}
                      onIconSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Color</FormLabel>
                  <FormControl>
                    <ColorSelector
                      selectedColor={field.value}
                      onColorSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isLoading}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                {editingActivity ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
