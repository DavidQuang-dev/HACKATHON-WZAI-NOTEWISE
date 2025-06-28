"use client"

import { BookOpen, GraduationCap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const navItems = [
  { title: "Home", url: "/dashboard" },
  { title: "Notes", url: "/notes" },
  { title: "Record", url: "/record" },
  { title: "Upload", url: "/upload" },
]

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-8 py-5 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BookOpen className="h-6 w-6 text-white" />
                <GraduationCap className="h-3 w-3 text-blue-200 absolute -top-1 -right-1" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              NoteWise
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url)
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                  >
                    {item.title}
                  </Link>
                )
              })}
            </nav>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Sarah</div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  S
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">{children}</main>
    </div>
  )
}
