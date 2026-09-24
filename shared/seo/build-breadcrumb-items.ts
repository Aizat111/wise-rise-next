import { getTranslations } from "next-intl/server";

import type { Category } from "@/core/api/types";
import { locales } from "@/core/config/domain-locale.config";
import {
  getFreeCampaignPublicRoutes,
  isFreeCampaignType,
  parseFreeCampaignPathname,
} from "@/features/auth/lib/free-campaign";
import {
  WE_THE_LIVING_LABEL,
  WE_THE_LIVING_SLUG,
} from "@/features/category/constants";
import { courseService } from "@/features/course/api/course.service";
import {
  findCourseVideoBySlug,
  mapClassroomVideos,
} from "@/features/course/api/course.utils";
import { TEACHERS_ROUTE } from "@/features/teachers/constants";

import type { BreadcrumbItem } from "./schemas/BreadcrumbSchema";
import { localizedPath } from "./site-url";

/** Unlocalized path → next-intl key. Covers static routes in every template. */
const PATH_LABEL_KEYS: Record<string, string> = {
  "/business": "business.title",
  "/kategoriler": "categories.title",
  "/egitmenler": "teachersPage.title",
  "/eğitmenler": "teachersPage.title",
  "/yakinda-gelecekler": "comingSoonPage.title",
  "/uyelik-planlari": "pracingPlan.title",
  "/hediye-et": "giveGift.metaTitle",
  "/hediye-kullan": "useGift.title",
  "/hediye-kuponu": "useGift.title",
  "/hediye-kullan/sifre": "useGift.passwordTitle",
  "/hediye-kullan/kayit": "useGift.register",
  "/hakkimizda": "information.pages.about",
  "/iletisim": "information.pages.contact",
  "/sikca-sorulan-sorular": "footer.frequentlyAskedQuestions",
  "/sss": "information.pages.faq",
  "/gizlilik-politikasi": "information.pages.privacyPolicy",
  "/kullanim-kosullari": "information.pages.termsOfUse",
  "/uyelik-sozlesmesi": "information.pages.userAgreement",
  "/mesafeli-satis-sozlesmesi": "information.pages.distanceSales",
  "/on-bilgilendirme-formu": "information.pages.preInfo",
  "/ticari-elektronik-ileti-onay-metni": "commercialElectronicMessage.title",
  "/giris": "login.title",
  "/kayit": "auth.register",
  "/kayit/bilgiler": "register.step1.title",
  "/kayit-ol": "auth.register",
  "/kayit-ol/sifre-olustur": "register.step2.title",
  "/kayit-ol/plan-sec": "register.step3.title",
  "/kayit-ol/odeme": "register.step4.title",
  "/sifremi-unuttum": "forgotPassword.title",
  "/profil-ekle": "profile.addProfile",
  "/profil-sec": "profile.whoIsWatching",
  "/survey": "survey.title",
  "/hedefini-belirle": "goalSelection.title",
  "/uyelik-yenile": "subscription.renewTitle",
  "/uyelik-yenile/odeme": "subscription.payment",
  "/aktivitelerim": "activitiesPage.title",
  "/takip-ettiklerim": "followingPage.title",
  "/ara": "searchPage.title",
};

const STEP_LABEL_KEYS: Record<string, string> = {
  "sifre-olustur": "register.step2.title",
  "plan-sec": "register.step3.title",
  odeme: "register.step4.title",
};

const STATIC_FIRST_SEGMENTS = new Set(
  Object.keys(PATH_LABEL_KEYS)
    .map((path) => path.split("/").filter(Boolean)[0])
    .filter((segment): segment is string => Boolean(segment)),
);

const LOCALE_PREFIXES = new Set<string>(locales);

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment).normalize("NFC");
  } catch {
    return segment.normalize("NFC");
  }
}

function humanizeSlug(slug: string) {
  const words = decodeSegment(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!words) return slug;
  return words.replace(/(^|\s)(\S)/g, (match) => match.toLocaleUpperCase("tr"));
}

/** Drop a locale prefix so breadcrumb labels follow the app path, not `/az`. */
export function toUnlocalizedPath(pathname: string) {
  const withoutQuery = (pathname.split("?")[0] || "/").split("#")[0] || "/";
  const normalized = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
  const trimmed = normalized.replace(/\/+$/, "") || "/";
  const [first, ...rest] = trimmed.split("/").filter(Boolean);

  if (first && LOCALE_PREFIXES.has(first)) {
    return rest.length > 0 ? `/${rest.join("/")}` : "/";
  }

  return trimmed;
}

export function isHomePath(pathname: string) {
  return toUnlocalizedPath(pathname) === "/";
}

/** ASCII `/egitmenler` and Unicode `/eğitmenler` share one canonical URL. */
function canonicalAppPath(path: string) {
  if (path === "/egitmenler" || path === "/eğitmenler") return TEACHERS_ROUTE;
  return path;
}

function isCouponSegment(parentPath: string, segment: string) {
  if (PATH_LABEL_KEYS[`${parentPath}/${segment}`]) return false;
  return parentPath === "/kayit-ol" || parentPath === "/kayit-ol/sifre-olustur";
}

