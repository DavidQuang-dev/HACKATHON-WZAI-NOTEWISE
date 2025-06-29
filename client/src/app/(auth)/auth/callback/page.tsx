"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// Component chứa logic callback
function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      setLoading(true);

      try {
        const accessToken = searchParams.get("accessToken");

        if (!accessToken) {
          throw new Error("No access token received");
        } else {
          // Lưu accessToken vào zustand trước
          setAuth(null, accessToken);
        }

        // Gọi API bằng axios để lấy user info
        const response = await api.get("/account/me");
        // console.log(response.data?.data);

        const userData = response.data?.data;

        const user = {
          id: userData.userID,
          name: userData.fullName,
          email: userData.email,
          birthday: userData.birthday || null,
          phone: userData.phone || null,
          avatar: userData.profilePicture || null,
        };

        // Lưu trạng thái vào Zustand store
        setAuth(user, accessToken);

        // Kiểm tra có returnUrl không để redirect về trang gốc
        const returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          localStorage.removeItem("returnUrl"); // Xóa sau khi sử dụng
          router.replace(returnUrl);
        } else {
          router.replace("/dashboard"); // Default redirect
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.replace("/?error=callback_failed");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router, setAuth, setLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}

// Export mặc định: bọc trong Suspense
export default function AuthCallback() {
  return (
    <Suspense>
      <AuthCallbackInner />
    </Suspense>
  );
}
