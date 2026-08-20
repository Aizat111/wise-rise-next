import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  CreateVideoNoteRequest,
  ProfileNote,
  ProfileNotesListParams,
  VideoNote,
  VideoNotesListParams,
  VideoNotesPaginatedResponse,
} from "@/core/types/notes.types";

type NotesListResponse = VideoNote[] | VideoNotesPaginatedResponse;
type ProfileNotesListResponse = ProfileNote[] | VideoNotesPaginatedResponse;

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

  async listByProfile({
    profileId,
    page = 0,
    pageSize = 12,
    signal,
  }: ProfileNotesListParams): Promise<ProfileNote[]> {
    const response = await clientRequest<ProfileNotesListResponse>({
      url: ENDPOINTS.profile.notes(profileId),
      method: "GET",
      signal,
      params: {
        "page[number]": page,
        "page[size]": pageSize,
      },
    });

    return normalizeNotes(response) as ProfileNote[];
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
