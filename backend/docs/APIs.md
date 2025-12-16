# API Documentation

## Thiết kế Model

### Quan hệ giữa các Model
- **User** `1 - N` **Booking**: Một user có thể đặt nhiều vé
- **Movie** `1 - N` **Showtime**: Một bộ phim có thể có nhiều suất chiếu
- **Cinema** `1 - N` **Showtime**: Một rạp có thể có nhiều suất chiếu
- **Showtime** `1 - N` **Booking**: Một suất chiếu có thể có nhiều vé được đặt
- **Booking** `N - 1` **Seat**: Một vé có thể bao gồm nhiều ghế

---

## Mô hình dữ liệu

### User
- **id**: UUID do MongoDB tạo
- **username**: Username mà user tạo để login
- **email**: Email của user (để làm quên mật khẩu)
- **passwordHash**: Password đã được hash trước khi lưu vào database
- **role**: Vai trò của user (`admin` hoặc `user`) - phân quyền truy cập API
- **createdAt**: Thời gian tạo tài khoản
- **updatedAt**: Thời gian cập nhật tài khoản gần nhất (cập nhật email, password)

> **Lưu ý**: Hiện tại lúc tạo tài khoản quyền luôn là `user`, còn `admin` sẽ được tạo thủ công trong database.

### Movie
- **id**: UUID do MongoDB tạo
- **title**: Tên bộ phim
- **durationMinutes**: Thời lượng phim (phút)
- **genres**: Mảng thể loại phim (Action, Comedy, ...)
- **releaseDate**: Ngày phát hành
- **posterImg**: Link poster phim
- **trailerLink**: Link trailer phim (YouTube)
- **description**: Mô tả phim
- **status**: Trạng thái phim
  - `now_showing`: Đang chiếu
  - `coming_soon`: Sắp chiếu
  - `ended`: Hết chiếu

### Cinema
- **id**: UUID do MongoDB tạo
- **name**: Tên rạp
- **address**: Địa chỉ rạp
- **seatLayout**: Mảng biểu diễn sơ đồ ghế ở mỗi rạp
  - Ví dụ cấu trúc:
    ```javascript
    rows: [
      { row: "A", seats: [{ number: 1 }, { number: 2 }, ...] },
      { row: "B", seats: [{ number: 1 }, { number: 2 }, ...] }
    ]
    ```

### Showtime
- **id**: UUID do MongoDB tạo
- **movieId**: ID của bộ phim (liên kết với Movie)
- **cinemaId**: ID của rạp (liên kết với Cinema)
- **startTime**: Thời gian bắt đầu chiếu (bao gồm cả ngày và giờ)
- **price**: Giá vé cho suất chiếu
- **availableSeats**: Số lượng ghế còn trống
- **seats**: Mảng các ghế của suất chiếu
  - **row**: Ký hiệu hàng (ví dụ: "A")
  - **number**: Số ghế trong hàng (ví dụ: 1)
  - **isBooked**: Trạng thái ghế (`true`/`false`)

### Booking
- **id**: UUID do MongoDB tạo
- **userId**: ID của user đặt vé (liên kết với User)
- **showtimeId**: ID của suất chiếu (liên kết với Showtime)
- **seats**: Mảng các ghế được đặt
  - **row**: Ký hiệu hàng (ví dụ: "A")
  - **number**: Số ghế trong hàng (ví dụ: 1)
- **totalPrice**: Tổng giá tiền (số ghế × giá vé)
- **bookingTime**: Thời gian đặt vé (timestamp)

---

## JSON mẫu

### Movie
```javascript
{
  id: "uuid-movie-1234",
  title: "Inception",
  durationMinutes: 148,
  genres: ["Action", "Sci-Fi"],
  releaseDate: "2010-07-16",
  posterImg: "https://linktoimage.com/inception.jpg",
  trailerLink: "https://youtube.com/trailer-inception",
  description: "A thief who steals corporate secrets through the use of dream-sharing technology...",
  status: "now_showing"
}
```

