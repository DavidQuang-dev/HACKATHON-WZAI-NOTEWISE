import api from "@/lib/api";
import { GetNotesParams, NotesPagination } from "@/types/notes";

export const getAllNotes = async (params: GetNotesParams) => {
    const res = await api.get<NotesPagination>('/note', { params });
    return res.data;
    // <NotesPagination> là để chi định kiểu dữ liệu trả về từ API
}

export const getNoteById = async (id: string) => {
    const res = await api.get(`/note/${id}`);
    return res.data;
}

export const shareNote = async (id: string, email: string) => {
    const res = await api.post(`/note/shared`, {
        email: email,
        noteId: id
    })
    return res.data;
}

export const getSharedNoteById = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"; 
    const res = await api.get(`/note/shared/${id}`, {
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
        },
        // Không gửi credentials hoặc token nếu không cần authentication
    });
    return res.data;
}
