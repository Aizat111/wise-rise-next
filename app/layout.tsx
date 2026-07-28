type Props = Readonly<{
  children: React.ReactNode;
}>;

/**
 * Root layout is a passthrough — html/body live in `app/[locale]/layout.tsx`
 * so `lang` can follow the active locale (tr | az).
 */
export default function RootLayout({ children }: Props) {
  return children;
}
