import { useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { ProductView, GridView, ListView } from './ProductView'

const ProductDisplay = ({ products }) => {
  const [view, setView] = useState('grid')

  const renderView = () => {
    if (view === 'grid') {
      return new ProductView(new GridView()).render(products)
    } else {
      return new ProductView(new ListView()).render(products)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <Select value={view} onChange={(e) => setView(e.target.value)}>
        <MenuItem value="grid">Lưới</MenuItem>
        <MenuItem value="list">Danh sách</MenuItem>
      </Select>
      {renderView()}
    </div>
  )
}

export default ProductDisplay
