"use client"

import { Check, X, AlertCircle, Info } from "lucide-react"

// Define the toast type
export type ToastType = "success" | "error" | "warning" | "info";

interface NotificationToastProps {
  type: ToastType
  title?: string  // Make title optional since you're only passing message
  message: string
  onClose?: () => void
}

export function NotificationToast({ type, title, message, onClose }: NotificationToastProps) {
  const icons = {
    success: <Check className="h-5 w-5 text-green-600" />,
    error: <X className="h-5 w-5 text-red-600" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  }

  const bgColors = {
    success: "bg-green-100",
    error: "bg-red-100",
    warning: "bg-yellow-100",
    info: "bg-blue-100",
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 z-50">
      <div className={`${bgColors[type]} p-2 rounded-full`}>{icons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="font-medium">{title}</h4>}
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
