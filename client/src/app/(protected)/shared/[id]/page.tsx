"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNoteById } from "@/services/notes.api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Loader2, FileText, ArrowLeft, Lock } from "lucide-react";

export default function SharedNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [noteData, setNoteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tự động xác thực khi user đã đăng nhập
  useEffect(() => {
    if (hasHydrated && user?.email) {
      handleAutoVerify();
    }
  }, [hasHydrated, user]);

  const handleAutoVerify = async () => {
    if (!user?.email) return;

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      // Sử dụng API thông thường để lấy note (đã có authentication)
      const note = await getNoteById(noteId);
      setNoteData(note);
      setIsVerified(true);

      toast.success("Đã tải ghi chú thành công!");
    } catch (error) {
      console.error("Load shared note error:", error);
      toast.error(
        "Không thể tải ghi chú này. Link có thể đã hết hạn hoặc bị xóa."
      );
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/notes");
  };

  // Hiển thị loading trong khi đang hydrate
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Hiển thị yêu cầu đăng nhập nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Yêu cầu đăng nhập
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Bạn cần đăng nhập để xem ghi chú được chia sẻ này
              </p>
            </div>
          </CardHeader>

          <CardContent className="text-center">
            <Button
              onClick={() => router.push("/auth")}
              className="w-full h-12"
            >
              Đăng nhập
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Bạn cần có tài khoản và đăng nhập vào hệ
                thống để có thể xem nội dung ghi chú được chia sẻ.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hiển thị loading khi đang xác thực hoặc tải dữ liệu
  if (isSubmitting || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải ghi chú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay về Notes
          </Button>
        </div>

        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {noteData?.name_vi || "Ghi chú được chia sẻ"}
                </CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    Ngày tạo:{" "}
                    {noteData?.created_at
                      ? new Date(noteData.created_at).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Không rõ"}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Đã xác thực
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {noteData?.description_vi && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {noteData.description_vi}
                </p>
              </div>
            )}

            <div className="prose max-w-none">
              {noteData?.content ? (
                <div
                  className="bg-white p-6 rounded-lg border"
                  dangerouslySetInnerHTML={{ __html: noteData.content }}
                />
              ) : (
                <div className="bg-white p-6 rounded-lg border text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nội dung ghi chú sẽ được hiển thị tại đây</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-800">
                Ghi chú này được chia sẻ từ <strong>NoteWise</strong> - Nền tảng
                quản lý ghi chú thông minh
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Truy cập bởi: {user?.email || "Người dùng"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
