"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.replace("/"); // Redirect về trang login/home nếu chưa đăng nhập
    }
  }, [accessToken, hasHydrated, router]);

  if (!hasHydrated) {
    return (
      <div className="p-10 text-center">Đang tải trạng thái đăng nhập...</div>
    );
  }

  if (!accessToken) {
    return <div className="p-10 text-center">Đang chuyển hướng...</div>;
  }

  return <>{children}</>;
}
