"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"

export default function HowToUse() {
  const [activeTab, setActiveTab] = useState("navigation")

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">How to Use</h1>
          <p className="text-gray-600">Learn how to navigate and use the mess rebate system</p>
        </div>
        <Link href="/student/dashboard">
          <Button variant="outline" className="back-button flex items-center gap-2 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="navigation" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="rebate">Applying for Rebate</TabsTrigger>
          <TabsTrigger value="tracking">Tracking Requests</TabsTrigger>
          <TabsTrigger value="bills">Viewing Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigating the System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Dashboard</h3>
                <p>The dashboard is your central hub for managing all mess rebate activities. From here, you can:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View a summary of your rebate requests</li>
                  <li>See your current mess bill</li>
                  <li>Access recent rebate requests</li>
                  <li>Navigate to other sections using the tabs or sidebar</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Sidebar Navigation</h3>
                <p>The sidebar on the left provides quick access to all sections of the application:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Dashboard</span> - Return to the main dashboard
                  </li>
                  <li>
                    <span className="font-medium">Apply Rebate</span> - Submit a new rebate request
                  </li>
                  <li>
                    <span className="font-medium">Request History</span> - View all your past and current requests
                  </li>
                  <li>
                    <span className="font-medium">Mess Bills</span> - View and download your mess bills
                  </li>
                  <li>
                    <span className="font-medium">Profile</span> - Update your personal information and profile picture
                  </li>
                  <li>
                    <span className="font-medium">How to Use</span> - Access this help guide
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Dashboard Tabs</h3>
                <p>The dashboard contains tabs that allow you to quickly switch between different views:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Overview</span> - See a summary of your rebate status and recent
                    requests
                  </li>
                  <li>
                    <span className="font-medium">Apply for Rebate</span> - Quick access to the rebate application form
                  </li>
                  <li>
                    <span className="font-medium">Rebate History</span> - View all your rebate requests in one place
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">User Profile</h3>
                <p>
                  Your profile is accessible from the top-right corner of the dashboard. Click on your profile picture
                  to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View your profile information</li>
                  <li>Access your bills</li>
                  <li>Go to the dashboard</li>
                  <li>Log out of the system</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rebate">
          <Card>
            <CardHeader>
              <CardTitle>Applying for a Rebate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Step 1: Access the Application Form</h3>
                <p>You can access the rebate application form in two ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click on "Apply Rebate" in the sidebar</li>
                  <li>Click on the "Apply for Rebate" tab on the dashboard</li>
                  <li>Click the "New Request" button on the dashboard</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Step 2: Fill Out the Form</h3>
                <p>Complete all required fields in the application form:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">From Date</span> - The first day you'll be absent from the mess
                  </li>
                  <li>
                    <span className="font-medium">To Date</span> - The last day you'll be absent from the mess
                  </li>
                  <li>
                    <span className="font-medium">Reason</span> - Provide a detailed explanation for your absence
                  </li>
                  <li>
                    <span className="font-medium">Proof Document</span> - Upload supporting documentation (e.g., travel
                    tickets, medical certificate)
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Step 3: Submit Your Request</h3>
                <p>After filling out all required fields:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Review your information for accuracy</li>
                  <li>Click the "Submit Request" button</li>
                  <li>You'll receive a confirmation notification if your submission is successful</li>
                  <li>Your request will now appear in your dashboard under "Pending" status</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Important Guidelines</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Requests must be submitted at least 24 hours in advance</li>
                  <li>The "From Date" cannot be in the past</li>
                  <li>Supporting documentation is mandatory for all requests</li>
                  <li>Acceptable file formats: PDF, JPG, or PNG (max 5MB)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Your Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Viewing Request Status</h3>
                <p>You can track the status of your rebate requests in several ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>On the dashboard under "Recent Requests"</li>
                  <li>In the "Rebate History" tab on the dashboard</li>
                  <li>By clicking on "Request History" in the sidebar</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Understanding Request Status</h3>
                <p>Your request will have one of the following statuses:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium text-yellow-600">Pending</span> - Your request has been submitted and
                    is awaiting review by the mess administrator
                  </li>
                  <li>
                    <span className="font-medium text-green-600">Approved</span> - Your request has been approved and
                    the rebate will be applied to your mess bill
                  </li>
                  <li>
                    <span className="font-medium text-red-600">Rejected</span> - Your request has been denied, with a
                    reason provided
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Request Details</h3>
                <p>To view the complete details of any request:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Find the request in your dashboard or request history</li>
                  <li>Click the "View Details" button</li>
                  <li>A modal will open showing all information about your request</li>
                  <li>If your request was rejected, you'll see the reason for rejection</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Filtering Requests</h3>
                <p>In the Request History section, you can filter your requests by status:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click on "All Requests" to see everything</li>
                  <li>Click on "Pending" to see only requests awaiting approval</li>
                  <li>Click on "Approved" to see only approved requests</li>
                  <li>Click on "Rejected" to see only rejected requests</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Your Mess Bills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Accessing Your Bills</h3>
                <p>You can access your mess bills in two ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click on "Mess Bills" in the sidebar</li>
                  <li>Click on "View Details" under the Current Bill section on the dashboard</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Bill Calculation</h3>
                <p>Your mess bill is calculated based on:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The total number of days in the month</li>
                  <li>The number of approved rebate days</li>
                  <li>The daily mess rate</li>
                  <li>Any additional charges or fees</li>
                </ul>
                <p className="mt-2">
                  <span className="font-medium">Formula:</span> Bill Amount = (Total Days - Rebate Days) × Daily Rate +
                  Additional Charges
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Bill Details</h3>
                <p>When viewing a bill, you'll see:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Month and year of the bill</li>
                  <li>Total number of days in the month</li>
                  <li>Number of rebate days</li>
                  <li>Number of billable days</li>
                  <li>Daily rate</li>
                  <li>Total amount</li>
                  <li>Payment status</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Bill History</h3>
                <p>In the Mess Bills section, you can:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View your current bill</li>
                  <li>Access a history of all previous bills</li>
                  <li>Download bills as PDF for your records</li>
                  <li>Check payment status of each bill</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-center">
        <Link href="/student/dashboard">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