### Cinema
```javascript
{
  id: "uuid-cinema-5678",
  name: "Cinemax Sinh Viên",
  address: "Nhà văn hóa sinh viên, TP.HCM",
  seatLayout: [
    { row: "A", seats: [{ number: 1 }, { number: 2 }, { number: 3 }] },
    { row: "B", seats: [{ number: 1 }, { number: 2 }, { number: 3 }] }
  ]
}
```

### User
```javascript
{
  id: "uuid-user-91011",
  username: "abc123",
  email: "abc123@example.com",
  password: "hashedpassword123",  // để làm mẫu, không trả về trong response
  role: "user",
  createdAt: "2024-01-01T12:00:00Z",
  updatedAt: "2024-01-01T12:00:00Z"
}
```

### Showtime
```javascript
{
  id: "uuid-showtime-1213",
  movieId: "uuid-movie-1234",           // Phim: Inception
  cinemaId: "uuid-cinema-5678",         // Rạp: Cinemax Sinh Viên
  startTime: "2025-12-15T19:30:00Z",    // 15/12/2025 19:30
  price: 45000,
  availableSeats: 4,
  seats: [
    { row: "A", number: 1, isBooked: false },
    { row: "A", number: 2, isBooked: true },
    { row: "A", number: 3, isBooked: true },
    { row: "B", number: 1, isBooked: false },
    { row: "B", number: 2, isBooked: false },
    { row: "B", number: 3, isBooked: false }
  ]
}
```

### Booking
```javascript
{
  id: "uuid-booking-1415",
  userId: "uuid-user-91011",            // User: abc123
  showtimeId: "uuid-showtime-1213",     // Inception tại Cinemax Sinh Viên, 15/12/2025 19:30
  seats: [
    { row: "A", number: 2 },
    { row: "A", number: 3 }
  ],
  totalPrice: 90000,                    // 2 ghế × 45000
  bookingTime: "2025-12-13T10:37:50Z"
}
```

---

## API Endpoints

### User APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới (username, email, password) | No |
| POST | `/api/auth/login` | Đăng nhập và nhận token | No |
| GET | `/api/auth/profile` | Lấy thông tin profile của user | Login |
| PUT | `/api/auth/profile` | Cập nhật thông tin profile (chỉ cập nhật email) | Login |
| POST | `/api/auth/change-password` | Đổi mật khẩu | Login |
| POST | `/api/auth/forgot-password` | Nhập đúng email, gửi mã xác nhận tới email lấy lại mật khẩu | No |

### Movie APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/movies` | Lấy danh sách tất cả phim<br>Query params: `?page=&limit=&status=` | No |
| GET | `/api/v1/movies/:id` | Lấy chi tiết phim theo id | No |
| POST | `/api/v1/movies` | Thêm phim mới | Admin only |
| PUT | `/api/v1/movies/:id` | Cập nhật thông tin phim | Admin only |
| DELETE | `/api/v1/movies/:id` | Xoá phim | Admin only |

### Cinema APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/cinemas` | Lấy danh sách tất cả rạp | No |
| GET | `/api/v1/cinemas/:id` | Lấy chi tiết rạp theo id | No |
| POST | `/api/v1/cinemas` | Thêm rạp mới | Admin only |
| PUT | `/api/v1/cinemas/:id` | Cập nhật thông tin rạp | Admin only |
| DELETE | `/api/v1/cinemas/:id` | Xoá rạp | Admin only |
### Showtime APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/showtimes` | Lấy danh sách tất cả suất chiếu<br>Query params: `?movieId=&cinemaId=&date=` | No |
| GET | `/api/v1/showtimes/:id` | Lấy chi tiết suất chiếu theo id | No |
| POST | `/api/v1/showtimes` | Thêm suất chiếu mới | Admin only |
| PUT | `/api/v1/showtimes/:id` | Cập nhật thông tin suất chiếu | Admin only |
| DELETE | `/api/v1/showtimes/:id` | Xoá suất chiếu | Admin only |

### Booking APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/bookings` | Lấy danh sách vé đã đặt của user | Login |
| GET | `/api/v1/bookings/:id` | Lấy chi tiết vé đã đặt theo id | Login |
| POST | `/api/v1/bookings` | Đặt vé mới | Login |