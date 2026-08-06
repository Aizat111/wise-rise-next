export type VideoNote = {
  id: string;
  content: string;
  duration: string;
  video_id: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CreateVideoNoteRequest = {
  content: string;
  duration: string;
  video_id: string;
};

export type VideoNotesListParams = {
  videoId: string;
  page?: number;
  pageSize?: number;
};

export type VideoNotesPaginatedResponse = {
  data: VideoNote[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
};
