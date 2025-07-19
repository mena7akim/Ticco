import React from "react";
import { Button } from "@/components/ui/button";
import { AVAILABLE_ICONS } from "@/constants/icons";

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onIconSelect,
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
      {AVAILABLE_ICONS.map((icon) => {
        const IconComponent = icon.component;
        const isSelected = selectedIcon === icon.name;

        return (
          <Button
            key={icon.name}
            type="button"
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={`aspect-square p-2 transition-all ${
              isSelected
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:bg-accent"
            }`}
            onClick={() => onIconSelect(icon.name)}
            title={icon.label}
          >
            <IconComponent className="w-4 h-4" />
          </Button>
        );
      })}
    </div>
  );
};
