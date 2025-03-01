import { useState, useEffect } from 'react'
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TableSortLabel, IconButton, Button, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { userApi } from '~/apis'
import * as yup from 'yup'

const userSchema = yup.object().shape({
  name: yup.string().required('Họ và tên là bắt buộc'),
  username: yup.string().required('Username là bắt buộc'),
  password: yup.string().required('Password là bắt buộc'),
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
  const [editingUser, setEditingUser] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    userApi.getUsers().then(setUsers)
  }, [])

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
    setOpenDialog(true)
  }

  const confirmDelete = async () => {
    await userApi.deleteUser(editingUser._id)
    setUsers(users.filter(user => user._id !== editingUser._id))
    setOpenDialog(false)
    setEditingUser(null)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setOpenDialog(true)
  }

  const handleAddUser = () => {
    setEditingUser({ name: '', username: '', email: '', phone: '' })
    setOpenDialog(true)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleSave = async () => {
    if (!(await validateUser(editingUser))) return

    if (editingUser._id) {
      await userApi.updateUser(editingUser._id, {
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone
      })
      setUsers(users.map(user => (user._id === editingUser._id ? editingUser : user)))
    } else {
      const newUser = await userApi.addUser(editingUser)
      setUsers([...users, newUser])
    }
    setOpenDialog(false)
    setEditingUser(null)
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser}>Thêm người dùng</Button>
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
            {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username || 'N/A'}</TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>{user.phone || 'N/A'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingUser?._id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</DialogTitle>
        <DialogContent>
          <TextField label="Họ và tên" fullWidth margin="dense" value={editingUser?.name || ''} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} error={!!errors.name} helperText={errors.name} />
          <TextField label="Username" fullWidth margin="dense" value={editingUser?.username || ''} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} error={!!errors.username} helperText={errors.username} />
          {editingUser?._id ? (
            <TextField label="Password" type='hidden' value={editingUser?.password} />
          ) : (
            <TextField label="Password" password fullWidth margin="dense" value={editingUser?.password || ''} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} error={!!errors.password} helperText={errors.password} />
          )}
          <TextField label="Email" fullWidth margin="dense" value={editingUser?.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} error={!!errors.email} helperText={errors.email} />
          <TextField label="Số điện thoại" fullWidth margin="dense" value={editingUser?.phone || ''} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} error={!!errors.phone} helperText={errors.phone} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          {editingUser?._id && <Button color="error" onClick={confirmDelete}>Xóa</Button>}
          <Button variant="contained" onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
