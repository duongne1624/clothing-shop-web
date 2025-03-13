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
  Button
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import UpdateIcon from '@mui/icons-material/Update'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { orderApi } from '~/apis'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
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

  const dispatch = useDispatch()

  useEffect(() => {
    orderApi.getOrders().then(setOrders)
  }, [reload])

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

  const handleViewInfoOrder = (order) => {
    setSelectedOrder(order)
    setOpenInfoDialog(true)
  }

  const handleViewUpdateOrder = (order) => {
    setSelectedOrder(order)
    setOpenUpdateDialog(true)
  }

  const handleUpdateOrder = async (orderId) => {
    const data = await orderApi.updateStatusOrder(orderId)
    if (data.order === true)
      dispatch(showSnackbar({ message: data.message, severity: 'success' }))
    else
      dispatch(showSnackbar({ message: data.message, severity: 'error' }))
    setOpenUpdateDialog(false)
    setReload(prev => !prev)
  }

  const handleCloseDialog = () => {
    setOpenInfoDialog(false)
    setOpenUpdateDialog(false)
    setSelectedOrder(null)
  }

  const options = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
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
          sx={{ width: '3 50px' }}
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
                        <IconButton color="primary" onClick={() => handleViewInfoOrder(order)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleViewUpdateOrder(order)}>
                          <UpdateIcon />
                        </IconButton>
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
      <Dialog open={openInfoDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="body1"><strong>Khách hàng:</strong> {selectedOrder.name}</Typography>
              <Typography variant="body1"><strong>Số điện thoại:</strong> {selectedOrder.phone}</Typography>
              <Typography variant="body1"><strong>Địa chỉ:</strong> {selectedOrder.address}</Typography>
              <Typography variant="body1"><strong>Thanh toán:</strong> {selectedOrder.paymentMethod}</Typography>
              <Typography variant="body1"><strong>Mã giao dịch:</strong> {selectedOrder.transactionId}</Typography>
              <Typography variant="body1"><strong>Trạng thái đơn hàng:</strong> {selectedOrder.status === 'pending' ? 'Đang chờ' : selectedOrder.status === 'shipping' ? 'Đang giao hàng' : selectedOrder.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'}</Typography>
              <Typography variant="body1"><strong>Trạng thái thanh toán:</strong> {selectedOrder.paymentStatus === 'failed' ? 'Thất bại' : selectedOrder.paymentStatus === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán'}</Typography>
              <Typography variant="body1"><strong>Tổng tiền:</strong> {selectedOrder.amount.toLocaleString()}₫</Typography>
              <Typography variant="body1"><strong>Giảm giá:</strong> {selectedOrder.discountAmount.toLocaleString()}₫</Typography>
              <Typography variant="body1"><strong>Giá cuối:</strong> {selectedOrder.lastAmount.toLocaleString()}₫</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>Sản phẩm trong đơn hàng:</Typography>
              {selectedOrder.items.map((item, index) => (
                <Box key={index} sx={{ p: 1, borderBottom: '1px solid #ddd' }}>
                  <Typography variant="body2">{item.productId} - {item.size} - {item.color} - {item.quantity} x {item.price.toLocaleString()}₫</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
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
              <Button onClick={handleCloseDialog}>Đóng</Button>
              <Button onClick={() => handleUpdateOrder(selectedOrder._id)}>Cập nhật</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
