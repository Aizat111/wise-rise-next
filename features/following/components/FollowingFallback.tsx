import { EducationCardSkeleton, TeacherSkeleton } from "@/shared/ui/cards";

import {
  FOLLOWING_CLASSROOMS_GRID_CLASS,
  FOLLOWING_CLASSROOMS_PAGE_SIZE,
  FOLLOWING_SECTIONS_CLASS,
  FOLLOWING_TEACHERS_GRID_CLASS,
  FOLLOWING_TEACHERS_PAGE_SIZE,
} from "../constants";
import type { FollowingFallbackProps } from "../types";

export function FollowingFallback({
  classroomsTitle,
  teachersTitle,
  loadingLabel,
}: FollowingFallbackProps) {
  return (
    <div className={FOLLOWING_SECTIONS_CLASS}>
      <section aria-label={classroomsTitle} aria-busy>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-white sm:mb-6 sm:text-xl">
          {classroomsTitle}
        </h2>
        <div
          className={FOLLOWING_CLASSROOMS_GRID_CLASS}
          aria-label={loadingLabel}
        >
          {Array.from({ length: FOLLOWING_CLASSROOMS_PAGE_SIZE }).map(
            (_, index) => (
              <div
                key={`following-classroom-skeleton-${index}`}
                className={index >= 2 ? "hidden lg:block" : undefined}
              >
                <EducationCardSkeleton />
              </div>
            ),
          )}
        </div>
      </section>

      <section aria-label={teachersTitle} aria-busy>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-white sm:mb-6 sm:text-xl">
          {teachersTitle}
        </h2>
        <div className={FOLLOWING_TEACHERS_GRID_CLASS} aria-label={loadingLabel}>
          {Array.from({ length: FOLLOWING_TEACHERS_PAGE_SIZE }).map(
            (_, index) => (
              <div
                key={`following-teacher-skeleton-${index}`}
                className={index >= 2 ? "hidden md:block" : undefined}
              >
                <TeacherSkeleton />
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
