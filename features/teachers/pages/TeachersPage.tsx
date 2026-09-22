import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { TeachersContent } from "../components/TeachersContent";
import { TeachersFallback } from "../components/TeachersFallback";
import { TeachersShell } from "../components/TeachersShell";
import type { TeachersPageProps } from "../types";

export async function TeachersPage({
  initialCategories = [],
  initialTeachers = null,
  initialCategoryId = null,
  initialPage = 1,
}: TeachersPageProps) {
  const t = await getTranslations("teachersPage");

  return (
    <TeachersShell title={t("title")} homeLabel={t("home")}>
      <section aria-label={t("title")}>
        <Suspense fallback={<TeachersFallback loadingLabel={t("loading")} />}>
          <TeachersContent
            initialCategories={initialCategories}
            initialTeachers={initialTeachers}
            initialCategoryId={initialCategoryId}
            initialPage={initialPage}
          />
        </Suspense>
      </section>
    </TeachersShell>
  );
}
