import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultMetadata } from "@/config/seo";
import { routing } from "@/core/i18n/routing";
import Providers from "@/core/providers/Providers";
import { getCategories } from "@/features/category/api/get-categories";
import { poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import OrganizationSchema from "@/shared/seo/schemas/OrganizationSchema";
import WebsiteSchema from "@/shared/seo/WebsiteSchema";

import "../globals.css";

export const metadata = defaultMetadata;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, categories] = await Promise.all([
    getMessages(),
    getCategories(),
  ]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("h-full dark", poppins.variable)}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <OrganizationSchema />
        <WebsiteSchema />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <SiteHeader categories={categories} />
              <main className="flex flex-1 flex-col">{children}</main>
              <SiteFooter categories={categories} />
            </Providers>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
