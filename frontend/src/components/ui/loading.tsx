import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
};
