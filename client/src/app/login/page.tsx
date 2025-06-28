"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BookOpen } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <BookOpen className="h-12 w-12 text-blue-600" />
              <GraduationCap className="h-6 w-6 text-blue-800 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">NoteWise</h1>
          <p className="text-gray-600 mt-2">AI Learning Assistant</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right">
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Link href="/dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
