import { useState, useEffect } from 'react'
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Button, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, TableSortLabel } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { categoryApi } from '~/apis'
import * as yup from 'yup'

const categorySchema = yup.object().shape({
  name: yup.string().required('Tên danh mục là bắt buộc'),
  description: yup.string().nullable()
})

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const rowsPerPage = 5
  const [openDialog, setOpenDialog] = useState(false)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [editingCategory, setEditingCategory] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    categoryApi.getCategories().then(setCategories)
  }, [])

  const filteredCategories = categories.filter(category =>
    (category.name && category.name.toLowerCase().includes(search.toLowerCase()))
  )

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortField) return 0
    const valueA = a[sortField]?.toLowerCase() || ''
    const valueB = b[sortField]?.toLowerCase() || ''
    return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
  })

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    setSortField(field)
    setSortOrder(isAsc ? 'desc' : 'asc')
  }

  const validateCategory = async (category) => {
    try {
      await categorySchema.validate(category, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      const newErrors = {}
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message
      })
      setErrors(newErrors)
      return false
    }
  }

  const handleSave = async () => {
    if (!(await validateCategory(editingCategory))) return

    if (editingCategory._id) {
      await categoryApi.updateCategory(editingCategory._id, editingCategory)
      setCategories(categories.map(cat => (cat._id === editingCategory._id ? editingCategory : cat)))
    } else {
      const newCategory = await categoryApi.createCategory(editingCategory)
      setCategories([...categories, newCategory])
    }
    setOpenDialog(false)
    setEditingCategory(null)
  }

  const handleDelete = async (id) => {
    await categoryApi.deleteCategory(id)
    setCategories(categories.filter(cat => cat._id !== id))
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setOpenDialog(true)
  }

  const handleAddCategory = () => {
    setEditingCategory({ name: '', slug: '', description: '' })
    setOpenDialog(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quản lý danh mục</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Tìm kiếm danh mục"
          variant="outlined"
          value={search}
          size='small'
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, mr: 2 }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCategory}>Thêm danh mục</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={sortField === 'name'} direction={sortOrder} onClick={() => handleSort('name')}>
                  Tên danh mục
                </TableSortLabel>
              </TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(category => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.description || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(category._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedCategories.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingCategory?._id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên danh mục" fullWidth margin="dense" value={editingCategory?.name || ''} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} error={!!errors.name} helperText={errors.name} />
          <TextField label="Mô tả" fullWidth margin="dense" value={editingCategory?.description || ''} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} error={!!errors.description} helperText={errors.description} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
