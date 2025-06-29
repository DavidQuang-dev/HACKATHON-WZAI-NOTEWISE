import api from "../lib/api";

export const uploadFile = async (file: File) => {
  const formData = new FormData(); // Create a new FormData object to handle file uploads
  formData.append("file", file); //

  const res = await api.post("/file/upload-audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
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
