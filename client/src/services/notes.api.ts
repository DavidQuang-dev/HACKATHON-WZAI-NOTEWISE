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
    // Tạo API call riêng không cần authentication
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"}/note/shared/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return res.json();
}