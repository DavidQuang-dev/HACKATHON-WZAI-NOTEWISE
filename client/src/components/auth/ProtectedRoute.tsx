"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      // Lưu current URL vào localStorage để redirect lại sau khi login
      localStorage.setItem("returnUrl", pathname);

      // Redirect đến auth page (root page)
      router.replace("/");
    }
  }, [accessToken, hasHydrated, router, pathname]);

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
