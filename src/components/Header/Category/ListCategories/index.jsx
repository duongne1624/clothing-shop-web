import { useEffect, useState } from 'react'
import { List, ListItemButton, ListItemText, Collapse, CircularProgress, Box, Typography } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getCategoriesAPI } from '~/apis' // API lấy danh sách danh mục
import { motion, AnimatePresence } from 'framer-motion'

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

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <List sx={{ p: 0 }}>
      <AnimatePresence>
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ListItemButton
              onClick={() => handleToggle(category.id)}
              sx={{
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                },
                '&.Mui-selected': {
                  backgroundColor: '#f0f0f0'
                }
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{
                    fontWeight: 500,
                    color: '#333'
                  }}>
                    {category.name}
                  </Typography>
                }
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={open === category.id ? 'open' : 'closed'}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: open === category.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open === category.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </motion.div>
              </AnimatePresence>
            </ListItemButton>

            <Collapse
              in={open === category.id}
              timeout="auto"
              unmountOnExit
              sx={{
                backgroundColor: '#fafafa'
              }}
            >
              <List component="div" disablePadding>
                {category.children.map((categoryChild) => (
                  <motion.div
                    key={categoryChild.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItemButton
                      onClick={() => handleCategoryClick(categoryChild.slug)}
                      sx={{
                        pl: 4,
                        '&:hover': {
                          backgroundColor: '#f0f0f0'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{
                            color: '#666',
                            fontSize: '0.9rem'
                          }}>
                            {categoryChild.name}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </motion.div>
                ))}
              </List>
            </Collapse>
          </motion.div>
        ))}
      </AnimatePresence>
    </List>
  )
}

export default ListCategories
