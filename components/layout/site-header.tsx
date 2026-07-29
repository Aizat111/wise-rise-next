"use client";

import type { Category } from "@/core/api/types";

import { Header } from "@/features/header/components/Header";

type SiteHeaderProps = {
  categories: Category[];
};

export function SiteHeader({ categories }: SiteHeaderProps) {
  return <Header categories={categories} />;
}
