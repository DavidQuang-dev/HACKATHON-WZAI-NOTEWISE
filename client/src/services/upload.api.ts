import api from "../lib/api";
import axios from "axios";

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log(
      "Uploading file:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type
    );

    // Create axios instance without auth for public endpoint
    const uploadApi = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
      timeout: 120000,
    });

    const res = await uploadApi.post("/file/upload-audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Upload error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    if (error.response?.status === 413) {
      throw new Error("File quá lớn. Vui lòng chọn file nhỏ hơn 25MB.");
    }

    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message || "Định dạng file không được hỗ trợ."
      );
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("Upload timeout. Vui lòng thử lại.");
    }

    throw new Error(
      error.response?.data?.message || "Lỗi upload file. Vui lòng thử lại."
    );
  }
};

export const deleteFile = async (fileUrl: string) => {
  const res = await api.delete("/file/delete", {
    data: { fileUrl },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
