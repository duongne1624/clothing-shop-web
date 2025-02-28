import { Select, MenuItem, Typography, Box } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'

const sortOptions = [
  { label: 'Sản phẩm nổi bật', value: 'featured' },
  { label: 'Giá: Tăng dần', value: 'price-asc' },
  { label: 'Giá: Giảm dần', value: 'price-desc' },
  { label: 'Tên: A-Z', value: 'name-asc' },
  { label: 'Tên: Z-A', value: 'name-desc' },
  { label: 'Cũ nhất', value: 'oldest' },
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Bán chạy nhất', value: 'best-seller' },
  { label: 'Tồn kho: Giảm dần', value: 'stock-desc' }
]

const SortDropdown = ({ onSortChange }) => {
  const [sortOption, setSortOption] = useState('featured')

  const handleSortChange = (event) => {
    const selectedOption = event.target.value
    setSortOption(selectedOption)
    onSortChange(selectedOption)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography variant="body1" sx={{ mr: 1 }}>Sắp xếp:</Typography>
      <Select
        value={sortOption}
        onChange={handleSortChange}
        size="small"
        sx={{ minWidth: 180 }}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

SortDropdown.propTypes = {
  onSortChange: PropTypes.func.isRequired
}

export default SortDropdown
