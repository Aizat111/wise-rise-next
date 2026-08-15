"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/core/i18n/navigation";
import { LoginRequiredDialog } from "@/features/course/components/LoginRequiredDialog";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

import {
  useLikeClassroomMutation,
  useLikeTeacherMutation,
} from "../api/like.mutations";
import { FAVORITE_BUTTON_CLASS, PROFILE_SELECT_HREF } from "../constants";
import type { FavoriteButtonProps, LikeEntityType } from "../types";

function stopCardNavigation(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  event.stopPropagation();
}

function stopCardPropagation(
  event: PointerEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
) {
  event.stopPropagation();
}

function useLikeMutation(type: LikeEntityType) {
  const classroomMutation = useLikeClassroomMutation();
  const teacherMutation = useLikeTeacherMutation();
  return type === "classroom" ? classroomMutation : teacherMutation;
}

export function FavoriteButton({
  type,
  entityId,
  initialLiked = false,
  className,
  iconClassName,
}: FavoriteButtonProps) {
  const t = useTranslations("likes");
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const activeProfile = useAppSelector((state) => state.profile.activeProfile);
  const likeMutation = useLikeMutation(type);

  const [loginOpen, setLoginOpen] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);

  const liked = optimisticLiked ?? initialLiked;
  const isPending = likeMutation.isPending;

  useEffect(() => {
    setOptimisticLiked(null);
  }, [entityId]);

  useEffect(() => {
    if (optimisticLiked !== null && initialLiked === optimisticLiked) {
      setOptimisticLiked(null);
    }
  }, [initialLiked, optimisticLiked]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    stopCardNavigation(event);
    if (isPending) return;

    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    const profileId = activeProfile?.id;
    if (profileId == null) {
      router.push(PROFILE_SELECT_HREF);
      return;
    }

    const nextLiked = !liked;
    setOptimisticLiked(nextLiked);

    likeMutation.mutate(
      {
        profileId,
        entityId,
        nextLiked,
      },
      {
        onError: () => {
          setOptimisticLiked(null);
        },
      },
    );
  };

  return (
    <>
      <Button
        type="button"
        disabled={isPending}
        aria-busy={isPending}
        aria-pressed={liked}
        aria-label={liked ? t("removeFromFavorites") : t("addToFavorites")}
        onClick={handleClick}
        onPointerDown={stopCardPropagation}
        onKeyDown={stopCardPropagation}
        className={cn(FAVORITE_BUTTON_CLASS, className)}
      >
        <motion.span
          key={liked ? "on" : "off"}
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="inline-flex"
        >
          <Heart
            className={cn(
              "size-6 transition-colors duration-200",
              liked ? "fill-primary text-primary" : "fill-none text-white",
              iconClassName,
            )}
            strokeWidth={2}
          />
        </motion.span>
      </Button>

      <LoginRequiredDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
