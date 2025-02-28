import { useEffect, useState } from 'react'
import { List, ListItemButton, ListItemText, Collapse, CircularProgress } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getCategoriesAPI } from '~/apis' // API lấy danh sách danh mục

const ListCategories = ({ onSelectCategory, onCloseMenu }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    getCategoriesAPI()
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleToggle = (categoryId) => {
    setOpen((prev) => (prev === categoryId ? null : categoryId))
  }

  const handleCategoryClick = (category) => {
    onSelectCategory(category)
    onCloseMenu()
  }

  return (
    <List>
      {loading ? (
        <CircularProgress />
      ) : (
        categories.map((category) => (
          <div key={category.id}>
            <ListItemButton onClick={() => handleToggle(category.id)}>
              <ListItemText primary={category.name} />
              {open === category.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>

            <Collapse in={open === category.id} timeout="auto" unmountOnExit>
              {category.children.map((categoryChild) => (
                <List key={categoryChild.id} component="div" disablePadding sx={{ pl: 3 }}>
                  <ListItemButton onClick={() => handleCategoryClick(categoryChild.slug)}>
                    <ListItemText primary={`${categoryChild.name}`} />
                  </ListItemButton>
                </List>
              ))}
            </Collapse>
          </div>
        ))
      )}
    </List>
  )
}

export default ListCategories
