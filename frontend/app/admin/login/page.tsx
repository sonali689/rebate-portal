"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { NotificationToast } from "@/components/notification-toast"

// 🔧 Use your API_BASE_URL instead of hardcoding localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@iitk.ac.in")
  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ type: "", title: "", message: "" })
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {  // 🔧 use API_BASE_URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roll_number: "" }),               // OK: roll_number ignored for admin
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to send OTP.")
      }

      setToastMessage({
        type: "info",
        title: "OTP Sent",
        message: `OTP sent to your email: ${email}`,
      })
      setShowToast(true)
      setShowOtpInput(true)
      setCountdown(30)
    } catch (error: any) {
      setToastMessage({
        type: "error",
        title: "Login Error",
        message: error.message || "Something went wrong!",
      })
      setShowToast(true)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {  // 🔧 use API_BASE_URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otp }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "OTP verification failed.")
      }

      const data = await response.json()
      // 🔧 store under same key getAuthToken expects ("access_token")
      localStorage.setItem("access_token", data.access_token)
      // 🔧 use same key as lib/api for current user
      localStorage.setItem("currentAdmin", JSON.stringify(data.user))

      setToastMessage({
        type: "success",
        title: "Login Successful",
        message: "You have successfully logged in.",
      })
      setShowToast(true)

      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1500)
    } catch (error: any) {
      setToastMessage({
        type: "error",
        title: "Invalid OTP",
        message: error.message || "OTP verification failed.",
      })
      setShowToast(true)
    }
  }

  const handleResendOtp = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {  // 🔧 use API_BASE_URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roll_number: "" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to resend OTP.")
      }

      setToastMessage({
        type: "info",
        title: "OTP Resent",
        message: `A new OTP has been sent to ${email}`,
      })
      setShowToast(true)
      setCountdown(30)
    } catch (error: any) {
      setToastMessage({
        type: "error",
        title: "Resend Failed",
        message: error.message || "Could not resend OTP.",
      })
      setShowToast(true)
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-sky-600">Admin Login</CardTitle>
          <CardDescription className="text-gray-600">
            {showOtpInput
              ? "Enter the OTP sent to your email to verify your identity"
              : "Enter your email to access the admin dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showOtpInput ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">
                  One-Time Password (OTP)
                </label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
                Verify OTP
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the OTP?{" "}
                  {countdown > 0 ? (
                    <span>Resend in {countdown}s</span>
                  ) : (
                    <Button variant="link" className="p-0 h-auto text-sky-600" onClick={handleResendOtp}>
                      Resend OTP
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


