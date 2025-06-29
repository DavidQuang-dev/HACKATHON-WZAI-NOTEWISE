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
import { useToast } from "@/components/ui/use-toast";

export function ShareDialog({
  open,
  onOpenChange,
  shareUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}) {
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied!",
      description: "The link has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đã tạo liên kết công khai</DialogTitle>
          <DialogDescription>
            Sao chép liên kết bên dưới để chia sẻ với người khác.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button onClick={handleCopy}>Sao chép liên kết</Button>
        </div>

        <DialogFooter>
          <p className="text-sm text-gray-500">
            Người nhận chỉ cần dán link này vào trình duyệt để truy cập.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
