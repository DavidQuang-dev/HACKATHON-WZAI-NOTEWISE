export interface Note {
    id: string;
    name_vi: string;
    name_en: string;
    description: string;
    description_en: string;
    summarizedTranscript: string | null;
    account: string
    transcript: string | null;
    questions: string | null;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted_at: string | null;
}

export interface NotesPagination {
    data: {
        pagination: Note[];
        meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
    }
}

export interface GetNotesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}