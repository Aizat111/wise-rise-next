"use client";

import Image from "@/shared/ui/Images/Image";
import { cn } from "@/lib/utils";
import type { TeacherShowcaseCardProps } from "./types";
import { TeacherShowcaseImage } from "./TeachersShowCaseImage";
import { TeacherShowcaseText } from "./TeacherShowcaseText";
import { firstTeacherImage, secondTeacherImage } from "./constants";

export function TeacherShowcaseCard({
    className,
}: TeacherShowcaseCardProps) {
    return (
        <div
            className={cn(
                "relative flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden",
                className,
            )}
        >
            <TeacherShowcaseImage
                firstImage={firstTeacherImage}
                secondImage={secondTeacherImage}
                className={className}
            />
            <TeacherShowcaseText />
        </div>
    );
}