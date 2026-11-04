type SeoFields = {
  title?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
};

export function cmsDocumentHead(
  page: SeoFields | undefined,
  fallbackTitle: string,
  fallbackDescription = "",
) {
  const title = page?.seoTitle || page?.title || fallbackTitle;
  const description = page?.seoDescription || fallbackDescription;
  const ogTitle = page?.ogTitle || title;
  const ogDescription = page?.ogDescription || description;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(page?.seoKeywords ? [{ name: "keywords", content: page.seoKeywords }] : []),
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:type", content: "website" },
      ...(page?.ogImage ? [{ property: "og:image", content: page.ogImage }] : []),
    ],
    links: page?.canonicalUrl ? [{ rel: "canonical", href: page.canonicalUrl }] : [],
  };
}
