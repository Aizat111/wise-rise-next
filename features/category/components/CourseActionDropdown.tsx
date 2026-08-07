"use client";

import { Eye, Heart, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/core/i18n/navigation";

import { useToggleFavoriteMutation } from "../api/favorite.mutations";
import type { CourseActionDropdownProps } from "../types";
import { ShareDropdown } from "./ShareDropdown";

export function CourseActionDropdown({
  courseHref,
  shareUrl,
  shareTitle,
  classroomId,
  isFavorite = false,
}: CourseActionDropdownProps) {
  const tHome = useTranslations("homepage");
  const tLessons = useTranslations("lessonsDetail");
  const tCategories = useTranslations("categories");
  const router = useRouter();
  const favoriteMutation = useToggleFavoriteMutation();

  const stopCardNavigation = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={tCategories("actions")}
            className="size-9 rounded-full bg-transparent text-white hover:bg-black/55"
            onClick={stopCardNavigation}
            onPointerDown={stopCardNavigation}
          />
        }
      >
        <MoreVertical className="size-5" aria-hidden />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-48 border-white/10 bg-zinc-900 text-white"
        onClick={stopCardNavigation}
      >
        <DropdownMenuItem
          className="cursor-pointer focus:bg-white/10 focus:text-white"
          onClick={() => {
            router.push(courseHref);
          }}
        >
          <Eye className="size-4" aria-hidden />
          {tHome("view")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer focus:bg-white/10 focus:text-white"
          disabled={favoriteMutation.isPending}
          onClick={() => {
            favoriteMutation.mutate({
              classroomId,
              nextFavorite: !isFavorite,
            });
          }}
        >
          <Heart
            className="size-4"
            aria-hidden
            fill={isFavorite ? "currentColor" : "none"}
          />
          {isFavorite
            ? tLessons("removeFromFavorites")
            : tLessons("addToFavorites")}
        </DropdownMenuItem>

        <ShareDropdown shareUrl={shareUrl} shareTitle={shareTitle} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
