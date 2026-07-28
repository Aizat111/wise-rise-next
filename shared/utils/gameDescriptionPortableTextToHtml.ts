import { type PortableTextComponents, escapeHTML, toHTML, uriLooksSafe } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';
import imageUrlBuilder from '@sanity/image-url';

import { sanityClient } from '@/core/api/sanity/sanityClient';

const imageBuilder = imageUrlBuilder(sanityClient);

function urlForImage(source: unknown) {
  return imageBuilder.image(source as Parameters<typeof imageBuilder.image>[0]);
}

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

const ch = (children?: string) => children ?? '';

const gameDescriptionHtmlComponents = {
  block: {
    normal: ({ children }: { children?: string }) =>
      `<p class="text-base mb-2 font-semibold text-[#c1c5d0]">${ch(children)}</p>`,
    h1: ({ children }: { children?: string }) =>
      `<h2 class="text-xl font-semibold mb-2 text-white">${ch(children)}</h2>`,
    h2: ({ children }: { children?: string }) =>
      `<h2 class="text-xl font-semibold mb-2 text-white">${ch(children)}</h2>`,
    h3: ({ children }: { children?: string }) => `<h3 class="text-base mb-2 text-white">${ch(children)}</h3>`,
    h4: ({ children }: { children?: string }) => `<h4 class="text-base mb-2 text-white">${ch(children)}</h4>`
  },
  marks: {
    link: ({ children, value }: { children?: string; value?: { href?: string } }) => {
      const inner = ch(children);
      const href = value?.href?.trim() || '';
      if (!href) {
        return `<span class="text-[#c1c5d0]">${inner}</span>`;
      }
      if (!uriLooksSafe(href)) {
        return inner;
      }
      const external = isProbablyExternalHref(href);
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHTML(href)}" class="text-sky-400 underline underline-offset-2 font-semibold hover:text-sky-300 transition-colors"${rel}>${inner}</a>`;
    }
  },
  list: {
    bullet: ({ children }: { children?: string }) =>
      `<ul class="list-disc pl-4 font-semibold text-base mb-2 text-[#c1c5d0]">${ch(children)}</ul>`,
    number: ({ children }: { children?: string }) =>
      `<ol class="list-decimal pl-4 font-semibold text-base mb-2 text-[#c1c5d0]">${ch(children)}</ol>`
  },
  listItem: {
    bullet: ({ children }: { children?: string }) => `<li>${ch(children)}</li>`,
    number: ({ children }: { children?: string }) => `<li>${ch(children)}</li>`
  },
  types: {
    image: ({ value }: { value: Record<string, unknown> }) => {
      const src = urlForImage(value).url() || '';
      if (!src) return '';
      const alt = typeof value?.alt === 'string' ? value.alt : 'Post image';
      return `<img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" class="rounded-md mb-2 object-cover max-h-[400px] w-full" width="800" height="400" loading="lazy" decoding="async" />`;
    },
    table: ({ value }: { value: { rows?: { cells: string[] }[] } }) => {
      const rows = value?.rows || [];
      if (!rows.length) return '';
      let html =
        '<div class="overflow-x-auto mb-4"><div class="rounded-lg overflow-hidden border-2 border-[#5b606f]"><table class="min-w-full"><tbody>';
      for (const row of rows) {
        html += '<tr class="border-b border-[#5b606f]">';
        for (const cell of row.cells || []) {
          html += `<td class="px-3 py-2 text-sm text-[#c1c5d0] font-medium border-r border-[#5b606f]">${escapeHTML(String(cell))}</td>`;
        }
        html += '</tr>';
      }
      html += '</tbody></table></div></div>';
      return html;
    }
  }
} as PortableTextComponents;

/**
 * Renders Portable Text to an HTML string for SSR (real tags in the document for crawlers).
 */
export function gameDescriptionBodyToHtml(body: unknown): string {
  if (body == null) return '';
  const blocks = (Array.isArray(body) ? body : [body]) as PortableTextBlock[];
  if (!blocks.length) return '';
  return toHTML(blocks, { components: gameDescriptionHtmlComponents });
}
