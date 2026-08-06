import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  CreateVideoNoteRequest,
  VideoNote,
  VideoNotesListParams,
  VideoNotesPaginatedResponse,
} from "@/core/types/notes.types";

type NotesListResponse = VideoNote[] | VideoNotesPaginatedResponse;

function normalizeNotes(response: NotesListResponse): VideoNote[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

function unwrapCreatedNote(
  response: VideoNote | { data: VideoNote },
): VideoNote {
  if (response && "data" in response && response.data) {
    return response.data;
  }
  return response as VideoNote;
}

export const notesService = {
  async listByVideo({
    videoId,
    page = 0,
    pageSize = 12,
  }: VideoNotesListParams): Promise<VideoNote[]> {
    const response = await clientRequest<NotesListResponse>({
      url: ENDPOINTS.notes.list,
      method: "GET",
      params: {
        video_id: videoId,
        "page[number]": page,
        "page[size]": pageSize,
      },
    });

    return normalizeNotes(response);
  },

  async create(payload: CreateVideoNoteRequest): Promise<VideoNote> {
    const response = await clientRequest<VideoNote | { data: VideoNote }>({
      url: ENDPOINTS.notes.create,
      method: "POST",
      data: payload,
    });

    return unwrapCreatedNote(response);
  },
};
