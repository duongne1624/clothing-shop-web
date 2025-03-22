import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
  IconButton,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Tooltip,
  Avatar,
  Badge
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { categoryApi } from '~/apis'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'
import { motion, AnimatePresence } from 'framer-motion'

const categorySchema = yup.object().shape({
  name: yup.string().required('Tên danh mục là bắt buộc'),
  description: yup.string().required('Mô tả là bắt buộc'),
  slug: yup.string().required('Slug là bắt buộc')
})

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const rowsPerPage = 5
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories()
      setCategories(data)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tải dữ liệu!', severity: 'error' }))
    }
  }

  const filteredCategories = categories.filter(category =>
    (category.name && category.name.toLowerCase().includes(search.toLowerCase())) ||
    (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
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

  const handleDelete = (id) => {
    setEditingCategory(categories.find(category => category._id === id))
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await categoryApi.deleteCategory(editingCategory._id)
      setCategories(categories.filter(category => category._id !== editingCategory._id))
      setOpenDeleteDialog(false)
      setEditingCategory(null)
      dispatch(showSnackbar({ message: 'Xóa danh mục thành công!', severity: 'success' }))
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi xóa danh mục!', severity: 'error' }))
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setErrors({})
    setOpenDialog(true)
  }

  const handleAddCategory = () => {
    setEditingCategory({ name: '', description: '', slug: '' })
    setErrors({})
    setOpenDialog(true)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleSave = async () => {
    if (!(await validateCategory(editingCategory))) return

    try {
      if (editingCategory._id) {
        await categoryApi.updateCategory(editingCategory._id, editingCategory)
        setCategories(categories.map(category => (category._id === editingCategory._id ? editingCategory : category)))
        dispatch(showSnackbar({ message: 'Cập nhật danh mục thành công!', severity: 'success' }))
      } else {
        const newCategory = await categoryApi.addCategory(editingCategory)
        setCategories([...categories, newCategory])
        dispatch(showSnackbar({ message: 'Thêm danh mục thành công!', severity: 'success' }))
      }
      setOpenDialog(false)
      setEditingCategory(null)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi lưu danh mục!', severity: 'error' }))
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quản lý danh mục</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Tìm kiếm theo tên hoặc mô tả"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size='small'
          sx={{ flex: 1, mr: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
          sx={{
            background: '#1cb05c',
            '&:hover': {
              background: '#169c4f'
            }
          }}
        >
          Thêm danh mục
        </Button>
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
              <TableCell>Mô tả</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Số sản phẩm</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {sortedCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(category => (
                <motion.tr
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1cb05c' }}>
                        {category.name.charAt(0)}
                      </Avatar>
                      <Typography>{category.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    <Badge badgeContent={category.productCount || 0} color="primary">
                      <Chip label="Sản phẩm" size="small" />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category._destroy ? 'Đã xóa' : 'Đang hoạt động'}
                      color={category._destroy ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton color="primary" onClick={() => handleEdit(category)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleDelete(category._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ mt: 2 }}>Tổng số danh mục: {sortedCategories.length}</Typography>

      <TablePagination
        component="div"
        count={sortedCategories.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      {/* Dialog Chỉnh sửa/Thêm mới */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory?._id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            fullWidth
            margin="dense"
            value={editingCategory?.name || ''}
            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={editingCategory?.description || ''}
            onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            label="Slug"
            fullWidth
            margin="dense"
            value={editingCategory?.slug || ''}
            onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
            error={!!errors.slug}
            helperText={errors.slug}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: '#1cb05c',
              '&:hover': {
                background: '#169c4f'
              }
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xác nhận xóa */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa danh mục &quot;{editingCategory?.name}&quot; không?
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button color="error" onClick={confirmDelete}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
