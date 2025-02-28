export const sortProducts = (products, sortOption) => {
  return [...products].sort((a, b) => {
    switch (sortOption) {
    case 'price-asc':
      return a.price - b.price
    case 'price-desc':
      return b.price - a.price
    case 'name-asc':
      return a.name.localeCompare(b.name)
    case 'name-desc':
      return b.name.localeCompare(a.name)
    case 'oldest':
      return new Date(a.createdAt) - new Date(b.createdAt)
    case 'newest':
      return new Date(b.createdAt) - new Date(a.createdAt)
    case 'best-seller':
      return b.sold - a.sold
    case 'stock-desc':
      return b.stock - a.stock
    default:
      return 0
    }
  })
}
