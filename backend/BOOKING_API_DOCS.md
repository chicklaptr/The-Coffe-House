# API Xử Lý Đặt Chỗ (Booking API)

## Overview
API này quản lý các chức năng đặt chỗ tại quán cafe, cho phép người dùng tạo đặt chỗ, chủ quán quản lý bookings, và hệ thống kiểm tra tính khả dụng.

## Base URL
```
/api/bookings
```

## Endpoints

### 1. Tạo Booking Mới
**Endpoint:** `POST /api/bookings`

**Mô tả:** Tạo một đơn đặt chỗ mới

**Request Body:**
```json
{
  "user_id": 1,
  "cafe_id": 5,
  "booking_date": "2026-05-20",
  "booking_time": "14:30",
  "number_of_people": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo đặt chỗ thành công",
  "data": {
    "id": 1,
    "user_id": 1,
    "cafe_id": 5,
    "booking_date": "2026-05-20",
    "booking_time": "14:30",
    "number_of_people": 4,
    "status": "pending",
    "created_at": "2026-05-17T10:30:00Z"
  }
}
```

**Status Codes:**
- `201` - Tạo thành công
- `400` - Thiếu thông tin hoặc dữ liệu không hợp lệ
- `500` - Lỗi server

---

### 2. Lấy Chi Tiết Một Booking
**Endpoint:** `GET /api/bookings/:id`

**Mô tả:** Lấy thông tin chi tiết của một đơn đặt chỗ

**Parameters:**
- `id` (required): ID của booking

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "cafe_id": 5,
    "booking_date": "2026-05-20",
    "booking_time": "14:30",
    "number_of_people": 4,
    "status": "pending",
    "created_at": "2026-05-17T10:30:00Z",
    "users": {
      "full_name": "Nguyễn Văn A",
      "email": "user@example.com",
      "phone_number": "0123456789"
    },
    "cafes": {
      "name_vn": "Quán Cafe Ngon",
      "name_jp": "カフェ",
      "address": "123 Nguyen Hue, HCMC"
    }
  }
}
```

**Status Codes:**
- `200` - Thành công
- `400` - ID không hợp lệ
- `404` - Không tìm thấy booking
- `500` - Lỗi server

---

### 3. Lấy Tất Cả Booking Của Một Người Dùng
**Endpoint:** `GET /api/bookings/user/:userId`

**Mô tả:** Lấy danh sách tất cả bookings của một người dùng

**Parameters:**
- `userId` (required): ID của người dùng

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "cafe_id": 5,
      "booking_date": "2026-05-20",
      "booking_time": "14:30",
      "number_of_people": 4,
      "status": "confirmed",
      "created_at": "2026-05-17T10:30:00Z",
      "cafes": {
        "name_vn": "Quán Cafe Ngon",
        "name_jp": "カフェ",
        "address": "123 Nguyen Hue, HCMC",
        "phone_number": "0287654321"
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Thành công
- `400` - ID không hợp lệ
- `500` - Lỗi server

---

### 4. Lấy Tất Cả Booking Của Một Quán
**Endpoint:** `GET /api/bookings/cafe/:cafeId`

**Mô tả:** Lấy danh sách tất cả bookings của một quán cafe (dùng cho chủ quán)

**Parameters:**
- `cafeId` (required): ID của quán cafe

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "cafe_id": 5,
      "booking_date": "2026-05-20",
      "booking_time": "14:30",
      "number_of_people": 4,
      "status": "pending",
      "created_at": "2026-05-17T10:30:00Z",
      "users": {
        "full_name": "Nguyễn Văn A",
        "email": "user@example.com",
        "phone_number": "0123456789"
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Thành công
- `400` - ID không hợp lệ
- `500` - Lỗi server

---

### 5. Kiểm Tra Khả Dụng (Booking theo ngày)
**Endpoint:** `GET /api/bookings/availability/cafe/:cafeId?bookingDate=YYYY-MM-DD`

**Mô tả:** Lấy tất cả bookings pending/confirmed của một quán vào một ngày cụ thể

**Parameters:**
- `cafeId` (required): ID của quán cafe
- `bookingDate` (required): Ngày đặt chỗ (format: YYYY-MM-DD)

**Example:**
```
GET /api/bookings/availability/cafe/5?bookingDate=2026-05-20
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "cafe_id": 5,
      "booking_date": "2026-05-20",
      "booking_time": "14:30",
      "number_of_people": 4,
      "status": "confirmed",
      "created_at": "2026-05-17T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Thành công
- `400` - ID hoặc ngày không hợp lệ
- `500` - Lỗi server

---

### 6. Cập Nhật Trạng Thái Booking
**Endpoint:** `PUT /api/bookings/:id/status`

**Mô tả:** Cập nhật trạng thái của một booking (chủ quán dùng để confirm hoặc reject)

**Parameters:**
- `id` (required): ID của booking

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Trạng thái hợp lệ:**
- `pending` - Đơn đặt chỗ đang chờ xác nhận
- `confirmed` - Đã xác nhận
- `rejected` - Đã từ chối

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công",
  "data": {
    "id": 1,
    "user_id": 1,
    "cafe_id": 5,
    "booking_date": "2026-05-20",
    "booking_time": "14:30",
    "number_of_people": 4,
    "status": "confirmed",
    "created_at": "2026-05-17T10:30:00Z"
  }
}
```

**Status Codes:**
- `200` - Cập nhật thành công
- `400` - Trạng thái không hợp lệ hoặc ID không hợp lệ
- `500` - Lỗi server

---

### 7. Hủy Booking
**Endpoint:** `DELETE /api/bookings/:id`

**Mô tả:** Hủy (xóa) một đơn đặt chỗ

**Parameters:**
- `id` (required): ID của booking

**Response:**
```json
{
  "success": true,
  "message": "Hủy đặt chỗ thành công"
}
```

**Status Codes:**
- `200` - Hủy thành công
- `400` - ID không hợp lệ hoặc lỗi xóa
- `500` - Lỗi server

---

## Data Model

### Booking Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    cafe_id INT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    number_of_people INT NOT NULL CHECK (number_of_people > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
);
```

### Booking Interface (TypeScript)
```typescript
interface Booking {
    id: number;
    userId: number;
    cafeId: number;
    bookingDate: string;     // Format: YYYY-MM-DD
    bookingTime: string;     // Format: HH:MM
    numberOfPeople: number;
    status: 'pending' | 'confirmed' | 'rejected';
    createdAt: string;
}
```

## Error Handling

Tất cả các lỗi sẽ trả về response JSON với format:
```json
{
  "success": false,
  "message": "Mô tả lỗi"
}
```

## Notes
- Trạng thái mặc định của booking mới là `pending`
- Hệ thống tự động ghi lại thời gian tạo (created_at)
- Khi booking bị xóa, hành động không thể hoàn tác
- Số lượng người phải lớn hơn 0

## Files Created/Modified
- `src/services/booking.service.ts` - Service layer cho database operations
- `src/controllers/cafe.booking.controller.ts` - Controller layer xử lý requests
- `src/routes/booking.routes.ts` - Routes định nghĩa các endpoints
- `src/app.ts` - Đã cập nhật để đăng ký booking routes
