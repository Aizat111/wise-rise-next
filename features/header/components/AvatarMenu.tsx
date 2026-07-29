"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  name: string;
  src?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function ProfileAvatar({
  name,
  src,
  size = "default",
  className,
}: ProfileAvatarProps) {
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <Avatar size={size} className={cn(className)}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  );
}
