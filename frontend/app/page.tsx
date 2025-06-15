import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-sky-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-sky-600">Mess Rebate System</h1>
        </header>
        <main className="flex flex-col items-center justify-center py-16">
          <h2 className="text-5xl font-bold text-sky-600 mb-6 text-center">
            Simplified Mess Rebate Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl text-center mb-12">
            Apply for mess rebates online, track your applications, and get notified about their status - all in one place.
          </p>
          
          {/* 🔧 FIXED: Changed button layout structure */}
          <div className="flex flex-col items-center gap-6">
            {/* 🔧 FIXED: Buttons container - now side by side with proper spacing */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* 🔧 FIXED: Removed nested flex-col wrapper from Student Register button */}
              <Link href="/student/register">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8">
                  Student Register <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              {/* 🟡 Admin Login Button remains unchanged */}
              <Link href="/admin/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-sky-600 text-sky-600 hover:bg-sky-50 px-8"
                >
                  Admin Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {/* 🔧 FIXED: Login link moved outside and centered below both buttons */}
            <Link href="/student/login">
              <p className="text-sky-600 hover:underline text-sm">
                Already registered? Login
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
