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
  MenuItem,
  InputAdornment,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { couponApi } from '~/apis'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const couponSchema = yup.object().shape({
  code: yup.string().required('Mã giảm giá là bắt buộc'),
  type: yup.string().oneOf(['percentage', 'fixed']).required('Loại giảm giá là bắt buộc'),
  value: yup.number().required('Giá trị giảm giá là bắt buộc'),
  maxDiscount: yup.number().nullable(),
  minOrder: yup.number().nullable(),
  usageLimit: yup.number().required('Số lần sử dụng tối đa là bắt buộc'),
  expiresAt: yup.date().nullable()
})

export default function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const rowsPerPage = 5
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [errors, setErrors] = useState({})
  const [hasExpiry, setHasExpiry] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const data = await couponApi.getCoupons()
      setCoupons(data)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tải dữ liệu!', severity: 'error' }))
    }
  }

  const filteredCoupons = coupons.filter(coupon =>
    (coupon.code && coupon.code.toLowerCase().includes(search.toLowerCase())) ||
    (coupon.type && coupon.type.toLowerCase().includes(search.toLowerCase()))
  )

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
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

  const validateCoupon = async (coupon) => {
    try {
      await couponSchema.validate(coupon, { abortEarly: false })
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
    setEditingCoupon(coupons.find(coupon => coupon._id === id))
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await couponApi.deleteCoupon(editingCoupon._id)
      setCoupons(coupons.filter(coupon => coupon._id !== editingCoupon._id))
      setOpenDeleteDialog(false)
      setEditingCoupon(null)
      dispatch(showSnackbar({ message: 'Xóa mã giảm giá thành công!', severity: 'success' }))
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi xóa mã giảm giá!', severity: 'error' }))
    }
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setHasExpiry(!!coupon.expiresAt)
    setErrors({})
    setOpenEditDialog(true)
  }

  const handleAddCoupon = () => {
    setEditingCoupon({
      code: '',
      type: 'percentage',
      value: 0,
      maxDiscount: null,
      minOrder: null,
      usageLimit: 0,
      expiresAt: null
    })
    setHasExpiry(false)
    setErrors({})
    setOpenEditDialog(true)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const formatCurrency = (value) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  const handleSave = async () => {
    if (!(await validateCoupon(editingCoupon))) return

    try {
      if (editingCoupon._id) {
        await couponApi.updateCoupon(editingCoupon._id, editingCoupon)
        setCoupons(coupons.map(coupon => (coupon._id === editingCoupon._id ? editingCoupon : coupon)))
        dispatch(showSnackbar({ message: 'Cập nhật mã giảm giá thành công!', severity: 'success' }))
      } else {
        const newCoupon = await couponApi.addCoupon(editingCoupon)
        setCoupons([...coupons, newCoupon])
        dispatch(showSnackbar({ message: 'Thêm mã giảm giá thành công!', severity: 'success' }))
      }
      setOpenEditDialog(false)
      setEditingCoupon(null)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi lưu mã giảm giá!', severity: 'error' }))
    }
  }

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quản lý mã giảm giá</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Tìm kiếm theo mã hoặc loại"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size='small'
          sx={{ flex: 1, mr: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCoupon}
          sx={{
            background: '#1cb05c',
            '&:hover': {
              background: '#169c4f'
            }
          }}
        >
          Thêm mã giảm giá
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={sortField === 'code'} direction={sortOrder} onClick={() => handleSort('code')}>
                  Mã giảm giá
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortField === 'type'} direction={sortOrder} onClick={() => handleSort('type')}>
                  Loại
                </TableSortLabel>
              </TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Giảm tối đa</TableCell>
              <TableCell>Đơn tối thiểu</TableCell>
              <TableCell>Số lần sử dụng</TableCell>
              <TableCell>Đã sử dụng</TableCell>
              <TableCell>Hạn sử dụng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {sortedCoupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(coupon => (
                <motion.tr
                  key={coupon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {coupon.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.type === 'percentage' ? 'Phần trăm' : 'Cố định'}
                      color={coupon.type === 'percentage' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                  </TableCell>
                  <TableCell>{formatCurrency(coupon.maxDiscount)}</TableCell>
                  <TableCell>{formatCurrency(coupon.minOrder)}</TableCell>
                  <TableCell>{coupon.usageLimit}</TableCell>
                  <TableCell>{coupon.usedCount}</TableCell>
                  <TableCell>
                    {coupon.expiresAt ? (
                      <Chip
                        label={new Date(coupon.expiresAt).toLocaleDateString('vi-VN')}
                        color={isExpired(coupon.expiresAt) ? 'error' : 'success'}
                        size="small"
                      />
                    ) : (
                      'Không có hạn'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={coupon._destroy ? 'Đã xóa' : 'Đang hoạt động'}
                      color={coupon._destroy ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton color="primary" onClick={() => handleEdit(coupon)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleDelete(coupon._id)}>
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

      <Typography variant="body2" sx={{ mt: 2 }}>Tổng số mã giảm giá: {sortedCoupons.length}</Typography>

      <TablePagination
        component="div"
        count={sortedCoupons.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      {/* Dialog Chỉnh sửa/Thêm mới */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCoupon?._id ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Mã giảm giá"
            fullWidth
            margin="dense"
            value={editingCoupon?.code || ''}
            onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
            error={!!errors.code}
            helperText={errors.code}
          />
          <TextField
            select
            label="Loại giảm giá"
            fullWidth
            margin="dense"
            value={editingCoupon?.type || 'percentage'}
            onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value })}
            error={!!errors.type}
            helperText={errors.type}
          >
            <MenuItem value="percentage">Phần trăm (%)</MenuItem>
            <MenuItem value="fixed">Cố định (VNĐ)</MenuItem>
          </TextField>
          <TextField
            label="Giá trị giảm giá"
            fullWidth
            margin="dense"
            type="number"
            value={editingCoupon?.value || 0}
            onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
            error={!!errors.value}
            helperText={errors.value}
            InputProps={{
              endAdornment: <InputAdornment position="end">
                {editingCoupon?.type === 'percentage' ? '%' : 'VNĐ'}
              </InputAdornment>
            }}
          />
          {editingCoupon?.type === 'percentage' ? (
            <TextField
              label="Giá trị giảm tối đa"
              fullWidth
              margin="dense"
              type="number"
              value={editingCoupon?.maxDiscount || ''}
              onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscount: Number(e.target.value) })}
              error={!!errors.maxDiscount}
              helperText={errors.maxDiscount}
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>
              }}
            />
          ) : (
            <TextField
              label="Giá trị đơn hàng tối thiểu"
              fullWidth
              margin="dense"
              type="number"
              value={editingCoupon?.minOrder || ''}
              onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrder: Number(e.target.value) })}
              error={!!errors.minOrder}
              helperText={errors.minOrder}
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>
              }}
            />
          )}
          <TextField
            label="Số lần sử dụng tối đa"
            fullWidth
            margin="dense"
            type="number"
            value={editingCoupon?.usageLimit || 0}
            onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: Number(e.target.value) })}
            error={!!errors.usageLimit}
            helperText={errors.usageLimit}
          />
          <FormControlLabel
            control={
              <Switch
                checked={hasExpiry}
                onChange={(e) => {
                  setHasExpiry(e.target.checked)
                  if (!e.target.checked) {
                    setEditingCoupon({ ...editingCoupon, expiresAt: null })
                  }
                }}
              />
            }
            label="Có hạn sử dụng"
          />
          {hasExpiry && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Hạn sử dụng"
                value={editingCoupon?.expiresAt ? dayjs(editingCoupon.expiresAt) : null}
                onChange={(newValue) => setEditingCoupon({ ...editingCoupon, expiresAt: newValue?.toISOString() })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                    error: !!errors.expiresAt,
                    helperText: errors.expiresAt
                  }
                }}
              />
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
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
        <DialogTitle>Xác nhận xóa mã giảm giá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa mã giảm giá &quot;{editingCoupon?.code}&quot; không?
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button color="error" onClick={confirmDelete}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
