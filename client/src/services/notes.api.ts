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