export type GuestBannerAuthProps = {
  /**
   * When true the banner is not rendered.
   * Defaults to false so the banner shows for guests unless the parent says otherwise.
   */
  isAuthenticated?: boolean;
  className?: string;
};

export type GuestLearningBannerProps = GuestBannerAuthProps;

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
