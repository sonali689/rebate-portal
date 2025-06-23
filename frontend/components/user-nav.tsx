/*"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface UserData {
  name: string
  email: string
  rollNo?: string
  roomNo?: string
  role?: string
}

export function UserNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem(isAdmin ? "currentAdmin" : "currentUser")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    }

    // Get profile image from localStorage
    const storedImage = localStorage.getItem(isAdmin ? "adminProfileImage" : "userProfileImage")
    if (storedImage) {
      setProfileImage(storedImage)
    }
  }, [isAdmin])

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem(isAdmin ? "currentAdmin" : "currentUser")
    // Redirect to home page
    router.push("/")
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!userData) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {profileImage ? (
              <AvatarImage src={profileImage || "/placeholder.svg"} alt={userData.name} />
            ) : (
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userData.name} />
            )}
            <AvatarFallback>{userData.name ? getInitials(userData.name) : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
            {!isAdmin && userData.rollNo && (
              <p className="text-xs leading-none text-muted-foreground">Roll No: {userData.rollNo}</p>
            )}
            {isAdmin && userData.role && (
              <p className="text-xs leading-none text-muted-foreground">Role: {userData.role}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(isAdmin ? "/admin/settings" : "/student/profile")}>
            Profile
          </DropdownMenuItem>
          {!isAdmin && <DropdownMenuItem onClick={() => router.push("/student/bills")}>My Bills</DropdownMenuItem>}
          <DropdownMenuItem onClick={() => router.push(isAdmin ? "/admin/dashboard" : "/student/dashboard")}>
            Dashboard
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}*/

// components/user-nav.tsx
// src/components/user-nav.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ENABLE_BILL } from "@/lib/utils";

interface UserData {
  name: string;
  email: string;
  rollNo?: string;
  role?: string;
}

export function UserNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const key = isAdmin ? "currentAdmin" : "currentUser";
    const stored = localStorage.getItem(key);
    if (!stored) return;
    try {
      const parsed: UserData = JSON.parse(stored);
      setUserData(parsed);
      const imageKey = `userProfileImage_${parsed.email}`;
      const img = localStorage.getItem(imageKey);
      setProfileImage(img || "/placeholder.svg");
      const onStorage = (e: StorageEvent) => {
        if (e.key === imageKey) {
          setProfileImage(e.newValue || "/placeholder.svg");
        }
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    } catch {
      setUserData(null);
      setProfileImage("/placeholder.svg");
    }
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem(isAdmin ? "currentAdmin" : "currentUser");
    router.push("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!mounted || !userData) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profileImage}
              alt={userData.name}
              onError={({ currentTarget }) => {
                currentTarget.src = "/placeholder.svg";
              }}
            />
            <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
            {!isAdmin && userData.rollNo && (
              <p className="text-xs leading-none text-muted-foreground">Roll No: {userData.rollNo}</p>
            )}
            {isAdmin && (
              <p className="text-xs leading-none text-muted-foreground">Role: {userData.role || "Admin"}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(isAdmin ? "/admin/settings" : "/student/profile")}>
            Profile
          </DropdownMenuItem>

          {/* Conditionally show My Bills when billing is enabled */}
          {!isAdmin && ENABLE_BILL && (
            <DropdownMenuItem onClick={() => router.push("/student/bills")}>My Bills</DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => router.push(isAdmin ? "/admin/dashboard" : "/student/dashboard")}>
            Dashboard
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}






