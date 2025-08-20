import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, Wifi, WifiOff } from "lucide-react";
import {
  useCurrentTimesheet,
  useStartTimesheet,
  useStopTimesheet,
} from "@/hooks/useTimesheets";
import { ActivitySelector } from "@/components/timesheets/ActivitySelector";
import { Timer } from "@/components/timesheets/Timer";
import { toast } from "react-hot-toast";
import { useSocket } from "@/hooks/useSocket";
import { Badge } from "@/components/ui/badge";

function Home() {
  const [selectedActivityId, setSelectedActivityId] = useState<
    number | undefined
  >();
  const { data: currentTimesheet, isLoading: isLoadingTimesheet } =
    useCurrentTimesheet();
  const startTimesheetMutation = useStartTimesheet();
  const stopTimesheetMutation = useStopTimesheet();
  const { isConnected } = useSocket();
  console.log("Socket connected:", isConnected);

  // Handle starting a new timesheet
  const handleStartTimesheet = async () => {
    if (!selectedActivityId) {
      toast.error("Please select an activity first");
      return;
    }

    try {
      await startTimesheetMutation.mutateAsync({
        activityId: selectedActivityId,
        startTime: new Date().toISOString(),
      });
      toast.success("Timer started successfully");
    } catch (error) {
      toast.error("Failed to start timer");
      console.error("Error starting timer:", error);
    }
  };

  // Handle stopping the current timesheet
  const handleStopTimesheet = async () => {
    try {
      await stopTimesheetMutation.mutateAsync({
        endTime: new Date().toISOString(),
      });
      toast.success("Timer stopped successfully");
    } catch (error) {
      toast.error("Failed to stop timer");
      console.error("Error stopping timer:", error);
    }
  };

  // Update selected activity from running timesheet
  useEffect(() => {
    if (currentTimesheet) {
      setSelectedActivityId(currentTimesheet.activityId);
    }
  }, [currentTimesheet]);

  const isTimerRunning = !!currentTimesheet && !currentTimesheet.endTime;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="flex justify-end mb-2">
              <Badge
                className={`flex items-center gap-1 ${
                  isConnected ? "bg-green-500" : "bg-destructive"
                }`}
              >
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3" /> Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" /> Offline
                  </>
                )}
              </Badge>
            </div>

            <h2 className="text-2xl font-bold mb-6">Time Tracker</h2>

            <div className="mb-6">
              <ActivitySelector
                value={selectedActivityId}
                onChange={setSelectedActivityId}
              />
            </div>

            {isTimerRunning && currentTimesheet ? (
              <div className="mb-6">
                <Timer startTime={currentTimesheet.startTime} />
              </div>
            ) : (
              <div className="text-3xl font-mono text-center mb-6">
                00:00:00
              </div>
            )}

            <Button
              onClick={
                isTimerRunning ? handleStopTimesheet : handleStartTimesheet
              }
              size="lg"
              className="rounded-full h-16 w-16 p-0"
              disabled={
                isLoadingTimesheet ||
                startTimesheetMutation.isPending ||
                stopTimesheetMutation.isPending
              }
            >
              {isTimerRunning ? (
                <Square className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>

            <p className="text-muted-foreground mt-4">
              {isTimerRunning
                ? "Click to stop the timer"
                : selectedActivityId
                ? "Click to start tracking"
                : "Select an activity and click to start tracking"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;
