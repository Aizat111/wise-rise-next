"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { SearchInputProps } from "../types";

export function SearchInput({ value, onChange, onSubmit }: SearchInputProps) {
  const t = useTranslations("searchPage");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form role="search" onSubmit={handleSubmit}>
      <label htmlFor="search-query" className="sr-only">
        {t("searchLabel")}
      </label>
      <div className="relative bg-surface rounded-xl border-border p-5">
        <Input
          id="search-query"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("placeholder")}
          autoComplete="off"
          enterKeyHint="search"
          aria-label={t("searchLabel")}
          className={cn(
            "h-[var(--search-input-height)] rounded-xl border-border bg-surface px-4 text-base shadow-lg sm:px-6 sm:text-lg",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
        />
      </div>
    </form>
  );
}
