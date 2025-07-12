import * as React from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { BsClipboardData } from "react-icons/bs";
import { IoAnalyticsOutline } from "react-icons/io5";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center p-2 transition-colors",
          "text-muted-foreground hover:text-primary",
          isActive && "text-primary"
        )
      }
    >
      <div className="text-xl">{icon}</div>
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );
};

export function BottomNavbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-md px-2 py-1">
      <div className="flex justify-around items-center">
        <NavItem to="/" icon={<AiOutlineHome />} label="Home" />
        <NavItem
          to="/categories"
          icon={<MdOutlineCategory />}
          label="Categories"
        />
        <NavItem
          to="/timesheets"
          icon={<BsClipboardData />}
          label="Timesheets"
        />
        <NavItem
          to="/analytics"
          icon={<IoAnalyticsOutline />}
          label="Analytics"
        />
        <NavItem to="/profile" icon={<AiOutlineUser />} label="Profile" />
      </div>
    </div>
  );
}
