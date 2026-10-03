import type { Metadata } from "next";
import { SITE } from "./site";
import { absoluteUrl } from "./paths";
import {
  siteImages,
  getExcursionImage,
  getHotelImage,
  getTransferImage,
  getHighlightImage,
  getGuideImage,
  getComparisonImage,
} from "./images";

/** Next.js replaces a parent's openGraph wholesale, so pages that set openGraph must spread this in. */
export const defaultOpenGraph = {
  images: [{ url: siteImages.ogDefault.src, width: 1200, height: 630, alt: siteImages.ogDefault.alt }],
};

export interface PageSEO {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
}

export function fullTitle(title: string, path: string): string {
  return path === "/" ? title : `${title} | ${SITE.name}`;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  imageAlt,
  noindex = false,
}: PageSEO): Metadata {
  const url = absoluteUrl(SITE.url, path);
  const ogTitle = fullTitle(title, path);
  const ogImage = image ?? siteImages.ogDefault.src;
  const ogImageAlt = imageAlt ?? siteImages.ogDefault.alt;

  return {
    title: path === "/" ? { absolute: ogTitle } : title,
    description,
    keywords: [
      "Livorno shore excursions",
      "Florence from Livorno",
      "Cinque Terre shore excursions",
      "Pisa from Livorno",
      "Tuscany cruise port",
      "Livorno cruise excursions",
      ...keywords,
    ],
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: ogTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export function excursionPageMetadata(slug: string, title: string, description: string) {
  const image = getExcursionImage(slug);
  return buildMetadata({
    title,
    description,
    path: `/shore-excursions/${slug}`,
    image: image?.src,
    imageAlt: image?.alt,
  });
}

export function hotelPageMetadata(slug: string, title: string, description: string) {
  const image = getHotelImage(slug);
  return buildMetadata({
    title,
    description,
    path: `/hotels/${slug}`,
    image: image?.src,
    imageAlt: image?.alt,
  });
}

export function transferPageMetadata(slug: string, title: string, description: string) {
  const image = getTransferImage(slug);
  return buildMetadata({
    title,
    description,
    path: `/cruise-transfers/${slug}`,
    image: image?.src,
    imageAlt: image?.alt,
  });
}

export function highlightPageMetadata(slug: string, title: string, description: string) {
  const image = getHighlightImage(slug);
  return buildMetadata({
    title,
    description,
    path: `/guides/${slug}`,
    image: image?.src,
    imageAlt: image?.alt,
  });
}

export function guidePageMetadata(hubPath: string, slug: string, title: string, description: string, imageKey: string) {
  const image = getGuideImage(imageKey);
  return buildMetadata({
    title,
    description,
    path: `${hubPath}/${slug}`,
    image: image?.src,
    imageAlt: image?.alt,
  });
}

export function comparisonPageMetadata(slug: string, title: string, description: string) {
  const image = getComparisonImage(slug);
  return buildMetadata({
    title,
    description,
    path: `/compare/${slug}`,
    image: image?.src,
    imageAlt: image?.alt,
  });
}

/** @deprecated use highlightPageMetadata */
export function attractionPageMetadata(slug: string, title: string, description: string) {
  return highlightPageMetadata(slug, title, description);
}
