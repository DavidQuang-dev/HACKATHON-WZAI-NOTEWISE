"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Info } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { LoginButton } from "@/components/auth/google-login-button";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);

  useEffect(() => {
    // Kiểm tra có returnUrl không để hiển thị thông báo
    const url = localStorage.getItem("returnUrl");
    setReturnUrl(url);
  }, []);

  const handleLoginWithEmail = () => {
    if (email.trim() === "") {
      alert("Vui lòng nhập email của bạn");
      return;
    }
    loginWithEmail(email);
  };
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center scale-105">
            <div className="flex items-center justify-center mb-4 scale-110">
              <img
                src="/logo.jpg"
                alt="Hacka Logo"
                className="h-28 w-28 object-contain "
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">NoteWise</h1>
          </div>

          {/* Welcome back */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back
            </h2>
          </div>

          {/* Return URL Notification */}
          {returnUrl && returnUrl.includes("/shared/") && (
            <div className="mb-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">
                    Truy cập ghi chú được chia sẻ
                  </h4>
                  <p className="text-sm text-blue-700">
                    Bạn đang truy cập một ghi chú được chia sẻ. Sau khi đăng
                    nhập, bạn sẽ được chuyển đến nội dung ghi chú.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <CardContent className="space-y-5 relative z-10">
            {/* Simplified Login Form - Just Email */}
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-blue-800 font-mono font-bold tracking-wide flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="example@email.com"
                className="bg-blue-50/80 border-2 border-blue-300 text-blue-900 placeholder:text-blue-400 font-mono focus:border-blue-500 focus:ring-blue-400/20 focus:bg-white/90 transition-all duration-300"
              />
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <Button
                onClick={handleLoginWithEmail}
                disabled={!email.trim()}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300 text-white font-bold text-lg py-6 border-2 border-blue-400 shadow-lg shadow-blue-300/50 transition-all duration-300 hover:shadow-blue-400/60 hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue with Email
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-blue-300/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-blue-300"></div>
              <span
                className="flex-shrink mx-4 text-blue-600 text-sm"
                style={{ fontFamily: "monospace" }}
              >
                OR
              </span>
              <div className="flex-grow border-t border-blue-300"></div>
            </div>

            {/* Google Login Button */}
            <LoginButton />
          </CardContent>
        </div>
      </div>

      {/* Right side - Branding */}
    </div>
  );
}