type Translator = Awaited<ReturnType<typeof getTranslations>>;

function campaignCrumbs(
  pathname: string,
  locale: string,
  t: Translator,
): BreadcrumbItem[] | null {
  const parsed = parseFreeCampaignPathname(pathname);
  const internal = pathname.match(
    /^\/kampanya\/(freemonth|freeyear)(?:\/(sifre-olustur|plan-sec|odeme))?\/?$/,
  );

  const campaignType = parsed?.campaignType ?? internal?.[1];
  const stepSegment = parsed?.stepSegment ?? internal?.[2];
  if (!campaignType || !isFreeCampaignType(campaignType)) return null;

  const routes = getFreeCampaignPublicRoutes(campaignType, parsed?.companyName);
  const campaignName =
    campaignType === "freemonth"
      ? t("register.freeCampaign.oneMonthFree")
      : t("register.freeCampaign.oneYearFree");

  const items: BreadcrumbItem[] = [
    { name: campaignName, path: localizedPath(locale, routes[1]) },
  ];

  if (stepSegment && STEP_LABEL_KEYS[stepSegment]) {
    const step =
      stepSegment === "sifre-olustur" ? 2 : stepSegment === "plan-sec" ? 3 : 4;
    items.push({
      name: t(STEP_LABEL_KEYS[stepSegment]),
      path: localizedPath(locale, routes[step]),
    });
  }

  return items;
}

async function courseCrumbs(
  segments: string[],
  locale: string,
  t: Translator,
): Promise<BreadcrumbItem[] | null> {
  const [teacherSlug, courseSlug, videoSlug] = segments;
  if (!teacherSlug || !courseSlug) return null;

  const course = await courseService.getBySlugServer(courseSlug);
  if (!course) return null;

  const items: BreadcrumbItem[] = [];

  if (course.category?.slug && course.category.name) {
    items.push({
      name: course.category.name,
      path: localizedPath(locale, `/${course.category.slug}`),
    });
  }

  const teacherName = course.teacher?.name?.trim();
  items.push({
    name: teacherName
      ? t("course.breadcrumbWithTeacher", {
          teacher: teacherName,
          course: course.name,
        })
      : course.name,
    path: localizedPath(locale, `/${teacherSlug}/${courseSlug}`),
  });

  if (videoSlug) {
    const video = findCourseVideoBySlug(
      mapClassroomVideos(course.videos),
      videoSlug,
    );
    items.push({
      name: video?.name || humanizeSlug(videoSlug),
      path: localizedPath(locale, `/${teacherSlug}/${courseSlug}/${videoSlug}`),
    });
  }

  return items;
}

function categoryCrumb(
  slug: string,
  categories: Category[],
  locale: string,
): BreadcrumbItem {
  if (slug === WE_THE_LIVING_SLUG) {
    return {
      name: WE_THE_LIVING_LABEL,
      path: localizedPath(locale, `/${slug}`),
    };
  }

  const category = categories.find((item) => item.slug === slug);
  return {
    name: category?.name || humanizeSlug(slug),
    path: localizedPath(locale, `/${slug}`),
  };
}

function staticCrumbs(
  path: string,
  locale: string,
  t: Translator,
): BreadcrumbItem[] {
  const segments = path.split("/").filter(Boolean).map(decodeSegment);
  const items: BreadcrumbItem[] = [];
  let accumulated = "";

  for (const segment of segments) {
    const parent = accumulated || "/";
    accumulated += `/${segment}`;

    const labelKey = PATH_LABEL_KEYS[accumulated];
    if (labelKey) {
      items.push({
        name: t(labelKey),
        path: localizedPath(locale, canonicalAppPath(accumulated)),
      });
      continue;
    }

    if (isCouponSegment(parent === "/" ? "" : parent, segment)) {
      const current = items[items.length - 1];
      if (current) current.path = localizedPath(locale, accumulated);
      continue;
    }

    items.push({
      name: humanizeSlug(segment),
      path: localizedPath(locale, accumulated),
    });
  }

  return items;
}

export async function buildBreadcrumbItems({
  pathname,
  locale,
  categories,
}: {
  pathname: string;
  locale: string;
  categories: Category[];
}): Promise<BreadcrumbItem[]> {
  const path = toUnlocalizedPath(pathname);
  if (path === "/") return [];

  const t = await getTranslations({ locale });
  const home: BreadcrumbItem = {
    name: t("information.home"),
    path: localizedPath(locale, "/"),
  };

  const campaign =
    campaignCrumbs(pathname, locale, t) ?? campaignCrumbs(path, locale, t);
  if (campaign) return [home, ...campaign];

  const segments = path.split("/").filter(Boolean).map(decodeSegment);
  const first = segments[0];

  if (first && !STATIC_FIRST_SEGMENTS.has(first) && segments.length >= 2) {
    const course = await courseCrumbs(segments, locale, t);
    if (course) return [home, ...course];
  }

  if (first && !STATIC_FIRST_SEGMENTS.has(first) && segments.length === 1) {
    return [home, categoryCrumb(first, categories, locale)];
  }

  return [home, ...staticCrumbs(path, locale, t)];
}
