import { Router } from 'express';
import * as bookingController from '../controllers/cafe.booking.controller';

const router = Router();

// Booking management endpoints

// 1. POST: Tạo booking mới
router.post('/', bookingController.createBooking);

// 2. GET: Lấy tất cả booking của một người dùng (MUST BE BEFORE /:id)
router.get('/user/:userId', bookingController.getUserBookings);

// 3. GET: Lấy tất cả booking của một quán (MUST BE BEFORE /:id)
router.get('/cafe/:cafeId', bookingController.getCafeBookings);

// 4. GET: Lấy booking theo ngày và quán (kiểm tra tính khả dụng - MUST BE BEFORE /:id)
// Usage: /api/bookings/availability/cafe/1?bookingDate=2026-05-20
router.get('/availability/cafe/:cafeId', bookingController.getBookingsByDateAndCafe);

// 5. GET: Lấy chi tiết một booking (MUST BE LAST)
router.get('/:id', bookingController.getBookingById);

// 6. PUT: Cập nhật trạng thái booking
router.put('/:id/status', bookingController.updateBookingStatus);

// 7. DELETE: Hủy booking
router.delete('/:id', bookingController.cancelBooking);

export default router;
