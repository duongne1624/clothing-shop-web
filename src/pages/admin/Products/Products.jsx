import { useState, useEffect } from 'react'
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Button, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { categoryApi, productApi } from '~/apis'
import * as yup from 'yup'

const categorySchema = yup.object().shape({
  name: yup.string().required('Tên danh mục là bắt buộc'),
  slug: yup.string().required('Slug là bắt buộc'),
  description: yup.string().nullable()
})

const productSchema = yup.object().shape({
  name: yup.string().required('Tên sản phẩm là bắt buộc'),
  slug: yup.string().required('Slug là bắt buộc'),
  description: yup.string().nullable(),
  price: yup.number().required('Giá sản phẩm là bắt buộc').positive(),
  stock: yup.number().required('Số lượng tồn kho là bắt buộc').integer().min(0)
})

export default function AdminDashboard() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const rowsPerPage = 5
  const [openDialog, setOpenDialog] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    categoryApi.getCategories().then(setCategories)
    productApi.getProducts().then(setProducts)
  }, [])

  const validateItem = async (item, schema) => {
    try {
      await schema.validate(item, { abortEarly: false })
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
    const schema = editingItem?.categoryId ? productSchema : categorySchema
    if (!(await validateItem(editingItem, schema))) return
    if (editingItem._id) {
      if (editingItem.categoryId) {
        await productApi.updateProduct(editingItem._id, editingItem)
        setProducts(products.map(prod => (prod._id === editingItem._id ? editingItem : prod)))
      } else {
        await categoryApi.updateCategory(editingItem._id, editingItem)
        setCategories(categories.map(cat => (cat._id === editingItem._id ? editingItem : cat)))
      }
    } else if (editingItem.categoryId) {
      const newProduct = await productApi.createProduct(editingItem)
      setProducts([...products, newProduct])
    } else {
      const newCategory = await categoryApi.createCategory(editingItem)
      setCategories([...categories, newCategory])
    }
    setOpenDialog(false)
    setEditingItem(null)
  }

  const handleDelete = async (id, isProduct) => {
    if (isProduct) {
      await productApi.deleteProduct(id)
      setProducts(products.filter(prod => prod._id !== id))
    } else {
      await categoryApi.deleteCategory(id)
      setCategories(categories.filter(cat => cat._id !== id))
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setOpenDialog(true)
  }

  const handleAddItem = (isProduct) => {
    setEditingItem(isProduct ? { name: '', slug: '', description: '', price: 0, stock: 0, categoryId: '' } : { name: '', slug: '', description: '' })
    setOpenDialog(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quản lý sản phẩm</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size='small'
          sx={{ flex: 1, mr: 2 }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleAddItem(true)}>Thêm sản phẩm</Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Đã bán</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.sold}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product._id, true)}>
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
        count={products.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </Box>
  )
}
