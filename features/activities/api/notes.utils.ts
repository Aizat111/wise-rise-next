import type { ProfileNote } from "@/core/types/notes.types";
import {
  buildCourseHref,
  buildVideoHref,
} from "@/features/course/api/course.utils";
import type { NoteCardData } from "@/shared/ui/cards";

function pickName(
  ...values: Array<string | null | undefined>
): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

export function mapProfileNoteToCard(note: ProfileNote): NoteCardData {
  const video = note.video;
  const classroom = video?.classroom ?? note.classroom;
  const teacher = classroom?.teacher ?? note.teacher;

  return {
    id: note.id,
    content: note.content,
    duration: note.duration,
    videoName: pickName(video?.name, note.title),
    classroomName: pickName(classroom?.name),
    teacherName: pickName(teacher?.name),
    href:
      buildVideoHref(teacher?.slug, classroom?.slug, video?.slug) ??
      buildCourseHref(teacher?.slug, classroom?.slug),
  };
}

export function mapProfileNotesToCards(notes: ProfileNote[]): NoteCardData[] {
  return notes
    .map(mapProfileNoteToCard)
    .filter((note) => Boolean(note.content));
}
