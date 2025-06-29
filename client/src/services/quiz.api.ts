import api from "@/lib/api";    

export const getQuizById = async (id: string) => {
    const res = await api.get(`/quiz/${id}`);
    return res.data;
}