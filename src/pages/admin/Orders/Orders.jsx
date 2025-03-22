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
  Typography,
  TableSortLabel,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
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
  Tooltip,
  CircularProgress
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import UpdateIcon from '@mui/icons-material/Update'
import CancelIcon from '@mui/icons-material/Cancel'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { fetchProductDetailsAPIById } from '~/apis'
import { orderApi } from '~/apis'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'
import { API_ROOT } from '~/utils/constants'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [reload, setReload] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [date, setDate] = useState(dayjs())
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Họ và tên' },
    { id: 'phone', label: 'Số điện thoại' },
    { id: 'address', label: 'Địa chỉ' },
    { id: 'lastAmount', label: 'Tổng cộng' },
    { id: 'status', label: 'Trạng thái' },
    { id: 'paymentStatus', label: 'Thanh toán' },
    { id: 'createdAt', label: 'Ngày đặt' },
    { id: 'actions', label: 'Hành động' }
  ])
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    fetchOrders()
  }, [reload])

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getOrders()
      setOrders(data)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tải dữ liệu!', severity: 'error' }))
    }
  }

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    setSortField(field)
    setSortOrder(isAsc ? 'desc' : 'asc')
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const newColumns = [...columns]
    const [movedItem] = newColumns.splice(result.source.index, 1)
    newColumns.splice(result.destination.index, 0, movedItem)
    setColumns(newColumns)
  }

  const filteredOrders = orders.filter((order) =>
    ((order._id && order._id.toLowerCase().includes(search.toLowerCase())) ||
    (order.name && order.name.toLowerCase().includes(search.toLowerCase())) ||
    (order.phone && order.phone.includes(search)) ||
    (order.address && order.address.toLowerCase().includes(search.toLowerCase())))
    && (!isSearch || dayjs(order.createdAt).format('YYYY/MM/DD') === dayjs(date).format('YYYY/MM/DD'))
  )

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const valueA = a[sortField] || ''
    const valueB = b[sortField] || ''
    return sortOrder === 'asc'
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA))
  })

  const handleViewInfoOrder = async (order) => {
    try {
      setLoading(true)
      const orderWithDetails = { ...order }
      await Promise.all(orderWithDetails.items.map(async (item) => {
        const product = await fetchProductDetailsAPIById(item.productId)
        item.image = product.colors[0].images[0]
        item.productName = product.name
      }))

      setSelectedOrder(orderWithDetails)
      setOpenInfoDialog(true)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đơn hàng:', error)
      dispatch(showSnackbar({
        message: 'Có lỗi xảy ra khi lấy thông tin đơn hàng',
        severity: 'error'
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleViewUpdateOrder = (order) => {
    setSelectedOrder(order)
    setOpenUpdateDialog(true)
  }

  const handleCancelOrder = (order) => {
    setSelectedOrder(order)
    setOpenCancelDialog(true)
  }

  const handleUpdateOrder = async (orderId) => {
    try {
      const data = await orderApi.updateStatusOrder(orderId)
      if (data.order === true) {
        dispatch(showSnackbar({ message: data.message, severity: 'success' }))
        setReload(prev => !prev)
      } else {
        dispatch(showSnackbar({ message: data.message, severity: 'error' }))
      }
      setOpenUpdateDialog(false)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi cập nhật trạng thái!', severity: 'error' }))
    }
  }

  const handleConfirmCancel = async () => {
    try {
      const data = await orderApi.cancelOrder(selectedOrder._id)
      if (data.success) {
        dispatch(showSnackbar({ message: 'Hủy đơn hàng thành công!', severity: 'success' }))
        setReload(prev => !prev)
      } else {
        dispatch(showSnackbar({ message: data.message || 'Có lỗi xảy ra!', severity: 'error' }))
      }
      setOpenCancelDialog(false)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi hủy đơn hàng!', severity: 'error' }))
    }
  }

  const handleCloseDialog = () => {
    setOpenInfoDialog(false)
    setOpenUpdateDialog(false)
    setOpenCancelDialog(false)
    setSelectedOrder(null)
  }

  const options = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    const url = String(imageUrl)
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quản lý đơn hàng</Typography>

      <Box sx={{
        display: 'flex',
        mb: 2,
        gap: 2
      }}>
        <TextField
          label="Tìm kiếm theo tên, số điện thoại hoặc địa chỉ"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: '350px' }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={date}
            onChange={(newValue) => setDate(newValue)}
            disableFuture
            size='small'
          />
        </LocalizationProvider>

        <Button
          onClick={() => setIsSearch(isSearch ? false : true)}
          variant='outlined'
          sx={{ width: '150px' }}
        >
          {isSearch ? 'Hủy' : 'Tìm kiếm'}
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: 560, overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="columns" direction="horizontal" type="column">
                {(provided) => (
                  <TableRow ref={provided.innerRef} {...provided.droppableProps}>
                    {columns.map((column, index) => (
                      <Draggable key={column.id} draggableId={column.id} index={index}>
                        {(provided) => (
                          <TableCell
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ minWidth: 150, whiteSpace: 'nowrap' }}
                          >
                            {column.id !== 'actions' ? (
                              <TableSortLabel
                                active={sortField === column.id}
                                direction={sortOrder}
                                onClick={() => handleSort(column.id)}
                              >
                                {column.label}
                              </TableSortLabel>
                            ) : (
                              column.label
                            )}
                          </TableCell>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableRow>
                )}
              </Droppable>
            </DragDropContext>
          </TableHead>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Typography justifySelf='center'>Không tìm thấy đơn hàng nào tồn tại.</Typography>
                </TableCell>
              </TableRow>
            ) : sortedOrders.map((order) => (
              <TableRow key={order._id}>
                {columns.map((column) => (
                  <TableCell key={column.id} size="small">
                    {column.id === 'lastAmount' ? (
                      <Typography>{order.lastAmount.toLocaleString()} VNĐ</Typography>
                    ) : column.id === 'status' ? (
                      <Chip
                        sx={{
                          backgroundColor:
                            order.status === 'pending' ? 'orange' :
                              order.status === 'shipping' ? 'blue' :
                                order.status === 'cancelled' ? 'red' : 'green',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        label={
                          order.status === 'pending' ? 'Đang chờ' :
                            order.status === 'shipping' ? 'Đang giao hàng' :
                              order.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'
                        }
                      />
                    ) : column.id === 'paymentStatus' ? (
                      <Chip
                        sx={{
                          backgroundColor:
                            order.paymentStatus === 'failed' ? 'red' :
                              order.paymentStatus === 'pending' ? '#997e36' : 'green',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        label={
                          order.paymentStatus === 'failed' ? 'Thất bại' :
                            order.paymentStatus === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán'
                        }
                      />
                    ) : column.id === 'createdAt' ? (
                      <Typography variant="body2">
                        {new Intl.DateTimeFormat('vi-VN', options).format(order.createdAt)}
                      </Typography>
                    ) : column.id === 'actions' ? (
                      <>
                        <Tooltip title="Xem chi tiết">
                          <IconButton color="primary" onClick={() => handleViewInfoOrder(order)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {order.status === 'pending' && (
                          <>
                            <Tooltip title="Cập nhật trạng thái">
                              <IconButton color="primary" onClick={() => handleViewUpdateOrder(order)}>
                                <UpdateIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Hủy đơn hàng">
                              <IconButton color="error" onClick={() => handleCancelOrder(order)}>
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </>
                    ) : (
                      order[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Chi Tiết Đơn Hàng */}
      <Dialog
        open={openInfoDialog}
        onClose={() => setOpenInfoDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          py: 2
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{
              fontWeight: 'bold',
              color: '#1976d2'
            }}>
              Chi tiết đơn hàng #{selectedOrder?._id?.slice(-6)}
            </Typography>
            <IconButton
              onClick={() => setOpenInfoDialog(false)}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
              <CircularProgress />
            </Box>
          ) : selectedOrder ? (
            <Box>
              <Grid container spacing={3}>
                {/* Thông tin khách hàng */}
                <Grid item xs={12} md={6}>
                  <Card sx={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      transition: 'box-shadow 0.3s ease-in-out'
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <PersonIcon /> Thông tin khách hàng
                      </Typography>
                      <List>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Họ và tên
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedOrder.name}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Số điện thoại
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedOrder.phone}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Địa chỉ
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedOrder.address}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Phương thức thanh toán
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedOrder.paymentMethod}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Mã giao dịch
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedOrder.transactionId}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Thông tin đơn hàng */}
                <Grid item xs={12} md={6}>
                  <Card sx={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      transition: 'box-shadow 0.3s ease-in-out'
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <ReceiptIcon /> Thông tin đơn hàng
                      </Typography>
                      <List>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Mã đơn hàng
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedOrder._id}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Ngày đặt
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {new Intl.DateTimeFormat('vi-VN', options).format(selectedOrder.createdAt)}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Trạng thái đơn hàng
                              </Typography>
                            }
                            secondary={
                              <Chip
                                label={
                                  selectedOrder.status === 'pending' ? 'Đang chờ' :
                                    selectedOrder.status === 'shipping' ? 'Đang giao hàng' :
                                      selectedOrder.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'
                                }
                                color={
                                  selectedOrder.status === 'pending' ? 'warning' :
                                    selectedOrder.status === 'shipping' ? 'info' :
                                      selectedOrder.status === 'cancelled' ? 'error' : 'success'
                                }
                                size="small"
                                sx={{
                                  fontWeight: 'bold',
                                  px: 1
                                }}
                              />
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                Trạng thái thanh toán
                              </Typography>
                            }
                            secondary={
                              <Chip
                                label={
                                  selectedOrder.paymentStatus === 'failed' ? 'Thất bại' :
                                    selectedOrder.paymentStatus === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán'
                                }
                                color={
                                  selectedOrder.paymentStatus === 'failed' ? 'error' :
                                    selectedOrder.paymentStatus === 'pending' ? 'warning' : 'success'
                                }
                                size="small"
                                sx={{
                                  fontWeight: 'bold',
                                  px: 1
                                }}
                              />
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Danh sách sản phẩm */}
                <Grid item xs={12}>
                  <Card sx={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      transition: 'box-shadow 0.3s ease-in-out'
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <ShoppingCartIcon /> Danh sách sản phẩm
                      </Typography>
                      <List>
                        {selectedOrder.items.map((item, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              mb: 2,
                              borderRadius: 1,
                              bgcolor: 'background.paper',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              '&:hover': {
                                bgcolor: 'action.hover',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease-in-out'
                              }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                src={getImageUrl(item.image)}
                                alt={item.productName}
                                variant="rounded"
                                sx={{
                                  width: 80,
                                  height: 80,
                                  mr: 2,
                                  border: '1px solid #e0e0e0',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.3s ease-in-out'
                                  }
                                }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1" sx={{
                                  fontWeight: 'bold',
                                  color: '#1976d2'
                                }}>
                                  {item.productName}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    mb: 1
                                  }}>
                                    <Chip
                                      label={`Size: ${item.size}`}
                                      size="small"
                                      sx={{
                                        bgcolor: '#e3f2fd',
                                        color: '#1976d2',
                                        fontWeight: 'bold'
                                      }}
                                    />
                                    <Chip
                                      label={`Màu: ${item.color}`}
                                      size="small"
                                      sx={{
                                        bgcolor: '#e3f2fd',
                                        color: '#1976d2',
                                        fontWeight: 'bold'
                                      }}
                                    />
                                  </Box>
                                  <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Số lượng: {item.quantity}
                                    </Typography>
                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                                      {item.price.toLocaleString()} VNĐ
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Divider sx={{ my: 3 }} />
                      <Box sx={{
                        bgcolor: '#f5f5f5',
                        p: 3,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2
                        }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Tổng tiền:</Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {selectedOrder.amount.toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2
                        }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Giảm giá:</Typography>
                          <Typography variant="subtitle1" color="error" sx={{ fontWeight: 500 }}>
                            -{selectedOrder.discountAmount.toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2
                        }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            Thành tiền:
                          </Typography>
                          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                            {selectedOrder.lastAmount.toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{
          p: 2,
          bgcolor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0'
              }
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Cập nhật status đơn hàng */}
      <Dialog open={openUpdateDialog} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận đã gửi đơn hàng</DialogTitle>
        {selectedOrder && (
          <>
            <DialogContent>
              <Typography variant="body1">Xác nhận cập nhật đơn hàng: <strong>{selectedOrder._id}</strong></Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Hủy</Button>
              <Button onClick={() => handleUpdateOrder(selectedOrder._id)}>Cập nhật</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog Xác nhận hủy đơn hàng */}
      <Dialog open={openCancelDialog} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        {selectedOrder && (
          <>
            <DialogContent>
              <Typography variant="body1">
                Bạn có chắc chắn muốn hủy đơn hàng <strong>{selectedOrder._id}</strong> không?
                Hành động này không thể hoàn tác.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Hủy</Button>
              <Button color="error" onClick={handleConfirmCancel}>Xác nhận hủy</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
