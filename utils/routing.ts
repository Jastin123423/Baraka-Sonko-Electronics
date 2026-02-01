
export const slugify = (text: string | undefined | null) => {
  if (!text) return 'item';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};

export const getProductUrl = (category: string | undefined | null, title: string | undefined | null, id: string) => {
  const catSlug = slugify(category || 'electronics');
  const titleSlug = slugify(title || 'product');
  return `/${catSlug}/${titleSlug}--${id}`;
};

export const getCategoryUrl = (categoryName: string | undefined | null) => {
  return `/category/${slugify(categoryName || 'all')}`;
};
