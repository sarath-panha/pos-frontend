/**
 * Convert a display name into a URL-safe kebab-case slug.
 * e.g. "Food & Beverage" → "food-beverage"
 */
export function slugify(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")                        // decompose accented chars
        .replace(/[\u0300-\u036f]/g, "")         // strip diacritics
        .replace(/[^a-z0-9\s-]/g, "")            // remove non-alphanumeric
        .trim()
        .replace(/[\s_]+/g, "-")                 // spaces/underscores → hyphens
        .replace(/-{2,}/g, "-")                  // collapse consecutive hyphens
        .replace(/^-+|-+$/g, "");                // trim leading/trailing hyphens
}

/**
 * Ensure a base slug is unique among existing slugs.
 * If taken (and not by `excludeId`), appends -2, -3, … until unique.
 */
export function ensureUniqueSlug(
    base: string,
    existing: Array<{ id: string; slug: string }>,
    excludeId?: string
): string {
    const others = existing.filter(c => c.id !== excludeId).map(c => c.slug);
    if (!others.includes(base)) return base;
    let i = 2;
    while (others.includes(`${base}-${i}`)) i++;
    return `${base}-${i}`;
}
