import { useState } from "react";
import { useTimesheets } from "@/hooks/useTimesheets";
import { TimesheetList } from "@/components/timesheets/TimesheetList";
import { TimesheetFilters } from "@/components/timesheets/TimesheetFilters";
import { Pagination } from "@/components/timesheets/Pagination";
import { Loading } from "@/components/ui/loading";
import { useSocket } from "@/hooks/useSocket";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

function Timesheets() {
  // State for filters and pagination
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    activityId: undefined as number | undefined,
  });

  // Socket connection status
  const { isConnected } = useSocket();

  // Fetch timesheets with current filters
  const {
    data: timesheetsData,
    isLoading,
    isError,
    error,
  } = useTimesheets(filters);

  // Handle filter changes
  const handleFilterChange = (newFilters: {
    startDate?: string;
    endDate?: string;
    activityId?: number;
  }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: !newFilters.startDate ? undefined : newFilters.startDate,
      endDate: !newFilters.endDate ? undefined : newFilters.endDate,
      activityId: !newFilters.activityId ? undefined : newFilters.activityId,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
    }));
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Timesheets</h1>
      </div>

      {/* Filters */}
      <TimesheetFilters onFilterChange={handleFilterChange} />

      {/* Timesheets List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Error loading timesheets: {(error as Error).message}
        </div>
      ) : (
        <>
          <TimesheetList
            timesheets={timesheetsData?.timesheets || []}
            emptyMessage={
              Object.values(filters).some(
                (f) => f !== undefined && f !== 1 && f !== 10
              )
                ? "No timesheets match your filters."
                : "You haven't tracked any time yet."
            }
          />

          {/* Pagination */}
          {timesheetsData && timesheetsData.pagination.totalPages > 1 && (
            <Pagination
              currentPage={timesheetsData.pagination.page}
              totalPages={timesheetsData.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Timesheets;
