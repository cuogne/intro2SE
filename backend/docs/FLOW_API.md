### Flow của API

#### Flow đặt vé và thanh toán

**Bước 1: User đăng ký và đăng nhập**
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập và nhận token

**Bước 2: User chọn phim, rạp và suất chiếu**
- `GET /api/v1/movies` - Lấy danh sách phim và hiển thị tất cả phim đang chiếu cho user
- `GET /api/v1/movies/:id` - User chọn 1 phim thì hiển thị chi tiết phim đó
- `GET /api/v1/showtimes` - Hiển thị suất chiếu của phim (ngày/giờ) đó ở các rạp.
- `GET /api/v1/showtimes/:id` - User chọn suất chiếu thì hiển thị chi tiết suất chiếu đó kèm với trạng thái ghế.

**Bước 3: User chọn ghế (Tạo booking)**
- `POST /api/v1/bookings` - User chọn ghế đầu tiên
- Backend tạo booking với `status = 'pending'` và `holdExpiresAt = now + 5 phút` (thời gian giữ ghế là 5 phút)
- Response trả về `bookingId` và `holdExpiresAt`
- Frontend lưu `bookingId` và hiển thị countdown timer 5 phút cho user.

- Nếu user chọn thêm ghế trong 5 phút này:
  - `PATCH /api/v1/bookings/:id/seats` - Gửi cái ghế vừa được user nhấn thêm vào booking hiện có (không reset timer).
  - Nếu user nhấn bớt ghế:
    - `PATCH /api/v1/bookings/:id/seats` - Gửi cái ghế vừa được user nhấn bớt khỏi booking hiện có (không reset timer).
  - Thời gian giữ ghế không đổi, vẫn giữ nguyên `holdExpiresAt` ban đầu (một user chỉ có 5p để giữ ghế từ lúc chọn ghế đầu tiên + thanh toán, nếu muốn reset phải thoát web ra home và tạo booking mới).


**Bước 5: User ấn thanh toán**
- `POST /api/v1/payments` - Gửi `bookingId` cho backend để tạo order thanh toán Zalopay
  - Backend check booking còn hiệu lực (`holdExpiresAt > now`)
  - Backend tạo order thanh toán Zalopay với toàn bộ ghế trong booking
  - Response trả về `order_url` để redirect user đến trang thanh toán

**Bước 6: User thanh toán**
- Frontend redirect user đến `order_url` (Zalopay)
- User thanh toán trên Zalopay

**Bước 7: Zalopay callback (Tự động)**
- `POST /api/v1/payments/callback` - Zalopay tự động gọi khi thanh toán thành công
  - Backend cập nhật booking `status = 'confirmed'`
  - Ghế hiển thị `status = 'booked'` cho user khác