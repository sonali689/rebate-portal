"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { NotificationToast } from "@/components/notification-toast";

export default function StudentLogin() {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", title: "", message: "" });

  // countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // send login OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roll_number: rollNumber }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to send OTP");
      }
      const data = await res.json();
      setToastMessage({ type: "success", title: "OTP Sent", message: data.message });
      setShowToast(true);
      setShowOtpInput(true);
      setCountdown(30);
    } catch (err: any) {
      setToastMessage({ type: "error", title: "Login Failed", message: err.message });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // verify login OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otp }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Invalid or expired OTP");
      }
      const data = await res.json();

      // ✅ Store token & user
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      setToastMessage({ type: "success", title: "Login Successful", message: "Redirecting…" });
      setShowToast(true);

      setTimeout(() => router.push("/student/dashboard"), 1500);
    } catch (err: any) {
      setToastMessage({ type: "error", title: "Verification Failed", message: err.message });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roll_number: rollNumber }),
      });
      if (!res.ok) throw new Error("Failed to resend OTP");
      setToastMessage({ type: "success", title: "OTP Resent", message: "Check your email again." });
      setShowToast(true);
      setCountdown(30);
    } catch (err: any) {
      setToastMessage({ type: "error", title: "Resend Failed", message: err.message });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-sky-600">Student Login</CardTitle>
          <CardDescription className="text-gray-600">
            {showOtpInput
              ? "Enter the OTP sent to your email"
              : "Enter your roll number & email to get an OTP"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showOtpInput ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <Input
                placeholder="Roll Number"
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                required
                disabled={isLoading}
              />
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <div className="text-center">
                {countdown > 0 ? (
                  <span className="text-sm text-gray-500">Resend in {countdown}s</span>
                ) : (
                  <Button variant="link" onClick={handleResendOtp} disabled={isLoading}>
                    Resend OTP
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Link href="/" className="inline-flex items-center text-sky-600 hover:text-sky-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </CardFooter>
      </Card>

      {showToast && (
        <NotificationToast type={toastMessage.type as "success" | "error" | "info"} title={toastMessage.title} message={toastMessage.message} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

