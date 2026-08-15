import { useTranslations } from "next-intl";

export function TeacherShowcaseText() {
    const t = useTranslations("business")
    return (
        <div>
            <h1 className="text-base text-primary font-medium uppercase border-l-4 border-primary pl-1 mb-2">{t("courses")}</h1>
            <h2 className="text-xl font-semibold uppercase my-5 lg:text-3xl" >{t("chooseTheCategoryToDevelop")}</h2>
            <p>{t("reachThePeakWithTheBestInTurkey")}</p>
        </div>
    );
}