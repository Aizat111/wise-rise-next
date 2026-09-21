import type { MembershipPlan } from "@/core/types/plan.types";

export type GuestBannerAuthProps = {
  /**
   * When true the banner is not rendered.
   * Defaults to false so the banner shows for guests unless the parent says otherwise.
   */
  isAuthenticated?: boolean;
  className?: string;
};

export type GuestLearningBannerProps = GuestBannerAuthProps;

export type MembershipHeroBannerProps = {
  monthlyPlan: MembershipPlan | null;
  yearlyPlan: MembershipPlan | null;
  className?: string;
};

export type BusinessBannerProps = GuestBannerAuthProps;

export type CyclingPlanPeriod = "Monthly" | "Yearly";
export type TeacherShowcaseImageProps = {
  firstImage: string;
  secondImage: string;
  className?: string;
};

export type TeacherShowcaseCardProps = {
  className?: string;
};
