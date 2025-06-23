"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationToast } from "@/components/notification-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { studentAPI } from "@/lib/api";

export default function ApplyRebate() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", title: "", message: "" });
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setUserData(JSON.parse(stored));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) {
      setToastMessage({ type: "error", title: "Not Logged In", message: "Please login first." });
      setShowToast(true);
      return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (start > end) {
      setToastMessage({ type: "error", title: "Invalid Range", message: "From date > To date." });
      setShowToast(true);
      return;
    }
    if (start < todayDate) {
      setToastMessage({ type: "error", title: "Past Date", message: "From date in the past." });
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        student_id: userData.id,
        start_date: fromDate,
        end_date: toDate,
        reason,
      };
      const { data: newRequest } = await studentAPI.createRebateRequest(payload);

      // Use user-specific key for localStorage so that rebate data is unique per user
      const rebateStorageKey = `recentRebates_user_${userData.id}`;
      const updatedRequests = JSON.parse(localStorage.getItem(rebateStorageKey) || "[]");
      updatedRequests.unshift({ ...newRequest, reason });
      localStorage.setItem(rebateStorageKey, JSON.stringify(updatedRequests.slice(0, 5)));

      setToastMessage({
        type: "success",
        title: "Submitted",
        message: "Rebate request sent successfully.",
      });
      setShowToast(true);
      setTimeout(() => router.push("/student/dashboard"), 1500);
    } catch (err: any) {
      console.error(err);
      setToastMessage({ type: "error", title: "Error", message: err.message || "Failed." });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Apply for Rebate</h1>
          <p className="text-gray-600">Submit a new mess rebate application</p>
        </div>
        <Link href="/student/dashboard">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rebate Application Form</CardTitle>
          <CardDescription>Fill in the details below to apply for a mess rebate.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="fromDate" className="text-sm font-medium">From Date</label>
                <Input type="date" id="fromDate" value={fromDate} onChange={e => setFromDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="toDate" className="text-sm font-medium">To Date</label>
                <Input type="date" id="toDate" value={toDate} onChange={e => setToDate(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">Reason for Rebate</label>
              <Textarea
                id="reason"
                placeholder="Detailed reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/student/dashboard")}>Cancel</Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showToast && (
        <NotificationToast
          type={toastMessage.type as any}
          title={toastMessage.title}
          message={toastMessage.message}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

