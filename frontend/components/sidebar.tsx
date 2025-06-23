/*"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, ChevronLeft, ChevronRight, Home } from "lucide-react"
// Add missing imports
import { Circle, Calendar, History, Settings, Users, FileText, Receipt, User } from "lucide-react"

// Update the interface to accept icon names instead of components
interface SidebarProps {
  items: {
    title: string
    href: string
    icon: string // Changed from React.ElementType to string
  }[]
  title: string
}

// Update the Sidebar component to render icons based on string names
export function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Function to render the appropriate icon based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "home":
        return <Home className={`h-5 w-5`} />
      case "user":
        return <User className={`h-5 w-5`} />
      case "calendar":
        return <Calendar className={`h-5 w-5`} />
      case "history":
        return <History className={`h-5 w-5`} />
      case "settings":
        return <Settings className={`h-5 w-5`} />
      case "users":
        return <Users className={`h-5 w-5`} />
      case "fileText":
        return <FileText className={`h-5 w-5`} />
      case "receipt":
        return <Receipt className={`h-5 w-5`} />
      default:
        return <Circle className={`h-5 w-5`} />
    }
  }

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className="relative">
      <div
        className={cn(
          "h-screen bg-white border-r transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2
            className={cn(
              "font-bold text-sky-600 transition-opacity duration-200",
              collapsed ? "opacity-0 w-0" : "opacity-100",
            )}
          >
            {title}
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start", collapsed ? "px-2" : "px-4")}
                    >
                      <span className={cn(isActive ? "text-sky-600" : "text-gray-500")}>{renderIcon(item.icon)}</span>
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-2 mt-auto border-t">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
                collapsed ? "px-2" : "px-4",
              )}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
  */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, ChevronLeft, ChevronRight, Home, HelpCircle, Circle, Calendar, History, Settings, Users, FileText, Receipt, User } from "lucide-react"

// Define the feature flag (set this in your environment or utils file)
const ENABLE_BILL = false; // Change to true for development

interface SidebarProps {
  items: {
    title: string
    href: string
    icon: string
  }[]
  title: string
}

export function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Filter items to exclude mess bill-related ones when ENABLE_BILL is false
  const filteredItems = items.filter(item => {
    if (item.title === "Mess Bills" && !ENABLE_BILL) {
      return false;
    }
    return true;
  });

  // Function to render the appropriate icon based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "home":
        return <Home className={`h-5 w-5`} />
      case "user":
        return <User className={`h-5 w-5`} />
      case "calendar":
        return <Calendar className={`h-5 w-5`} />
      case "history":
        return <History className={`h-5 w-5`} />
      case "settings":
        return <Settings className={`h-5 w-5`} />
      case "users":
        return <Users className={`h-5 w-5`} />
      case "fileText":
        return <FileText className={`h-5 w-5`} />
      case "receipt":
        return <Receipt className={`h-5 w-5`} />
      case "helpCircle":
        return <HelpCircle className={`h-5 w-5`} />
      default:
        return <Circle className={`h-5 w-5`} />
    }
  }

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className="relative">
      <div
        className={cn(
          "h-screen bg-white border-r transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2
            className={cn(
              "font-poppins font-bold text-sky-600 transition-opacity duration-200",
              collapsed ? "opacity-0 w-0" : "opacity-100",
            )}
          >
            {title}
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-2">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        collapsed ? "px-2" : "px-4",
                        isActive ? "bg-sky-50 text-sky-600" : "text-gray-700",
                      )}
                    >
                      <span className={cn(isActive ? "text-sky-600" : "text-gray-500")}>{renderIcon(item.icon)}</span>
                      {!collapsed && <span className="ml-2 font-medium">{item.title}</span>}
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-2 mt-auto border-t">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
                collapsed ? "px-2" : "px-4",
              )}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
