
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Home, Save, ArrowLeft } from "lucide-react"
import { NotificationToast } from "@/components/notification-toast"

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    phone: "",
    room: "",
    hostel: "Hall 6",
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ type: "", title: "", message: "" })

  // Utility to get initials
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  useEffect(() => {
    // 1) Load currentUser
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      const user = JSON.parse(stored)
      setFormData({
        name: user.name || "",
        email: user.email || "",
        rollNumber: user.rollNo || "",
        phone: user.phone || "",
        room: user.roomNo || "",
        hostel: user.hostel || "Hall 6",
      })

      // 2) Load per-user image by email
      const imgKey = `userProfileImage_${user.email}`
      const img = localStorage.getItem(imgKey)
      setProfileImage(img || null)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Persist updated fields
    const current = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const updated = {
      ...current,
      name: formData.name,
      phone: formData.phone,
      roomNo: formData.room,
    }
    localStorage.setItem("currentUser", JSON.stringify(updated))

    setToastMessage({
      type: "success",
      title: "Profile Updated",
      message: "Your profile has been updated successfully.",
    })
    setShowToast(true)
    setIsEditing(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setToastMessage({
        type: "error",
        title: "File Too Large",
        message: "The image file size should not exceed 2MB.",
      })
      setShowToast(true)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setProfileImage(base64String)

      // Save it under a per-email key
      const imgKey = `userProfileImage_${formData.email}`
      localStorage.setItem(imgKey, base64String)

      setToastMessage({
        type: "success",
        title: "Profile Picture Updated",
        message: "Your profile picture has been updated successfully.",
      })
      setShowToast(true)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <Link href="/student/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Roll */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="rollNumber" className="text-sm font-medium">Roll Number</label>
                  <Input id="rollNumber" name="rollNumber" value={formData.rollNumber} disabled />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Room & Hostel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="room" className="text-sm font-medium">Room Number</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="room"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="hostel" className="text-sm font-medium">Hostel</label>
                  <Input id="hostel" name="hostel" value={formData.hostel} disabled />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                {isEditing ? (
                  <>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)} className="bg-sky-600 hover:bg-sky-700">
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-6">
              <AvatarImage
                src={profileImage || "/placeholder.svg"}
                alt="Profile Picture"
                onError={({ currentTarget }) => { currentTarget.src = "/placeholder.svg" }}
              />
              <AvatarFallback>{getInitials(formData.name)}</AvatarFallback>
            </Avatar>
            <div className="border-2 border-dashed rounded-md p-6 text-center w-full">
              <input
                type="file"
                id="profilePicture"
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
              />
              <label htmlFor="profilePicture" className="cursor-pointer text-sky-600 hover:text-sky-800">
                Click to upload a new picture
              </label>
              <p className="text-sm text-gray-500 mt-2">JPG or PNG (Max 2MB)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {showToast && (
        <NotificationToast
          type={toastMessage.type as "success" | "error" | "warning" | "info"}
          title={toastMessage.title}
          message={toastMessage.message}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

