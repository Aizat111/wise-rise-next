"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type {
  CreateVideoNoteRequest,
  VideoNote,
} from "@/core/types/notes.types";

import { notesService } from "./notes.service";

function invalidateNotes(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes.all });
}

type NotesQuerySnapshot = [QueryKey, VideoNote[] | undefined][];

export function useCreateVideoNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<VideoNote, Error, CreateVideoNoteRequest>({
    mutationFn: (payload) => notesService.create(payload),
    onSuccess: () => {
      invalidateNotes(queryClient);
    },
  });
}

type UpdateVideoNoteVariables = {
  id: string;
  content: string;
  videoId: string;
};

export function useUpdateVideoNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    VideoNote,
    Error,
    UpdateVideoNoteVariables,
    { previous: NotesQuerySnapshot }
  >({
    mutationFn: ({ id, content }) => notesService.update(id, { content }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.notes.byVideo(variables.videoId),
      });

      const previous = queryClient.getQueriesData<VideoNote[]>({
        queryKey: QUERY_KEYS.notes.byVideo(variables.videoId),
      });

      queryClient.setQueriesData<VideoNote[]>(
        { queryKey: QUERY_KEYS.notes.byVideo(variables.videoId) },
        (current) =>
          current?.map((note) =>
            note.id === variables.id
              ? { ...note, content: variables.content }
              : note,
          ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      invalidateNotes(queryClient);
    },
  });
}

type DeleteVideoNoteVariables = {
  id: string;
  videoId: string;
};

export function useDeleteVideoNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    DeleteVideoNoteVariables,
    { previous: NotesQuerySnapshot }
  >({
    mutationFn: ({ id }) => notesService.remove(id),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.notes.byVideo(variables.videoId),
      });

      const previous = queryClient.getQueriesData<VideoNote[]>({
        queryKey: QUERY_KEYS.notes.byVideo(variables.videoId),
      });

      queryClient.setQueriesData<VideoNote[]>(
        { queryKey: QUERY_KEYS.notes.byVideo(variables.videoId) },
        (current) => current?.filter((note) => note.id !== variables.id),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      invalidateNotes(queryClient);
    },
  });
}
