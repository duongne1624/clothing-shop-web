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
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { productApi, categoryApi } from '~/apis'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { API_ROOT } from '~/utils/constants'

const productSchema = yup.object().shape({
  name: yup.string().required('Tên sản phẩm là bắt buộc'),
  description: yup.string().required('Mô tả là bắt buộc'),
  price: yup.number().required('Giá là bắt buộc').min(0, 'Giá phải lớn hơn 0'),
  categoryId: yup.string().required('Danh mục là bắt buộc'),
  images: yup.array().min(1, 'Ít nhất 1 hình ảnh').required('Hình ảnh là bắt buộc'),
  sizes: yup.array().min(1, 'Ít nhất 1 kích thước').required('Kích thước là bắt buộc'),
  colors: yup.array().min(1, 'Ít nhất 1 màu').required('Màu sắc là bắt buộc'),
  stock: yup.number().required('Số lượng là bắt buộc').min(0, 'Số lượng phải lớn hơn 0')
})

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const rowsPerPage = 5
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await productApi.getProducts()
      setProducts(data)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tải dữ liệu!', severity: 'error' }))
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories()
      setCategories(data)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tải danh mục!', severity: 'error' }))
    }
  }

  const filteredProducts = products.filter(product =>
    (product.name && product.name.toLowerCase().includes(search.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0
    const valueA = a[sortField]?.toString().toLowerCase() || ''
    const valueB = b[sortField]?.toString().toLowerCase() || ''
    return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
  })

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    setSortField(field)
    setSortOrder(isAsc ? 'desc' : 'asc')
  }

  const validateProduct = async (product) => {
    try {
      await productSchema.validate(product, { abortEarly: false })
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
    setEditingProduct(products.find(product => product._id === id))
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await productApi.deleteProduct(editingProduct._id)
      setProducts(products.filter(product => product._id !== editingProduct._id))
      setOpenDeleteDialog(false)
      setEditingProduct(null)
      dispatch(showSnackbar({ message: 'Xóa sản phẩm thành công!', severity: 'success' }))
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi xóa sản phẩm!', severity: 'error' }))
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setErrors({})
    setOpenDialog(true)
  }

  const handleAddProduct = () => {
    setEditingProduct({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      images: [],
      sizes: [],
      colors: [],
      stock: 0
    })
    setErrors({})
    setOpenDialog(true)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleSave = async () => {
    if (!(await validateProduct(editingProduct))) return

    try {
      if (editingProduct._id) {
        await productApi.updateProduct(editingProduct._id, editingProduct)
        setProducts(products.map(product => (product._id === editingProduct._id ? editingProduct : product)))
        dispatch(showSnackbar({ message: 'Cập nhật sản phẩm thành công!', severity: 'success' }))
      } else {
        const newProduct = await productApi.addProduct(editingProduct)
        setProducts([...products, newProduct])
        dispatch(showSnackbar({ message: 'Thêm sản phẩm thành công!', severity: 'success' }))
      }
      setOpenDialog(false)
      setEditingProduct(null)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi lưu sản phẩm!', severity: 'error' }))
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    const url = String(imageUrl)
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quản lý sản phẩm</Typography>

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
          onClick={handleAddProduct}
          sx={{
            background: '#1cb05c',
            '&:hover': {
              background: '#169c4f'
            }
          }}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={sortField === 'name'} direction={sortOrder} onClick={() => handleSort('name')}>
                  Tên sản phẩm
                </TableSortLabel>
              </TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>
                <TableSortLabel active={sortField === 'price'} direction={sortOrder} onClick={() => handleSort('price')}>
                  Giá
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortField === 'stock'} direction={sortOrder} onClick={() => handleSort('stock')}>
                  Số lượng
                </TableSortLabel>
              </TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {sortedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : ''}
                        alt={product.name}
                        sx={{ width: 40, height: 40 }}
                      >
                        {product.name.charAt(0)}
                      </Avatar>
                      <Typography>{product.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {product.images && product.images.slice(0, 3).map((image, index) => (
                        <Avatar
                          key={index}
                          src={getImageUrl(image)}
                          alt={`${product.name} ${index + 1}`}
                          sx={{ width: 32, height: 32 }}
                        />
                      ))}
                      {product.images && product.images.length > 3 && (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>
                          +{product.images.length - 3}
                        </Avatar>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {categories.find(cat => cat._id === product.categoryId)?.name || 'N/A'}
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <Badge badgeContent={product.stock} color={product.stock > 0 ? 'success' : 'error'}>
                      <Chip label="Tồn kho" size="small" />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product._destroy ? 'Đã xóa' : 'Đang hoạt động'}
                      color={product._destroy ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton color="primary" onClick={() => handleEdit(product)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleDelete(product._id)}>
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

      <Typography variant="body2" sx={{ mt: 2 }}>Tổng số sản phẩm: {sortedProducts.length}</Typography>

      <TablePagination
        component="div"
        count={sortedProducts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      {/* Dialog Chỉnh sửa/Thêm mới */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct?._id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tên sản phẩm"
                fullWidth
                margin="dense"
                value={editingProduct?.name || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" error={!!errors.categoryId}>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={editingProduct?.categoryId || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  label="Danh mục"
                >
                  {categories.map(category => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <Typography color="error" variant="caption">
                    {errors.categoryId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mô tả"
                fullWidth
                margin="dense"
                multiline
                rows={3}
                value={editingProduct?.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Giá"
                fullWidth
                margin="dense"
                type="number"
                value={editingProduct?.price || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Số lượng"
                fullWidth
                margin="dense"
                type="number"
                value={editingProduct?.stock || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                error={!!errors.stock}
                helperText={errors.stock}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Kích thước (phân cách bằng dấu phẩy)"
                fullWidth
                margin="dense"
                value={editingProduct?.sizes?.join(', ') || ''}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  sizes: e.target.value.split(',').map(size => size.trim()).filter(Boolean)
                })}
                error={!!errors.sizes}
                helperText={errors.sizes}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Màu sắc (phân cách bằng dấu phẩy)"
                fullWidth
                margin="dense"
                value={editingProduct?.colors?.join(', ') || ''}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  colors: e.target.value.split(',').map(color => color.trim()).filter(Boolean)
                })}
                error={!!errors.colors}
                helperText={errors.colors}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Hình ảnh (URL, phân cách bằng dấu phẩy)"
                fullWidth
                margin="dense"
                value={editingProduct?.images?.join(', ') || ''}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  images: e.target.value.split(',').map(url => url.trim()).filter(Boolean)
                })}
                error={!!errors.images}
                helperText={errors.images}
              />
            </Grid>
          </Grid>
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
        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm &quot;{editingProduct?.name}&quot; không?
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
