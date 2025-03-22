export const sortProducts = (products, sortOption) => {
  const sortedProducts = [...products]

  switch (sortOption) {
  case 'price-asc':
    return sortedProducts.sort((a, b) => a.price - b.price)
  case 'price-desc':
    return sortedProducts.sort((a, b) => b.price - a.price)
  case 'name-asc':
    return sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
  case 'name-desc':
    return sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
  case 'newest':
    return sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  case 'oldest':
    return sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  case 'best-seller':
    return sortedProducts.sort((a, b) => b.sold - a.sold)
  case 'stock-desc':
    return sortedProducts.sort((a, b) => b.stock - a.stock)
  case 'featured':
  default:
    return sortedProducts
  }
}
