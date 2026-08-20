export type VideoNote = {
  id: string;
  content: string;
  duration: string;
  video_id: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type NoteClassroom = {
  id?: string | number;
  name?: string | null;
  slug?: string | null;
  teacher?: {
    id?: string | number;
    name?: string | null;
    slug?: string | null;
  } | null;
};

export type NoteVideo = {
  id?: string | number;
  name?: string | null;
  slug?: string | null;
  classroom?: NoteClassroom | null;
};

export type ProfileNote = VideoNote & {
  title?: string | null;
  video?: NoteVideo | null;
  classroom?: NoteClassroom | null;
  teacher?: NoteClassroom["teacher"];
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

export type ProfileNotesListParams = {
  profileId: string | number;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
};

export type VideoNotesPaginatedResponse = {
  data: VideoNote[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
};
