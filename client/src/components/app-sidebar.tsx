"use client"

import { Home, FileText, Mic, Upload, BookOpen, GraduationCap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Notes", url: "/notes", icon: FileText },
  { title: "Record", url: "/record", icon: Mic },
  { title: "Upload", url: "/upload", icon: Upload },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <GraduationCap className="h-4 w-4 text-blue-800 absolute -top-1 -right-1" />
          </div>
          <span className="text-xl font-bold text-gray-900">NoteWise</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
