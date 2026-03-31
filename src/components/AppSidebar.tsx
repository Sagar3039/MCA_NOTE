"use client";

import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Users2, 
  Library,
  GraduationCap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  { title: "Dashboard", icon: LayoutDashboard, url: "#" },
  { title: "Students", icon: Users, url: "#" },
  { title: "Notices", icon: BookOpen, url: "#", active: true },
  { title: "Discussions", icon: MessageSquare, url: "#" },
  { title: "Groups", icon: Users2, url: "#" },
  { title: "Library", icon: Library, url: "#" },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-none bg-transparent pr-4 w-72">
      <SidebarHeader className="bg-transparent py-8 px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">CampusConnect</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Midnapore College</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link 
                      href={item.url} 
                      className={`flex items-center gap-4 py-6 px-4 rounded-2xl transition-all duration-300 ${
                        item.active 
                          ? "bg-white/10 text-white shadow-lg" 
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${item.active ? "text-primary" : ""}`} />
                      <span className="font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
