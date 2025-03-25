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
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox
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
  stock: yup.number().required('Số lượng là bắt buộc').min(0, 'Số lượng phải lớn hơn 0'),
  sizes: yup.array().min(1, 'Ít nhất 1 kích thước').required('Kích thước là bắt buộc'),
  colors: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Tên màu là bắt buộc'),
      colorCode: yup.string().required('Mã màu là bắt buộc'),
      images: yup.array().min(1, 'Ít nhất 1 hình ảnh').required('Hình ảnh là bắt buộc')
    })
  ).min(1, 'Ít nhất 1 màu').required('Màu sắc là bắt buộc')
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
      stock: 0,
      sizes: [],
      colors: [{
        name: '',
        colorCode: '#000000',
        images: []
      }]
    })
    setErrors({})
    setOpenDialog(true)
  }

  const handleAddColor = () => {
    setEditingProduct({
      ...editingProduct,
      colors: [
        ...editingProduct.colors,
        {
          name: '',
          colorCode: '#000000',
          images: []
        }
      ]
    })
  }

  const handleRemoveColor = (index) => {
    setEditingProduct({
      ...editingProduct,
      colors: editingProduct.colors.filter((_, i) => i !== index)
    })
  }

  const handleColorChange = (index, field, value) => {
    const newColors = [...editingProduct.colors]
    newColors[index] = {
      ...newColors[index],
      [field]: value
    }
    setEditingProduct({
      ...editingProduct,
      colors: newColors
    })
  }

  const handleAddImage = async (colorIndex, files) => {
    try {
      if (!files || files.length === 0) {
        dispatch(showSnackbar({ message: 'Vui lòng chọn file ảnh!', severity: 'error' }))
        return
      }

      const file = files[0]
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        dispatch(showSnackbar({ message: 'Kích thước ảnh không được vượt quá 5MB!', severity: 'error' }))
        return
      }

      // Kiểm tra định dạng file
      if (!file.type.startsWith('image/')) {
        dispatch(showSnackbar({ message: 'File phải là định dạng ảnh!', severity: 'error' }))
        return
      }

      const formData = new FormData()
      formData.append('image', file)

      const response = await productApi.uploadImage(formData)
      if (!response) {
        throw new Error('Không nhận được URL ảnh từ server')
      }

      const newColors = [...editingProduct.colors]
      newColors[colorIndex] = {
        ...newColors[colorIndex],
        images: [...newColors[colorIndex].images, response]
      }
      setEditingProduct({
        ...editingProduct,
        colors: newColors
      })

      dispatch(showSnackbar({ message: 'Tải ảnh lên thành công!', severity: 'success' }))
    } catch (error) {
      console.error('Lỗi tải ảnh:', error)
      dispatch(showSnackbar({
        message: error.message || 'Có lỗi xảy ra khi tải ảnh lên! Vui lòng thử lại.',
        severity: 'error'
      }))
    }
  }

  const handleRemoveImage = (colorIndex, imageIndex) => {
    const newColors = [...editingProduct.colors]
    newColors[colorIndex] = {
      ...newColors[colorIndex],
      images: newColors[colorIndex].images.filter((_, i) => i !== imageIndex)
    }
    setEditingProduct({
      ...editingProduct,
      colors: newColors
    })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleSave = async () => {
    if (!(await validateProduct(editingProduct))) return

    try {
      if (editingProduct._id) {
        const productId = editingProduct._id
        delete editingProduct._id
        await productApi.updateProduct(productId, editingProduct)
        editingProduct._id = productId
        setProducts(products.map(product => (product._id === productId ? editingProduct : product)))
        dispatch(showSnackbar({ message: 'Cập nhật sản phẩm thành công!', severity: 'success' }))
      } else {
        const newProduct = await productApi.createProduct(editingProduct)
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

  const handleSizeChange = (size) => {
    const currentSizes = editingProduct.sizes || []
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size]

    setEditingProduct({
      ...editingProduct,
      sizes: newSizes
    })
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
                      <Typography>{product.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <img
                        src={getImageUrl(product.colors[0].images[0])}
                        style={{ width: 50, height: 50 }}
                      />
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
              <Typography variant="subtitle1" gutterBottom>Kích thước</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <Box
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: `1px solid ${editingProduct?.sizes?.includes(size) ? '#1cb05c' : '#e5e5e5'}`,
                      transition: '0.3s',
                      '&:hover': {
                        borderColor: '#1cb05c'
                      }
                    }}
                  >
                    <Typography variant="body2">{size}</Typography>
                  </Box>
                ))}
              </Box>
              {errors.sizes && (
                <Typography color="error" variant="caption">
                  {errors.sizes}
                </Typography>
              )}
            </Grid>

            {/* Phần màu sắc */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Màu sắc</Typography>
              {editingProduct?.colors?.map((color, colorIndex) => (
                <Box key={colorIndex} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Tên màu"
                        fullWidth
                        margin="dense"
                        value={color.name}
                        onChange={(e) => handleColorChange(colorIndex, 'name', e.target.value)}
                        error={!!errors[`colors.${colorIndex}.name`]}
                        helperText={errors[`colors.${colorIndex}.name`]}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Mã màu"
                        fullWidth
                        margin="dense"
                        type="color"
                        value={color.colorCode}
                        onChange={(e) => handleColorChange(colorIndex, 'colorCode', e.target.value)}
                        error={!!errors[`colors.${colorIndex}.colorCode`]}
                        helperText={errors[`colors.${colorIndex}.colorCode`]}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveColor(colorIndex)}
                        disabled={editingProduct.colors.length === 1}
                      >
                        Xóa màu
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>Hình ảnh</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {color.images.map((image, imageIndex) => (
                          <Box key={imageIndex} sx={{ position: 'relative' }}>
                            <Avatar
                              src={getImageUrl(image)}
                              alt={`${color.name} ${imageIndex + 1}`}
                              sx={{ width: 100, height: 100 }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.dark' }
                              }}
                              onClick={() => handleRemoveImage(colorIndex, imageIndex)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                        <Button
                          variant="outlined"
                          component="label"
                          sx={{ width: 100, height: 100 }}
                        >
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleAddImage(colorIndex, e.target.files)}
                          />
                          <AddIcon sx={{ fontSize: 40 }} />
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddColor}
                sx={{ mt: 1 }}
              >
                Thêm màu
              </Button>
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
