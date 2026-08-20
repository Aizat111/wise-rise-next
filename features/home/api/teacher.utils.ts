import type { Teacher } from "@/core/types/teacher.types";
import type { TeacherCardData } from "@/shared/ui/cards";

export function mapTeacherToCard(teacher: Teacher): TeacherCardData {
  return {
    id: teacher.id,
    name: teacher.name,
    photo: teacher.photo?.path ?? "",
    categoryName: teacher.categories?.[0]?.name ?? "",
    description: teacher.description ?? "",
    isFavorite: teacher.is_favorite ?? false,
  };
}

/** Drop teachers that cannot render a usable TeacherCard photo. */
export function mapTeachersToCards(teachers: Teacher[]): TeacherCardData[] {
  return teachers
    .map(mapTeacherToCard)
    .filter((card) => Boolean(card.photo));
}
