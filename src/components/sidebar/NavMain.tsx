import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import { ChevronRight, Boxes, Flame, Grid2X2 } from "lucide-react";

const navMain = {
  title: "Explore",
  items: [
    { name: "All Tools", path: "/", icon: Boxes },
    { name: "Trending", path: "/tools/trending", icon: Flame },
    { name: "Categories", path: "/tools/categories", icon: Grid2X2 },
  ],
};

function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible defaultOpen>
          <SidebarMenuItem>
            {/* Trigger */}
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <Boxes size={20} />
                <span>{navMain.title}</span>
                <ChevronRight className="ml-auto transition-transform data-[state=open]:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            {/* Sub menu */}
            <CollapsibleContent>
              <SidebarMenuSub>
                {navMain.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <SidebarMenuSubItem key={item.name}>
                      <SidebarMenuSubButton asChild>
                        <Link href={item.path}>
                          <Icon size={18} />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavMain;
