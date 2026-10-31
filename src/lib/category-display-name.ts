// The label shown for a Category Slug where only the Slug is in hand (a Recipe card, a breadcrumb) and
// the database-sourced Category set isn't threaded through. Mirrors tagDisplayName(); same caveat as
// a Tag's stored name applies in reverse here — "snacks-and-sides" renders "Snacks And Sides", not the
// stored "Snacks & sides", a gap only the Category tile grid and Category page close because they
// render from a fetched CategoryWithCount rather than from a bare Slug.
export function categoryDisplayName(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
