import type { ReactNode } from "react";

import {
  CertificateCardSkeleton,
  EducationProgressCardSkeleton,
  NoteCardSkeleton,
  TeacherSkeleton,
} from "@/shared/ui/cards";
import {
  CERTIFICATE_SLIDER_ITEM_WIDTH_CLASS,
  TEACHER_SLIDER_ITEM_WIDTH_CLASS,
} from "@/shared/ui/sliders";

import { ACTIVITIES_SECTIONS_CLASS } from "../constants";
import type { ActivitiesFallbackProps } from "../types";

const EDUCATION_SKELETON_COUNT = 4;

function SliderSkeletonRow({
  title,
  loadingLabel,
  count,
  itemClassName,
  children,
}: {
  title: string;
  loadingLabel?: string;
  count: number;
  itemClassName?: string;
  children: (index: number) => ReactNode;
}) {
  return (
    <section aria-label={title} aria-busy>
      <h2 className="mb-3 truncate border-l-5 border-primary pl-2 text-base font-semibold tracking-tight text-white sm:mb-4 sm:text-3xl">
        {title}
      </h2>
      <div
        className="flex gap-3 overflow-hidden"
        aria-label={loadingLabel}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`${title}-skeleton-${index}`}
            className={
              itemClassName ??
              "w-[calc((100%-0.75rem)/2)] shrink-0 md:w-[calc((100%-2.25rem)/4)]"
            }
          >
            {children(index)}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ActivitiesFallback({
  watchingTitle,
  watchedTitle,
  assignedTitle,
  notesTitle,
  teachersTitle,
  certificatesTitle,
  loadingLabel,
}: ActivitiesFallbackProps) {
  return (
    <div className={ACTIVITIES_SECTIONS_CLASS}>
      <SliderSkeletonRow
        title={watchingTitle}
        loadingLabel={loadingLabel}
        count={EDUCATION_SKELETON_COUNT}
      >
        {() => <EducationProgressCardSkeleton />}
      </SliderSkeletonRow>
      <SliderSkeletonRow
        title={watchedTitle}
        loadingLabel={loadingLabel}
        count={EDUCATION_SKELETON_COUNT}
      >
        {() => <EducationProgressCardSkeleton />}
      </SliderSkeletonRow>
      <SliderSkeletonRow
        title={assignedTitle}
        loadingLabel={loadingLabel}
        count={EDUCATION_SKELETON_COUNT}
      >
        {() => <EducationProgressCardSkeleton />}
      </SliderSkeletonRow>
      <SliderSkeletonRow
        title={notesTitle}
        loadingLabel={loadingLabel}
        count={EDUCATION_SKELETON_COUNT}
      >
        {() => <NoteCardSkeleton />}
      </SliderSkeletonRow>
      <SliderSkeletonRow
        title={teachersTitle}
        loadingLabel={loadingLabel}
        count={5}
        itemClassName={`shrink-0 ${TEACHER_SLIDER_ITEM_WIDTH_CLASS}`}
      >
        {() => <TeacherSkeleton />}
      </SliderSkeletonRow>
      <SliderSkeletonRow
        title={certificatesTitle}
        loadingLabel={loadingLabel}
        count={5}
        itemClassName={`shrink-0 ${CERTIFICATE_SLIDER_ITEM_WIDTH_CLASS}`}
      >
        {() => <CertificateCardSkeleton />}
      </SliderSkeletonRow>
    </div>
  );
}
