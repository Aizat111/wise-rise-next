"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type {
  CreateVideoNoteRequest,
  VideoNote,
} from "@/core/types/notes.types";

import { notesService } from "./notes.service";

export function useCreateVideoNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<VideoNote, Error, CreateVideoNoteRequest>({
    mutationFn: (payload) => notesService.create(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notes.byVideo(variables.video_id),
      });
    },
  });
}
