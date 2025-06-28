"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, BookOpen } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <BookOpen className="h-16 w-16 text-blue-600" />
                <GraduationCap className="h-8 w-8 text-blue-800 absolute -top-2 -right-2" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">NoteWise</h1>
          </div>

          {/* Welcome back */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="text-right">
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Link href="/dashboard">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">Login</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="flex-1 bg-blue-600 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <BookOpen className="h-24 w-24 text-white" />
              <GraduationCap className="h-12 w-12 text-blue-200 absolute -top-3 -right-3" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">NoteWise</h2>
          <p className="text-xl text-blue-100">AI Learning Assistant</p>
        </div>
      </div>
    </div>
  )
}
