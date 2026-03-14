"use client";

import { SearchForm } from "@/components/sidebar/search-form";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon } from "lucide-react";
import { NavUser } from "./nav-user";
import AppLogo from "../shared/AppLogo";
import { useAppSelector } from "@/store/hooks";
import { authSelector } from "@/store/selector";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAppSelector(authSelector);

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center">
      <div className="flex h-(--header-height) w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-4">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <PanelLeftIcon />
          </Button>
          <AppLogo />
        </div>
        <div className="w-120">
          <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        </div>
      </div>
    </header>
  );
}
