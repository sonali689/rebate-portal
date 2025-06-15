import type React from "react"
import { Sidebar } from "@/components/sidebar"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: "home",
  },
  {
    title: "Apply Rebate",
    href: "/student/apply-rebate",
    icon: "calendar",
  },
  {
    title: "Request History",
    href: "/student/request-history",
    icon: "history",
  },
  {
    title: "Mess Bills",
    href: "/student/bills",
    icon: "receipt",
  },
  {
    title: "Profile",
    href: "/student/profile",
    icon: "user",
  },
  {
    title: "How to Use",
    href: "/student/how-to-use",
    icon: "helpCircle",
  },
]

export default function StudentDashboardLayout({
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
