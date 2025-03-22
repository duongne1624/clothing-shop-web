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
  Badge
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { userApi } from '~/apis'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'
import { motion, AnimatePresence } from 'framer-motion'

const userSchema = yup.object().shape({
  name: yup.string().required('Họ và tên là bắt buộc'),
  username: yup.string().required('Username là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Password là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phone: yup.string().matches(/^\d{10,11}$/, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc')
})

const userUpdateSchema = yup.object().shape({
  name: yup.string().required('Họ và tên là bắt buộc'),
  username: yup.string().required('Username là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phone: yup.string().matches(/^\d{10,11}$/, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc')
})

export default function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const rowsPerPage = 5
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await userApi.getUsers()
      setUsers(data)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tải dữ liệu!', severity: 'error' }))
    }
  }

  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
    (user.username && user.username.toLowerCase().includes(search.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
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

  const validateUser = async (user) => {
    try {
      if (editingUser._id) {
        await userUpdateSchema.validate(user, { abortEarly: false })
      } else {
        await userSchema.validate(user, { abortEarly: false })
      }
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
    setEditingUser(users.find(user => user._id === id))
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await userApi.deleteUser(editingUser._id)
      setUsers(users.filter(user => user._id !== editingUser._id))
      setOpenDeleteDialog(false)
      setEditingUser(null)
      dispatch(showSnackbar({ message: 'Xóa người dùng thành công!', severity: 'success' }))
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi xóa người dùng!', severity: 'error' }))
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setErrors({})
    setOpenDialog(true)
  }

  const handleAddUser = () => {
    setEditingUser({ name: '', username: '', email: '', phone: '' })
    setErrors({})
    setOpenDialog(true)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleSave = async () => {
    if (!(await validateUser(editingUser))) return

    try {
      if (editingUser._id) {
        await userApi.updateUser(editingUser._id, {
          name: editingUser.name,
          username: editingUser.username,
          email: editingUser.email,
          phone: editingUser.phone
        })
        setUsers(users.map(user => (user._id === editingUser._id ? editingUser : user)))
        dispatch(showSnackbar({ message: 'Thay đổi thông tin người dùng thành công!', severity: 'success' }))
      } else {
        const newUser = await userApi.addUser(editingUser)
        setUsers([...users, newUser])
        dispatch(showSnackbar({ message: 'Thêm mới người dùng thành công!', severity: 'success' }))
      }
      setOpenDialog(false)
      setEditingUser(null)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi lưu thông tin!', severity: 'error' }))
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quản lý người dùng</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Tìm kiếm theo tên, username hoặc email"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size='small'
          sx={{ flex: 1, mr: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
          sx={{
            background: '#1cb05c',
            '&:hover': {
              background: '#169c4f'
            }
          }}
        >
          Thêm người dùng
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={sortField === 'name'} direction={sortOrder} onClick={() => handleSort('name')}>
                  Họ và tên
                </TableSortLabel>
              </TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>
                <TableSortLabel active={sortField === 'role'} direction={sortOrder} onClick={() => handleSort('role')}>
                  Vai trò
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Typography>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton color="primary" onClick={() => handleEdit(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleDelete(user._id)}>
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

      <Typography variant="body2" sx={{ mt: 2 }}>Tổng số người dùng: {sortedUsers.length}</Typography>

      <TablePagination
        component="div"
        count={sortedUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      {/* Dialog Chỉnh sửa/Thêm mới */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser?._id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Họ và tên"
            fullWidth
            margin="dense"
            value={editingUser?.name || ''}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            value={editingUser?.username || ''}
            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
            error={!!errors.username}
            helperText={errors.username}
          />
          {!editingUser?._id && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="dense"
              value={editingUser?.password || ''}
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
            />
          )}
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={editingUser?.email || ''}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="dense"
            value={editingUser?.phone || ''}
            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
            error={!!errors.phone}
            helperText={errors.phone}
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
        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng &quot;{editingUser?.name}&quot; không?
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
