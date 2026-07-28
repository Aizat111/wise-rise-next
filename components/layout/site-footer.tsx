"use client";

import Image from "@/shared/ui/Images/Image";
import { Link } from "@/core/i18n/navigation";
import type { Category } from "@/core/api/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type FooterLink = {
  href: string;
  label: string;
};

const exploreLinks: FooterLink[] = [
  { href: "/hakkimizda", label: "footer.aboutUs" },
  { href: "/iletisim", label: "footer.contact" },
  { href: "/live", label: "footer.live" },
];

const corporateLinks: FooterLink[] = [
  { href: "/sss", label: "footer.frequentlyAskedQuestions" },
  { href: "/yardim", label: "footer.helpCenter" },
  { href: "/abonelik-sartlari", label: "footer.subscriptionTerms" },
  { href: "/gizlilik-politikasi", label: "footer.privacyPolicy" },
];

const giftLinks: FooterLink[] = [
  { href: "/hediye-kuponu", label: "footer.giftCoupon" },
  { href: "/hediye-et", label: "footer.giveGift" },
];

const legalLinks: FooterLink[] = [
  { href: "/gizlilik-politikasi", label: "footer.privacyPolicy" },
  { href: "/sartlar-ve-kosullar", label: "footer.termsOfService" },
];

function FooterColumn({
  title,
  links,
  translate = true,
}: {
  title: string;
  links: FooterLink[];
  translate?: boolean;
}) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold tracking-wide text-foreground mb-10">
        {t(title)}
      </h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-base  transition-colors duration-1000 text-foreground/80 hover:text-primary font-medium"
            >
              {translate ? t(link.label) : link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0", className)}>
      <Image
        src="/logo/wise&rise.png"
        alt="Wise & Rise"
        width={160}
        height={42}
        className="h-8 w-auto object-contain sm:h-9"
        priority
      />
    </Link>
  );
}

function LegalRow({ className }: { className?: string }) {
  const t = useTranslations();
  return (
    <div className={cn("flex items-center gap-4 sm:gap-6", className)}>
      {legalLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-foreground/80  hover:text-primary transition-all duration-1000 sm:text-base font-medium"
        >
          {t(link.label)}
        </Link>
      ))}
    </div>
  );
}

type SiteFooterProps = {
  categories: Category[];
};

export function SiteFooter({ categories }: SiteFooterProps) {
  const categoryLinks: FooterLink[] = categories.map((category) => ({
    href: `/kategoriler/${category.slug}`,
    label: category.name,
  }));

  return (
    <footer className="mt-auto  bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Desktop: 4 columns */}
        <div className="mb-10 hidden gap-8 md:grid md:grid-cols-4 lg:gap-12">
          <FooterColumn title="footer.discover" links={exploreLinks} />
          <FooterColumn title="footer.corporate" links={corporateLinks} />
          <FooterColumn
            title="footer.allCategories"
            links={categoryLinks}
            translate={false}
          />
          <FooterColumn title="footer.gift" links={giftLinks} />
        </div>

        {/* Desktop bottom bar */}
        <div className="hidden items-center justify-between  pt-8 md:flex">
          <BrandLogo />
          <LegalRow />
        </div>

        {/* Mobile: logo centered + legal side by side */}
        <div className="flex flex-col items-center gap-5 md:hidden">
          <BrandLogo />
          <LegalRow className="justify-center" />
        </div>
      </div>
    </footer>
  );
}
