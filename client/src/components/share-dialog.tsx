"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  shareUrl,
}: ShareDialogProps) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Liên kết đã được sao chép vào clipboard.");
    } catch (error) {
      toast.error("Unable to copy link. Please try again.");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ ghi chú</DialogTitle>
          <DialogDescription>
            Sao chép liên kết bên dưới và gửi cho người bạn muốn chia sẻ. Họ sẽ
            cần nhập email của mình để truy cập ghi chú.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button onClick={handleCopy} disabled={isCopying}>
            {isCopying ? "Đang sao chép..." : "Sao chép"}
          </Button>
        </div>

        <DialogFooter>
          <p className="text-sm text-gray-500">
            Người nhận sẽ cần nhập email của họ để xác thực và xem nội dung ghi
            chú.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
