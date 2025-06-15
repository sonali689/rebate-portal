import type React from "react"
import { Sidebar } from "@/components/sidebar"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: "home",
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: "users",
  },
  {
    title: "Mess Bills",
    href: "/admin/bills",
    icon: "receipt",
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: "fileText",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: "settings",
  },
  {
    title: "How to Use",
    href: "/admin/how-to-use",
    icon: "helpCircle",
  },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar items={sidebarItems} title="Hall 6 Mess Rebate" />
      <div className="flex-1 overflow-auto bg-sky-50">{children}</div>
    </div>
  )
}
