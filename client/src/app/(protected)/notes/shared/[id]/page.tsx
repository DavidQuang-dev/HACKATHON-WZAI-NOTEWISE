"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { shareNote, getNoteById } from "@/services/notes.api";
import { toast } from "sonner";
import { Loader2, FileText, User } from "lucide-react";

export default function SharedNotePage() {
  const params = useParams();
  const noteId = params.id as string;

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [noteData, setNoteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Vui lòng nhập email của bạn");
      return;
    }

    try {
      setIsSubmitting(true);
      // Gọi API để xác thực email và lấy quyền truy cập ghi chú
      await shareNote(noteId, email);
      setIsVerified(true);

      // Sau khi xác thực thành công, lấy dữ liệu ghi chú
      setIsLoading(true);
      const note = await getNoteById(noteId);
      setNoteData(note);

      toast.success("Xác thực thành công! Đang tải ghi chú...");
    } catch (error) {
      toast.error("Không thể xác thực email. Vui lòng kiểm tra lại.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Truy cập ghi chú chia sẻ
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Vui lòng nhập email của bạn để xem nội dung ghi chú này
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Email của bạn
                </label>
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Truy cập ghi chú"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Email của bạn sẽ được sử dụng để xác
                thực quyền truy cập ghi chú này. Thông tin email sẽ được bảo mật
                và không được chia sẻ.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
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
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {noteData?.name_vi || "Ghi chú được chia sẻ"}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Được chia sẻ vào{" "}
                  {noteData?.created_at
                    ? new Date(noteData.created_at).toLocaleDateString("vi-VN")
                    : ""}
                </p>
              </div>
              <div className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                Đã xác thực: {email}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {noteData?.description_vi && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {noteData.description_vi}
                </p>
              </div>
            )}

            {/* Hiển thị nội dung ghi chú khác nếu có */}
            <div className="prose max-w-none">
              {/* Có thể hiển thị markdown content hoặc các thông tin khác từ noteData */}
              {noteData?.content && (
                <div dangerouslySetInnerHTML={{ __html: noteData.content }} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
