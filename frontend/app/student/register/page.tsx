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

export default function StudentRegister() {
  const router = useRouter();

  // 🚨 Clear any old auth data on mount
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUser");
  }, []);

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [hall, setHall] = useState("");     // hostel
  const [room, setRoom] = useState("");     // room_number
  const [mobile, setMobile] = useState(""); // phone

  // OTP/UI state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", title: "", message: "" });

  // countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // send registration OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { name, email, roll_number: rollNumber, hostel: hall, room_number: room, phone: mobile };
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to send OTP");
      }
      setToastMessage({ type: "success", title: "OTP Sent", message: "Check your email for the code." });
      setShowToast(true);
      setOtpSent(true);
      setCountdown(30);
    } catch (err: any) {
      setToastMessage({ type: "error", title: "Registration Failed", message: err.message });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // verify OTP, store token & user exactly as login does
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
      console.log("Registration verify response:", data);

      // store token (backend returns `access_token`)
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      // store user object
      if (data.user) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      }

      setToastMessage({ type: "success", title: "Verified!", message: "Redirecting to dashboard…" });
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
      const payload = { name, email, roll_number: rollNumber, hostel: hall, room_number: room, phone: mobile };
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to resend OTP");
      setToastMessage({ type: "success", title: "OTP Resent", message: "Check email again." });
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
          <CardTitle className="text-3xl text-sky-600">Student Registration</CardTitle>
          <CardDescription className="text-gray-600">
            {otpSent
              ? "Enter the OTP we emailed you to verify your account"
              : "Fill out your details and we'll email you a verification code"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} disabled={isLoading} required />
              <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} required />
              <Input placeholder="Roll Number" value={rollNumber} onChange={e => setRollNumber(e.target.value)} disabled={isLoading} required />
              <Input placeholder="Hall" value={hall} onChange={e => setHall(e.target.value)} disabled={isLoading} required />
              <Input placeholder="Room No." value={room} onChange={e => setRoom(e.target.value)} disabled={isLoading} required />
              <Input placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} disabled={isLoading} required />
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={isLoading}>
                {isLoading ? "Sending OTP…" : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input placeholder="Enter 6‑digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} disabled={isLoading} required />
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={isLoading}>
                {isLoading ? "Verifying…" : "Verify OTP"}
              </Button>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive it?{" "}
                  {countdown > 0 ? (
                    <span>Resend in {countdown}s</span>
                  ) : (
                    <Button variant="link" onClick={handleResendOtp} disabled={isLoading}>
                      {isLoading ? "Sending…" : "Resend OTP"}
                    </Button>
                  )}
                </p>
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
        <NotificationToast type={toastMessage.type as "success" | "error"} title={toastMessage.title} message={toastMessage.message} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}



