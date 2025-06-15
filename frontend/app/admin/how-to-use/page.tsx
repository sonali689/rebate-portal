"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"

export default function AdminHowToUse() {
  const [activeTab, setActiveTab] = useState("navigation")

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Admin Guide</h1>
          <p className="text-gray-600">Learn how to manage the mess rebate system</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="navigation" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="requests">Managing Requests</TabsTrigger>
          <TabsTrigger value="bills">Generating Bills</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
        </TabsList>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigating the Admin System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Dashboard</h3>
                <p>
                  The admin dashboard is your central hub for managing all mess rebate activities. From here, you can:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View a summary of all rebate requests</li>
                  <li>See pending approvals that require your attention</li>
                  <li>Access recent request history</li>
                  <li>Navigate to other sections using the sidebar</li>
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
                    <span className="font-medium">Students</span> - Manage student information and accounts
                  </li>
                  <li>
                    <span className="font-medium">Mess Bills</span> - Generate and manage monthly mess bills
                  </li>
                  <li>
                    <span className="font-medium">Reports</span> - Access system reports and analytics
                  </li>
                  <li>
                    <span className="font-medium">Settings</span> - Configure system settings and preferences
                  </li>
                  <li>
                    <span className="font-medium">How to Use</span> - Access this help guide
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Admin Profile</h3>
                <p>
                  Your profile is accessible from the top-right corner of the dashboard. Click on your profile picture
                  to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View your profile information</li>
                  <li>Go to the dashboard</li>
                  <li>Log out of the system</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Managing Rebate Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Reviewing Pending Requests</h3>
                <p>All new rebate requests appear in the "Pending Requests" section of the dashboard:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Each request shows the student's name, roll number, and request details</li>
                  <li>You can view the full details by clicking "View Details"</li>
                  <li>You can view the supporting document by clicking "View Document"</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Approving Requests</h3>
                <p>To approve a rebate request:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Review the request details and supporting documentation</li>
                  <li>If everything is in order, click the "Approve" button</li>
                  <li>The request will be moved from "Pending Requests" to "Recent Requests"</li>
                  <li>The student will be notified of the approval</li>
                  <li>The approved rebate days will be factored into the student's mess bill</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Rejecting Requests</h3>
                <p>If a request doesn't meet the requirements:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click the "Reject" button</li>
                  <li>A modal will appear asking for a rejection reason</li>
                  <li>Provide a clear explanation for the rejection</li>
                  <li>Click "Confirm Rejection"</li>
                  <li>The request will be moved to "Recent Requests" with a "Rejected" status</li>
                  <li>The student will be notified of the rejection and the reason</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Viewing Request History</h3>
                <p>The "Recent Requests" section shows all previously processed requests:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You can see both approved and rejected requests</li>
                  <li>Each request shows its current status</li>
                  <li>For rejected requests, you can see the rejection reason</li>
                  <li>You can still view the details and supporting documents for reference</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills">
          <Card>
            <CardHeader>
              <CardTitle>Generating and Managing Mess Bills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Monthly Bill Generation</h3>
                <p>To generate monthly mess bills:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Navigate to the "Mess Bills" section from the sidebar</li>
                  <li>Click on "Generate New Bill"</li>
                  <li>Select the month and year for the bill</li>
                  <li>Enter the daily mess rate</li>
                  <li>Review the rebate summary for all students</li>
                  <li>Click "Generate Bills" to create bills for all students</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Bill Calculation</h3>
                <p>The system automatically calculates each student's bill based on:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The total number of days in the month</li>
                  <li>The number of approved rebate days for each student</li>
                  <li>The daily mess rate you've specified</li>
                  <li>Any additional charges or fees</li>
                </ul>
                <p className="mt-2">
                  <span className="font-medium">Formula:</span> Bill Amount = (Total Days - Rebate Days) × Daily Rate +
                  Additional Charges
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Managing Bills</h3>
                <p>After generating bills, you can:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View all bills for the selected month</li>
                  <li>Search for specific students</li>
                  <li>Export the bill data as CSV or PDF</li>
                  <li>Mark bills as paid or unpaid</li>
                  <li>Make adjustments to individual bills if necessary</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Bill History</h3>
                <p>You can access previous months' bills:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Select the desired month and year from the dropdown</li>
                  <li>View a summary of that month's billing</li>
                  <li>Access individual student bills from that period</li>
                  <li>Generate reports on payment status</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Viewing Student Information</h3>
                <p>To access student information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Navigate to the "Students" section from the sidebar</li>
                  <li>View the list of all registered students</li>
                  <li>Use the search function to find specific students</li>
                  <li>Click on a student's name to view their complete profile</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Student Profiles</h3>
                <p>Each student profile contains:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal information (name, roll number, email)</li>
                  <li>Room number and hostel details</li>
                  <li>Rebate history</li>
                  <li>Billing history</li>
                  <li>Contact information</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Managing Student Accounts</h3>
                <p>As an administrator, you can:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Add new students to the system</li>
                  <li>Update student information</li>
                  <li>Deactivate accounts for students who have left the hostel</li>
                  <li>Reset student passwords if needed</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-600">Student Reports</h3>
                <p>You can generate various reports related to students:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>List of students with outstanding bills</li>
                  <li>Students with the most rebate days</li>
                  <li>Room-wise student distribution</li>
                  <li>Export student data for administrative purposes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-center">
        <Link href="/admin/dashboard">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
