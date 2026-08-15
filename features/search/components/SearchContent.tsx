"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { usePathname, useRouter } from "@/core/i18n/navigation";
import { useDebounce } from "@/shared/hooks/useDebounce";

import { SEARCH_DEBOUNCE_MS, SEARCH_QUERY_PARAM } from "../constants";
import type { SearchContentProps } from "../types";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { SearchShell } from "./SearchShell";

export function SearchContent({ title, subtitle }: SearchContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlQuery = (searchParams.get(SEARCH_QUERY_PARAM) ?? "").trim();
  const [inputValue, setInputValue] = useState(urlQuery);
  const debouncedValue = useDebounce(inputValue.trim(), SEARCH_DEBOUNCE_MS);

  const replaceQuery = useCallback(
    (term: string) => {
      const next = term.trim();
      const current = (searchParams.get(SEARCH_QUERY_PARAM) ?? "").trim();
      if (next === current) return;

      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set(SEARCH_QUERY_PARAM, next);
      } else {
        params.delete(SEARCH_QUERY_PARAM);
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (debouncedValue !== inputValue.trim()) return;
    replaceQuery(debouncedValue);
  }, [debouncedValue, inputValue, replaceQuery]);

  useEffect(() => {
    setInputValue((current) => (current.trim() === urlQuery ? current : urlQuery));
  }, [urlQuery]);

  return (
    <SearchShell
      title={title}
      subtitle={subtitle}
      overlay={
        <SearchInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={() => replaceQuery(inputValue)}
        />
      }
    >
      <SearchResults query={urlQuery} />
    </SearchShell>
  );
}
