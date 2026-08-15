"use client";

import Image from "@/shared/ui/Images/Image";
import { cn } from "@/lib/utils";
import type { TeacherShowcaseImageProps } from "./types";


export function TeacherShowcaseImage({
    firstImage,
    secondImage,
    className,
}: TeacherShowcaseImageProps) {
    return (
        <div
            className={cn(
                "relative flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden",
                className,
            )}
        >
            {/* Background */}
            <div
                className={cn(
                    "absolute",
                    "h-[60%] w-[50%]",
                    "min-h-[300px] min-w-[200px]",
                    "bg-[#14161a]",
                    "rounded-tl-[60px] rounded-br-[60px]",
                )}
            >
                {/* Quote */}
                <div className="absolute -top-2.5 -left-2.5 z-20 flex size-[60px] items-center justify-center rounded-full bg-primary text-center text-[70px] leading-[55px] text-white">
                    ”
                </div>
            </div>

            {/* First teacher */}
            <div className="relative z-10 mb-50 flex w-full justify-end pr-[10%]">
                <div className="relative aspect-[4/3] w-[200px] overflow-hidden rounded-xl ">
                    <Image
                        src={firstImage}
                        alt=""
                        fill
                        sizes="200px"
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Second teacher */}
            <div className="absolute bottom-[12%] left-[10%] z-10">
                <div className="relative aspect-square w-[150px] overflow-hidden rounded-[10px] sm:w-[180px] lg:w-[210px]">
                    <Image
                        src={secondImage}
                        alt=""
                        fill
                        sizes="210px"
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}