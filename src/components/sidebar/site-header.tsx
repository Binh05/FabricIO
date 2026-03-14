"use client";

import { SearchForm } from "@/components/sidebar/search-form";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Bell, PanelLeftIcon } from "lucide-react";
import AppLogo from "../shared/AppLogo";
import { useAppSelector } from "@/store/hooks";
import { authSelector } from "@/store/selector";
import Link from "next/link";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const { token } = useAppSelector(authSelector);

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-4">
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
        <div className="flex items-center gap-4">
          <SearchForm className="w-full sm:w-auto lg:w-120" />

          <Bell />
        </div>
        <div className="flex flex-1 justify-end">
          {!token && (
            <Button className="mr-12" variant="secondary" asChild>
              <Link href={"/login"}>Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
