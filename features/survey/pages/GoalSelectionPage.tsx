"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/core/i18n/navigation";
import { getAuthErrorMessage } from "@/features/auth/api/auth.mutations";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import {
  useProfileQuery,
  useProfilesQuery,
} from "@/features/profile/api/profile.queries";
import { PROFILE_SELECT_HREF } from "@/features/profile/constants";
import { getProfileDestination } from "@/features/profile/utils/get-profile-destination";
import { notify } from "@/shared/components/notify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveProfile } from "@/store/slices/profileSlice";

import { useSubmitSurveyMutation } from "../api/survey.mutations";
import { useSurveyQuery } from "../api/survey.queries";
import {
  SURVEY_CONTAINER_CLASS,
  SURVEY_LOGIN_HREF,
  SURVEY_TOTAL_STEPS,
} from "../constants";
import { useIsClient } from "../hooks/useIsClient";
import {
  mergeSurveyStatus,
  resolveProfileAfterSurvey,
  syncCompletedProfileQueries,
} from "../utils/sync-profile-after-survey";
import { SurveyProgress } from "../components/SurveyProgress";
import { SurveyStep } from "../components/SurveyStep";

export default function GoalSelectionPage() {
  const t = useTranslations("goalSelection");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const reduceMotion = useReducedMotion();
  const mounted = useIsClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const activeProfile = useAppSelector((state) => state.profile.activeProfile);

  const profilesQuery = useProfilesQuery(mounted && isAuthenticated);
  const submitSurvey = useSubmitSurveyMutation();

  const listedProfile = useMemo(() => {
    if (!activeProfile) return null;
    const fromList = profilesQuery.data?.find(
      (profile) => String(profile.id) === String(activeProfile.id),
    );
    if (!fromList) return activeProfile;
    return {
      ...fromList,
      ...activeProfile,
      is_survey_completed: mergeSurveyStatus(activeProfile.is_survey_completed, fromList.is_survey_completed),
    };
  }, [activeProfile, profilesQuery.data]);

  const needsProfileDetail =
    mounted &&
    isAuthenticated &&
    listedProfile != null &&
    !profilesQuery.isLoading &&
    listedProfile.is_survey_completed !== true &&
    listedProfile.is_survey_completed !== false;

  const profileDetailQuery = useProfileQuery(
    listedProfile?.id,
    needsProfileDetail,
  );

  const freshProfile = useMemo(() => {
    if (!listedProfile) return null;
    if (profileDetailQuery.data) {
      return {
        ...listedProfile,
        ...profileDetailQuery.data,
        is_survey_completed: mergeSurveyStatus(
          listedProfile.is_survey_completed,
          profileDetailQuery.data.is_survey_completed,
        ),
      };
    }
    return listedProfile;
  }, [listedProfile, profileDetailQuery.data]);

  const surveyQuery = useSurveyQuery(
    step,
    mounted &&
    isAuthenticated &&
    Boolean(freshProfile) &&
    freshProfile?.is_survey_completed === false,
  );

  useEffect(() => {
    if (!freshProfile || !activeProfile) return;
    if (String(freshProfile.id) !== String(activeProfile.id)) {
      dispatch(setActiveProfile(freshProfile));
      return;
    }
    if (freshProfile.is_survey_completed === activeProfile.is_survey_completed) return;
    if (activeProfile.is_survey_completed === true && freshProfile.is_survey_completed !== true) {
      return;
    }
    dispatch(setActiveProfile(freshProfile));
  }, [activeProfile, dispatch, freshProfile]);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.replace(SURVEY_LOGIN_HREF);
      return;
    }

    if (!activeProfile) {
      router.replace(PROFILE_SELECT_HREF);
    }
  }, [activeProfile, isAuthenticated, mounted, router]);

  useEffect(() => {
    if (!mounted) return;
    if (profilesQuery.isLoading || (needsProfileDetail && profileDetailQuery.isLoading)) {
      return;
    }
    if (!freshProfile) return;
    if (freshProfile.is_survey_completed === true) {
      router.replace(getProfileDestination(freshProfile));
    }
  }, [
    freshProfile,
    mounted,
    needsProfileDetail,
    profileDetailQuery.isLoading,
    profilesQuery.isLoading,
    router,
  ]);

  const toggleOption = (id: string | number) => {
    const allowMultiple = surveyQuery.data?.allowMultiple ?? true;

    setSelectedIds((current) => {
      const isSelected = current.some((item) => String(item) === String(id));

      if (!allowMultiple) {
        return isSelected ? [] : [id];
      }

      if (isSelected) {
        return current.filter((item) => String(item) !== String(id));
      }

      return [...current, id];
    });
  };

  const handleSubmit = async () => {
    if (!freshProfile || selectedIds.length === 0 || submitSurvey.isPending) {
      return;
    }

    try {
      const response = await submitSurvey.mutateAsync({
        profileId: freshProfile.id,
        surveyId: step,
        answers: selectedIds.map((id) => ({ id })),
      });

      if (step === 1) {
        setSelectedIds([]);
        setStep(2);
        return;
      }

      const updatedProfile = await resolveProfileAfterSurvey(
        response,
        freshProfile.id,
        freshProfile,
      );
      dispatch(setActiveProfile(updatedProfile));
      syncCompletedProfileQueries(queryClient, updatedProfile);
      router.replace(getProfileDestination(updatedProfile));
    } catch (error) {
      notify.error(getAuthErrorMessage(error, t("error")));
    }
  };

  const isProfileLoading =
    !mounted ||
    (isAuthenticated &&
      Boolean(activeProfile) &&
      (profilesQuery.isLoading ||
        (needsProfileDetail && profileDetailQuery.isLoading)));

  if (isProfileLoading) {
    return (
      <AuthLayout solid>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </AuthLayout>
    );
  }

  if (!isAuthenticated || !activeProfile || freshProfile?.is_survey_completed === true) {
    return (
      <AuthLayout solid>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </AuthLayout>
    );
  }

  if (!freshProfile || freshProfile.is_survey_completed !== false) {
    return (
      <AuthLayout solid>
        <div className={SURVEY_CONTAINER_CLASS}>
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-4 py-20 text-center"
          >
            <p className="text-sm text-white/70">{t("error")}</p>
            <Button
              type="button"
              variant="ghost"
              nativeButton
              className="cursor-pointer text-white/90 hover:bg-white/10 hover:text-white"
              onClick={() => {
                void profilesQuery.refetch();
                if (needsProfileDetail) {
                  void profileDetailQuery.refetch();
                }
              }}
            >
              {t("retry")}
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const submitLabel = step === SURVEY_TOTAL_STEPS ? t("complete") : t("continue");

  return (
    <AuthLayout solid>
      <div className={SURVEY_CONTAINER_CLASS}>
        <div className="mb-8 flex flex-col items-center gap-4 text-center md:mb-12">
          <h1 className="max-w-3xl text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
            {surveyQuery.data?.name || t("title")}
          </h1>
          <SurveyProgress
            current={step}
            total={SURVEY_TOTAL_STEPS}
            label={t("step", { current: step, total: SURVEY_TOTAL_STEPS })}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <SurveyStep
              surveyId={step}
              survey={surveyQuery.data}
              selectedIds={selectedIds}
              isLoading={surveyQuery.isLoading}
              isError={surveyQuery.isError}
              isSubmitting={submitSurvey.isPending}
              emptyLabel={t("empty")}
              errorLabel={t("error")}
              retryLabel={t("retry")}
              submitLabel={submitLabel}
              loadingLabel={t("loading")}
              onToggle={toggleOption}
              onRetry={() => {
                void surveyQuery.refetch();
              }}
              onSubmit={() => {
                void handleSubmit();
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
