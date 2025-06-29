import { Quiz } from "./quiz";

export interface Note {
  id: string;
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  summarizedTranscript: SummarizedTranscript | null;
  account: string;
  transcript: Transcript | null;
  // questions: string | null;
  quiz: Quiz | null;
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
  };
}

export interface GetNotesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

type SummarizedTranscript = {
  id: string;
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
};

type Transcript = {
  id: string;
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
};
