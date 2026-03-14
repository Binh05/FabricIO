"use client";

import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/store/hooks";
import { authSelector } from "@/store/selector";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector(authSelector);

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {/* Header */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{/* Content */}</SidebarContent>
      <SidebarFooter>
        {user != null && (
          <NavUser
            user={{
              username: user?.username ?? "fabricIO",
              email: user?.email ?? "123@gmail.com",
              avatarUrl: user.avatarUrl ?? "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
