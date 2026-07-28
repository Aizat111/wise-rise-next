import { PortableTextComponents, type PortableTextMarkComponentProps } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { ReactNode } from 'react';

import { sanityClient } from '@/core/api/sanity/sanityClient';
import Image from '@/shared/ui/Images/Image';

const builder = imageUrlBuilder(sanityClient);

const urlFor = (source: any) => {
  return builder.image(source);
};

type SanityLinkMark = { _type: 'link'; href?: string };

function isProbablyExternalHref(href: string) {
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }
  try {
    const url = new URL(href);
    return url.hostname !== 'toshi.bet' && url.hostname !== 'www.toshi.bet';
  } catch {
    return true;
  }
}

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<SanityLinkMark>) => {
      const href = value?.href?.trim();
      if (!href) {
        return <span className="text-[#c1c5d0]">{children}</span>;
      }
      const external = isProbablyExternalHref(href);
      return (
        <a
          href={href}
          className="text-sky-400 underline underline-offset-2 font-semibold hover:text-sky-300 transition-colors"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    }
  },
  block: {
    h1: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-xl font-semibold mb-2 text-white">{children}</h2>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-xl font-semibold mb-2 text-white">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => <h3 className="text-base mb-2 text-white">{children}</h3>,
    h4: ({ children }: { children?: ReactNode }) => <h4 className="text-base mb-2 text-white">{children}</h4>,
    normal: ({ children }: { children?: ReactNode }) => (
      <p className="text-base mb-2 font-semibold text-[#c1c5d0]">{children}</p>
    )
  },
  types: {
    image: ({ value }: { value: any }) => {
      return (
        <Image
          src={urlFor(value).url() || ''}
          className="rounded-md mb-2 object-cover max-h-[400px] w-full"
          width={800}
          height={400}
          alt="Post image"
        />
      );
    },
    table: ({ value }) => {
      const rows = value?.rows || [];

      if (!rows.length) return null;

      return (
        <div className="overflow-x-auto mb-4">
          <div className="rounded-lg overflow-hidden border-2 border-[#5b606f]">
            <table className="min-w-full">
              <tbody>
                {rows.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className="border-b border-[#5b606f]">
                    {row.cells.map((cell: any, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 text-sm text-[#c1c5d0] font-medium border-r border-[#5b606f]"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  },
  list: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <ul className="list-disc pl-4 font-semibold text-base mb-2 text-[#c1c5d0]">{children}</ul>
    ),
    number: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal pl-4 font-semibold text-base mb-2 text-[#c1c5d0]">{children}</ol>
    )
  },
  listItem: {
    bullet: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
    number: ({ children }: { children?: ReactNode }) => <li>{children}</li>
  }
};

export { portableTextComponents, urlFor };
