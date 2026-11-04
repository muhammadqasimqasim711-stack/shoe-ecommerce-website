export function CmsHtml({ html, className }: { html?: string | null; className?: string }) {
  if (!html) return null;
  const looksHtml = /<[a-z][\s\S]*>/i.test(html);
  if (!looksHtml) {
    return (
      <div className={className} style={{ whiteSpace: "pre-wrap" }}>
        {html}
      </div>
    );
  }
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
