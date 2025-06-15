"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Mail, Bell, Shield, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminSettings() {
  const [emailSettings, setEmailSettings] = useState({
    newRequests: true,
    approvals: true,
    rejections: true,
    dailySummary: false,
  })

  const [generalSettings, setGeneralSettings] = useState({
    maxRebateDays: "30",
    minRebateDays: "3",
    advanceNotice: "2",
    autoApprove: false,
    requireProof: true,
  })

  const handleEmailSettingChange = (setting: keyof typeof emailSettings) => {
    setEmailSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleGeneralSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Settings</h1>
          <p className="text-gray-600">Configure system settings and preferences</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline" className="back-button flex items-center gap-2 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="admins">Administrators</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxRebateDays">Maximum Rebate Days</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="maxRebateDays"
                        name="maxRebateDays"
                        type="number"
                        className="pl-10"
                        value={generalSettings.maxRebateDays}
                        onChange={handleGeneralSettingChange}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Maximum number of days allowed for a single rebate request</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minRebateDays">Minimum Rebate Days</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="minRebateDays"
                        name="minRebateDays"
                        type="number"
                        className="pl-10"
                        value={generalSettings.minRebateDays}
                        onChange={handleGeneralSettingChange}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Minimum number of days required for a rebate request</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="advanceNotice">Advance Notice (Days)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="advanceNotice"
                        name="advanceNotice"
                        type="number"
                        className="pl-10"
                        value={generalSettings.advanceNotice}
                        onChange={handleGeneralSettingChange}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      How many days in advance students must submit rebate requests
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Select defaultValue="2024-2025">
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">Current academic year for rebate calculations</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireProof" className="text-base">
                        Require Proof Document
                      </Label>
                      <p className="text-sm text-gray-500">Require students to upload proof for rebate requests</p>
                    </div>
                    <Switch
                      id="requireProof"
                      name="requireProof"
                      checked={generalSettings.requireProof}
                      onCheckedChange={(checked) => setGeneralSettings((prev) => ({ ...prev, requireProof: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoApprove" className="text-base">
                        Auto-approve Short Rebates
                      </Label>
                      <p className="text-sm text-gray-500">Automatically approve rebate requests shorter than 3 days</p>
                    </div>
                    <Switch
                      id="autoApprove"
                      name="autoApprove"
                      checked={generalSettings.autoApprove}
                      onCheckedChange={(checked) => setGeneralSettings((prev) => ({ ...prev, autoApprove: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                    <Save className="mr-2 h-4 w-4" /> Save Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Mail className="mr-2 h-5 w-5" /> Email Notifications
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newRequests" className="text-base">
                          New Rebate Requests
                        </Label>
                        <p className="text-sm text-gray-500">Receive emails when new rebate requests are submitted</p>
                      </div>
                      <Switch
                        id="newRequests"
                        checked={emailSettings.newRequests}
                        onCheckedChange={() => handleEmailSettingChange("newRequests")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="approvals" className="text-base">
                          Approval Notifications
                        </Label>
                        <p className="text-sm text-gray-500">
                          Send email notifications to students when requests are approved
                        </p>
                      </div>
                      <Switch
                        id="approvals"
                        checked={emailSettings.approvals}
                        onCheckedChange={() => handleEmailSettingChange("approvals")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="rejections" className="text-base">
                          Rejection Notifications
                        </Label>
                        <p className="text-sm text-gray-500">
                          Send email notifications to students when requests are rejected
                        </p>
                      </div>
                      <Switch
                        id="rejections"
                        checked={emailSettings.rejections}
                        onCheckedChange={() => handleEmailSettingChange("rejections")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dailySummary" className="text-base">
                          Daily Summary
                        </Label>
                        <p className="text-sm text-gray-500">Receive a daily summary of all rebate activity</p>
                      </div>
                      <Switch
                        id="dailySummary"
                        checked={emailSettings.dailySummary}
                        onCheckedChange={() => handleEmailSettingChange("dailySummary")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Bell className="mr-2 h-5 w-5" /> System Notifications
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="emailTemplate">Email Template</Label>
                    <Select defaultValue="default">
                      <SelectTrigger id="emailTemplate">
                        <SelectValue placeholder="Select email template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Template</SelectItem>
                        <SelectItem value="minimal">Minimal Template</SelectItem>
                        <SelectItem value="detailed">Detailed Template</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">Template used for all system emails</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="mr-2 h-4 w-4" /> Save Notification Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Shield className="mr-2 h-5 w-5" /> Access Control
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="30" />
                    <p className="text-sm text-gray-500">
                      Time of inactivity after which users will be automatically logged out
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor" className="text-base">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-gray-500">Require two-factor authentication for admin accounts</p>
                    </div>
                    <Switch id="twoFactor" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ipRestriction" className="text-base">
                        IP Restriction
                      </Label>
                      <p className="text-sm text-gray-500">Restrict admin access to specific IP addresses</p>
                    </div>
                    <Switch id="ipRestriction" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password Policy</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="strongPasswords" className="text-base">
                        Require Strong Passwords
                      </Label>
                      <p className="text-sm text-gray-500">
                        Enforce minimum password strength requirements for all users
                      </p>
                    </div>
                    <Switch id="strongPasswords" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input id="passwordExpiry" type="number" defaultValue="90" />
                    <p className="text-sm text-gray-500">Number of days after which users must change their password</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="mr-2 h-4 w-4" /> Save Security Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Management</CardTitle>
              <CardDescription>Manage administrator accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Administrator Accounts</h3>
                  <Button>Add Administrator</Button>
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-4">Email</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Actions</div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 p-4 border-b">
                    <div className="col-span-3">Amit Sharma</div>
                    <div className="col-span-4">amit@iitk.ac.in</div>
                    <div className="col-span-2">Super Admin</div>
                    <div className="col-span-2">
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Active</span>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 p-4 border-b">
                    <div className="col-span-3">Priya Gupta</div>
                    <div className="col-span-4">priya@iitk.ac.in</div>
                    <div className="col-span-2">Admin</div>
                    <div className="col-span-2">
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Active</span>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 p-4">
                    <div className="col-span-3">Rajesh Kumar</div>
                    <div className="col-span-4">rajesh@iitk.ac.in</div>
                    <div className="col-span-2">Viewer</div>
                    <div className="col-span-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">Inactive</span>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Role Permissions</h3>

                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium text-sm">
                      <div className="col-span-1">Permission</div>
                      <div className="col-span-1">Super Admin</div>
                      <div className="col-span-1">Admin</div>
                      <div className="col-span-1">Manager</div>
                      <div className="col-span-1">Viewer</div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 p-4 border-b">
                      <div className="col-span-1">View Requests</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">✓</div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 p-4 border-b">
                      <div className="col-span-1">Approve/Reject</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">-</div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 p-4 border-b">
                      <div className="col-span-1">Manage Settings</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">-</div>
                      <div className="col-span-1">-</div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 p-4">
                      <div className="col-span-1">Manage Admins</div>
                      <div className="col-span-1">✓</div>
                      <div className="col-span-1">-</div>
                      <div className="col-span-1">-</div>
                      <div className="col-span-1">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
