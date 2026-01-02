# API Documentation

## Base URL

```
http://localhost:{PORT}
```

Tất cả API endpoints đều bắt đầu với base URL trên.

---

## Authentication

### Cách sử dụng Token

Hầu hết các API yêu cầu authentication. Sau khi login thành công, bạn sẽ nhận được một JWT token. Token này cần được gửi kèm trong header của mọi request yêu cầu authentication.

**Format:**
```
Authorization: Bearer <token>
```

**Ví dụ:**
```javascript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
}
```

**Token Expiry:** Token có thời hạn 1 giờ. Sau khi hết hạn, cần login lại để lấy token mới.

---

## Data Models

### User
```typescript
{
  _id: string;           // MongoDB ObjectId
  username: string;       // Unique
  email: string;          // Unique
  password: string;       // Hashed (không trả về trong response)
  role: 'admin' | 'user'; // Mặc định: 'user'
  createdAt: Date;
  updatedAt: Date;
}
```

> **Lưu ý**: Hiện tại lúc tạo tài khoản quyền luôn là `user`, còn `admin` sẽ được tạo thủ công trong database.

### Movie
```typescript
{
  _id: string;
  title: string;
  minutes: number;        // Thời lượng phim (phút)
  genre: string[];        // Mảng thể loại
  releaseDate: Date;      // Optional
  posterImg: string;      // URL poster
  trailerLink: string;    // URL trailer YouTube
  description: string;    // Optional
  status: 'now_showing' | 'coming_soon' | 'ended';
}
```

### Cinema
```typescript
{
  _id: string;
  name: string;
  address: string;
  rows: number;
  columns: number;
  seatLayout: Array<{
    row: string;          // Ví dụ: "A", "B", "C"
    seats: string[];      // Ví dụ: ["A1", "A2", "A3"]
  }>;
}
```

### Showtime
```typescript
{
  _id: string;
  movie: Movie | string;  // ObjectId hoặc populated object
  cinema: Cinema | string;
  startTime: Date;        // ISO 8601 format
  price: number;          // Giá vé (mặc định: 45000)
  totalSeats: number;
  availableSeats: number;
  seats: Array<{
    row: string;
    number: number;
    isBooked: boolean;
    status?: 'available' | 'reserved' | 'booked'; // Chỉ có khi get showtime by id
  }>;
}
```

### Booking
```typescript
{
  _id: string;
  showtime: Showtime | string;
  user: User | string;
  seat: Array<{
    row: string;
    number: number;
  }>;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  holdExpiresAt: Date;    // Thời gian hết hạn giữ ghế (chỉ có khi status = 'pending')
  paidAt: Date;           // Thời gian thanh toán (chỉ có khi status = 'confirmed')
  paymentProvider: string; // 'zalopay'
  paymentTransId: string; // Transaction ID từ Zalopay
  paymentMeta: object;    // Metadata thanh toán
  bookedAt: Date;
}
```

---

## API Endpoints
### Authentication APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | [`/api/auth/register`](#11-đăng-ký-tài-khoản) | Đăng ký tài khoản mới (username, email, password) | No |
| POST | [`/api/auth/login`](#12-đăng-nhập) | Đăng nhập và nhận token | No |

### User APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | [`/api/v1/users/me`](#21-lấy-thông-tin-tài-khoản-của-mình) | Lấy thông tin tài khoản của chính mình | Login |
| PUT | [`/api/v1/users/me/update`](#22-cập-nhật-thông-tin-tài-khoản) | Cập nhật thông tin tài khoản (username, email) | Login |
| DELETE | [`/api/v1/users/me`](#23-xóa-tài-khoản) | Xóa tài khoản của chính mình | Login |
| PUT | [`/api/v1/users/me/password`](#24-đổi-mật-khẩu) | Đổi mật khẩu | Login |
| GET | [`/api/v1/users/all`](#25-lấy-danh-sách-tất-cả-tài-khoản-admin-only) | Lấy danh sách tất cả tài khoản | Admin only |
| GET | [`/api/v1/users/all/:id`](#26-lấy-thông-tin-tài-khoản-theo-id-admin-only) | Lấy thông tin tài khoản theo id | Admin only |

### Movie APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | [`/api/v1/movies`](#31-lấy-danh-sách-phim) | Lấy danh sách tất cả phim<br>Query params: `?page=&limit=&status=` | No |
| GET | [`/api/v1/movies/:id`](#32-lấy-chi-tiết-phim) | Lấy chi tiết phim theo id | No |
| POST | [`/api/v1/movies`](#33-tạo-phim-mới-admin-only) | Thêm phim mới | Admin only |
| PUT | [`/api/v1/movies/:id`](#34-cập-nhật-phim-admin-only) | Cập nhật thông tin phim | Admin only |
| DELETE | [`/api/v1/movies/:id`](#35-xóa-phim-admin-only) | Xoá phim | Admin only |

### Cinema APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | [`/api/v1/cinemas`](#41-lấy-danh-sách-rạp) | Lấy danh sách tất cả rạp | No |
| GET | [`/api/v1/cinemas/:id`](#42-lấy-chi-tiết-rạp) | Lấy chi tiết rạp theo id | No |
| POST | [`/api/v1/cinemas`](#43-tạo-rạp-mới-admin-only) | Thêm rạp mới | Admin only |
| PUT | [`/api/v1/cinemas/:id`](#44-cập-nhật-rạp-admin-only) | Cập nhật thông tin rạp | Admin only |
| DELETE | [`/api/v1/cinemas/:id`](#45-xóa-rạp-admin-only) | Xoá rạp | Admin only |

### Showtime APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | [`/api/v1/showtimes`](#51-lấy-danh-sách-suất-chiếu) | Lấy danh sách tất cả suất chiếu<br>Query params: `?movieId=&cinemaId=&date=&page=&limit=` | No |
| GET | [`/api/v1/showtimes/:id`](#52-lấy-chi-tiết-suất-chiếu-với-trạng-thái-ghế) | Lấy chi tiết suất chiếu theo id | No |
| POST | [`/api/v1/showtimes`](#53-tạo-suất-chiếu-mới-admin-only) | Thêm suất chiếu mới | Admin only |
| PUT | [`/api/v1/showtimes/:id`](#54-cập-nhật-suất-chiếu-admin-only) | Cập nhật thông tin suất chiếu | Admin only |
| DELETE | [`/api/v1/showtimes/:id`](#55-xóa-suất-chiếu-admin-only) | Xoá suất chiếu | Admin only |

### Booking APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | [`/api/v1/bookings`](#63-lấy-danh-sách-booking-của-user) | Lấy danh sách vé đã đặt của user | Login |
| GET | [`/api/v1/bookings/:id`](#64-lấy-chi-tiết-booking) | Lấy chi tiết vé đã đặt theo id | Login |
| POST | [`/api/v1/bookings`](#61-tạo-booking-khi-chọn-ghế-đầu-tiên) | Tạo booking khi chọn ghế đầu tiên (hoặc update nếu đã có) | Login |
| PATCH | [`/api/v1/bookings/:id/seats`](#62-thêm-bớt-ghế) | Thêm/bớt ghế vào booking hiện có | Login |
| GET | [`/api/v1/bookings/all`](#65-lấy-danh-sách-tất-cả-booking-admin-only) | Lấy danh sách tất cả booking | Admin only |
| GET | [`/api/v1/bookings/revenue`](#66-lấy-tổng-doanh-thu-admin-only) | Lấy tổng doanh thu theo khoảng thời gian | Admin only |
| GET | [`/api/v1/bookings/statistics`](#67-thống-kê-booking-chi-tiết-admin-only) | Thống kê booking chi tiết với các filter | Admin only |

### Payment APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | [`/api/v1/payments`](#71-tạo-order-thanh-toán-zalopay) | Tạo order thanh toán Zalopay từ booking | Login |
| POST | [`/api/v1/payments/callback`](#72-callback-từ-zalopay) | Callback từ Zalopay (Zalopay tự động gọi) | No |

### 1. Authentication APIs

#### 1.1. Đăng ký tài khoản

**Endpoint:** `POST /api/auth/register`

**Authentication:** Không cần

**Mô tả:** API này dùng để đăng ký tài khoản mới.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

#### 1.2. Đăng nhập

**Endpoint:** `POST /api/auth/login`

**Authentication:** Không cần

**Mô tả:** API này dùng để đăng nhập và nhận token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Token này sẽ được lưu lại vào cookie của browser để sử dụng cho các request sau này.

---

### 2. User APIs

#### 2.1. Lấy thông tin tài khoản của mình

**Endpoint:** `GET /api/v1/users/me`

**Authentication:** Required (Login)

**Mô tả:** API này dùng để lấy thông tin tài khoản của chính user đang đăng nhập.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Lưu ý:** Password không được trả về trong response.

---

#### 2.2. Cập nhật thông tin tài khoản

**Endpoint:** `PUT /api/v1/users/me/update`

**Authentication:** Required (Login)

**Mô tả:** API này dùng để cập nhật thông tin tài khoản của chính mình (username và email).

**Lưu ý:**
- Chỉ có thể cập nhật `username` và `email`
- Không thể cập nhật `role` hoặc `password`
- User chỉ có thể cập nhật chính tài khoản của mình (tự động lấy từ token)

**Request Body:**
```json
{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

**Validation:**
- Phải có ít nhất 1 field (username hoặc email)
- Username: 3-15 ký tự, chỉ chứa chữ, số và underscore
- Email: Phải đúng format email
- Username và email phải unique (không trùng với user khác)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "new_username",
    "email": "newemail@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

---

#### 2.3. Xóa tài khoản

**Endpoint:** `DELETE /api/v1/users/me`

**Authentication:** Required (Login)

**Mô tả:** API này dùng để xóa tài khoản của chính mình.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "account deleted successfully"
}
```

---

#### 2.4. Đổi mật khẩu

**Endpoint:** `PUT /api/v1/users/me/password`

**Authentication:** Required (Login)

**Mô tả:** API này dùng để đổi mật khẩu của chính user đang đăng nhập. User phải cung cấp mật khẩu hiện tại để xác thực trước khi đổi sang mật khẩu mới.

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Validation:**
- Tất cả các field (`currentPassword`, `newPassword`, `confirmPassword`) đều bắt buộc
- `newPassword` và `confirmPassword` phải khớp nhau
- `newPassword` phải có độ dài từ 6 đến 20 ký tự

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (400 Bad Request) - Mật khẩu hiện tại sai:**
```json
{
  "success": false,
  "message": "Error changing password",
  "error": "Current password is incorrect"
}
```

**Response (400 Bad Request) - User không tồn tại:**
```json
{
  "success": false,
  "message": "Error changing password",
  "error": "User not found"
}
```

**Response (400 Bad Request) - Validation error:**
```json
{
  "success": false,
  "message": "New password and confirm password do not match"
}
```

---

#### 2.5. Lấy danh sách tất cả tài khoản (Admin only)

**Endpoint:** `GET /api/v1/users/all`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để lấy danh sách tất cả tài khoản trong hệ thống. Chỉ admin mới có quyền truy cập.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "username": "admin_user",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response (403 Forbidden) - User thường cố gắng truy cập:**
```json
{
  "success": false,
  "message": "Forbidden: Admins only"
}
```

**Lưu ý:** Password không được trả về trong response.

---

#### 2.6. Lấy thông tin tài khoản theo id (Admin only)

**Endpoint:** `GET /api/v1/users/all/:id`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để lấy thông tin chi tiết của một tài khoản theo id. Chỉ admin mới có quyền truy cập.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Lưu ý:** Password không được trả về trong response.

---

### 3. Movie APIs

#### 3.1. Lấy danh sách phim

**Endpoint:** `GET /api/v1/movies`

**Authentication:** Không cần

**Mô tả:** API này dùng để lấy danh sách tất cả các phim kèm với điều kiện tương ứng

**Query Parameters:**
- `page` (number, optional): Số trang (mặc định: 1)
- `limit` (number, optional): Số phim mỗi trang (mặc định: 8)
- `status` (string, optional): Trạng thái phim - `now_showing`, `coming_soon`, `ended` (mặc định: `now_showing`)

**Example Request:**
```
GET /api/v1/movies?status=now_showing&page=1&limit=8
```

**Response (200 OK):**
```json
// GET /api/v1/movies?status=now_showing&page=1&limit=8
{
  "success": true,
  "data": {
    "movies": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Inception",
        "minutes": 148,
        "genre": ["Action", "Sci-Fi"],
        "releaseDate": "2010-07-16T00:00:00.000Z",
        "posterImg": "https://example.com/poster.jpg",
        "trailerLink": "https://youtube.com/watch?v=...",
        "description": "A thief who steals corporate secrets...",
        "status": "now_showing"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 8,
      "total": 25,
      "totalPages": 4
    }
  }
}
```

---

#### 3.2. Lấy chi tiết phim

**Endpoint:** `GET /api/v1/movies/:id`

**Mô tả:** API này dùng để lấy chi tiết một bộ phim theo id.

**Authentication:** Không cần

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Inception",
    "minutes": 148,
    "genre": ["Action", "Sci-Fi"],
    "releaseDate": "2010-07-16T00:00:00.000Z",
    "posterImg": "https://example.com/poster.jpg",
    "trailerLink": "https://youtube.com/watch?v=...",
    "description": "A thief who steals corporate secrets...",
    "status": "now_showing"
  }
}
```

---

#### 3.3. Tạo phim mới (Admin only)

**Endpoint:** `POST /api/v1/movies`

**Mô tả:** API này dùng để tạo phim mới (chỉ dành cho admin).

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "title": "Inception",
  "minutes": 148,
  "genre": ["Action", "Sci-Fi"],
  "releaseDate": "2010-07-16",
  "posterImg": "https://example.com/poster.jpg",
  "trailerLink": "https://youtube.com/watch?v=...",
  "description": "A thief who steals corporate secrets...",
  "status": "now_showing"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Inception",
    ...
  }
}
```

---

#### 3.4. Cập nhật phim (Admin only)

**Endpoint:** `PUT /api/v1/movies/:id`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để cập nhật thông tin phim (chỉ dành cho admin).

**Request Body:** (Tương tự như tạo phim, chỉ cần gửi các field muốn cập nhật)

---

#### 3.5. Xóa phim (Admin only)

**Endpoint:** `DELETE /api/v1/movies/:id`

**Mô tả:** API này dùng để xoá phim (chỉ dành cho admin).

**Authentication:** Required (Admin only)

---

### 4. Cinema APIs

#### 4.1. Lấy danh sách rạp

**Endpoint:** `GET /api/v1/cinemas`

**Authentication:** Không cần

**Mô tả:** API này dùng để lấy danh sách tất cả các rạp.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Cinemax Sinh Viên",
      "address": "Nhà văn hóa sinh viên, TP.HCM",
      "rows": 5,
      "columns": 2,
      "seatLayout": [
        {
          "row": "A",
          "seats": ["A1", "A2", "A3", "A4", "A5"]
        },
        {
          "row": "B",
          "seats": ["B1", "B2", "B3", "B4", "B5"]
        }
      ]
    }
  ]
}
```

---

#### 4.2. Lấy chi tiết rạp

**Endpoint:** `GET /api/v1/cinemas/:id`

**Mô tả:** API này dùng để lấy chi tiết một rạp theo id.

**Authentication:** Không cần

---

#### 4.3. Tạo rạp mới (Admin only)

**Endpoint:** `POST /api/v1/cinemas`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để tạo rạp mới kèm với layout ghế (chỉ dành cho admin).

**Request Body:**
```json
{
  "name": "Cinemax Sinh Viên",
  "address": "Nhà văn hóa sinh viên, TP.HCM",
  "rows": 5,
  "columns": 2,
}
```

Layout ghế sẽ tự động được tạo dựa trên `rows` và `columns`.

---

#### 4.4. Cập nhật rạp (Admin only)

**Endpoint:** `PUT /api/v1/cinemas/:id`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để cập nhật thông tin rạp (chỉ dành cho admin).

---

#### 4.5. Xóa rạp (Admin only)

**Endpoint:** `DELETE /api/v1/cinemas/:id`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để xóa rạp (chỉ dành cho admin).

---

### 5. Showtime APIs

#### 5.1. Lấy danh sách suất chiếu

**Endpoint:** `GET /api/v1/showtimes`

**Mô tả:** API này dùng để lấy danh sách tất cả các suất chiếu kèm với điều kiện tương ứng

**Authentication:** Không cần

**Query Parameters:**
- `movieId` (string, optional): Lọc theo phim
- `cinemaId` (string, optional): Lọc theo rạp
- `date` (string, optional): Lọc theo ngày (format: `YYYY-MM-DD`)
- `page` (number, optional): Số trang (mặc định: 1)
- `limit` (number, optional): Số suất chiếu mỗi trang (mặc định: 10)

**Example Request:**
```
GET /api/v1/showtimes?movieId=507f1f77bcf86cd799439011&date=2025-12-25&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "docs": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "startTime": "2025-12-25T18:30:00.000Z",
        "price": 45000,
        "totalSeats": 25,
        "availableSeats": 20,
        "movie": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Inception",
          "minutes": 148,
          "posterImg": "https://example.com/poster.jpg",
          "status": "now_showing"
        },
        "cinema": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Cinemax Sinh Viên",
          "address": "Nhà văn hóa sinh viên, TP.HCM"
        }
      }
    ],
    "totalDocs": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

#### 5.2. Lấy chi tiết suất chiếu (với trạng thái ghế)

**Endpoint:** `GET /api/v1/showtimes/:id`

**Authentication:** Không cần

**Mô tả:** API này dùng để lấy chi tiết một suất chiếu theo id với trạng thái ghế.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "movie": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Inception",
      "minutes": 148,
      "genre": ["Action", "Sci-Fi"],
      "releaseDate": "2010-07-16T00:00:00.000Z",
      "posterImg": "https://example.com/poster.jpg",
      "trailerLink": "https://youtube.com/watch?v=...",
      "description": "...",
      "status": "now_showing"
    },
    "cinema": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Cinemax Sinh Viên",
      "address": "Nhà văn hóa sinh viên, TP.HCM",
      "seatLayout": [...]
    },
    "startTime": "2025-12-25T18:30:00.000Z",
    "price": 45000,
    "totalSeats": 25,
    "availableSeats": 20,
    "seats": [
      {
        "row": "A",
        "number": 1,
        "isBooked": false,
        "status": "available"
      },
      {
        "row": "A",
        "number": 2,
        "isBooked": true,
        "status": "reserved"  // Đang được giữ (pending booking còn hiệu lực)
      },
      {
        "row": "A",
        "number": 3,
        "isBooked": true,
        "status": "booked"    // Đã thanh toán (confirmed)
      }
    ]
  }
}
```

**Trạng thái ghế:**
- `available`: Ghế trống, có thể chọn
- `reserved`: Ghế đang được giữ (có booking pending còn hiệu lực trong 5 phút)
- `booked`: Ghế đã được thanh toán (confirmed)

---

#### 5.3. Tạo suất chiếu mới (Admin only)

**Endpoint:** `POST /api/v1/showtimes`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để tạo suất chiếu mới cho một bộ phim ở 1 rạp nào đó (chỉ dành cho admin).

**Request Body:**
```json
{
  "movieId": "507f1f77bcf86cd799439011",
  "cinemaId": "507f1f77bcf86cd799439012",
  "startTime": "2025-12-25T18:30:00.000Z",
  "price": 45000
}
```

**Lưu ý:** 
- `price` là optional (mặc định: 45000)
- Ghế sẽ tự động được tạo dựa trên `seatLayout` của rạp và được set isBooked = false cho tất cả ghế

---

#### 5.4. Cập nhật suất chiếu (Admin only)

**Endpoint:** `PUT /api/v1/showtimes/:id`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để cập nhật thông tin suất chiếu (chỉ dành cho admin).

---

#### 5.5. Xóa suất chiếu (Admin only)

**Endpoint:** `DELETE /api/v1/showtimes/:id`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để xóa suất chiếu (chỉ dành cho admin).

---

### 6. Booking APIs

#### 6.1. Tạo booking khi chọn ghế đầu tiên

**Endpoint:** `POST /api/v1/bookings`

**Authentication:** Required

**Mô tả:** API này dùng để tạo booking khi user chọn ghế đầu tiên. Booking sẽ có status `pending` và `holdExpiresAt` được set = `now + 5 phút`. 

**Request Body:**
```json
{
  "showtimeId": "507f1f77bcf86cd799439013",
  "seats": [
    { "row": "A", "number": 1 }
  ]
}
```

**Response (201 Created) - Tạo booking mới:**
```json
{
  "success": true,
  "data": {
    "bookingId": "507f1f77bcf86cd799439014",
    "holdExpiresAt": "2025-12-25T10:35:00.000Z",
    "expiresInSeconds": 300,
    "isNewBooking": true,
    "message": "Seats reserved for 5 minutes"
  }
}
```

**Response (201 Created) - Update booking hiện có:**
```json
{
  "success": true,
  "data": {
    "bookingId": "507f1f77bcf86cd799439014",
    "holdExpiresAt": "2025-12-25T10:35:00.000Z",
    "expiresInSeconds": 180,
    "isNewBooking": false,
    "message": "Seats added to existing reservation"
  }
}
```

---

#### 6.2. Thêm/bớt ghế

**Endpoint:** `PATCH /api/v1/bookings/:id/seats`

**Authentication:** Required

**Mô tả:** API này dùng để thêm hoặc bớt ghế vào booking hiện có. Timer **KHÔNG reset** khi update (giữ nguyên `holdExpiresAt` ban đầu).

**Request Body:**
```json
{
  "action": "add",
  "seats": [
    { 
      "row": "A", 
      "number": 2 
    }
  ]
}
```

**Response (200 OK) - Thêm ghế:**
```json
{
  "success": true,
  "data": {
    "bookingId": "507f1f77bcf86cd799439014",
    "holdExpiresAt": "2025-12-25T10:35:00.000Z",
    "expiresInSeconds": 180,
    "message": "Seat added to reservation"
  }
}
```

**Response (200 OK) - Bớt ghế:**
```json
{
  "success": true,
  "data": {
    "bookingId": "507f1f77bcf86cd799439014",
    "holdExpiresAt": "2025-12-25T10:35:00.000Z",
    "expiresInSeconds": 120,
    "message": "Seat removed from reservation"
  }
}
```

**Response (200 OK) - Xóa booking (khi bớt hết ghế):**
```json
{
  "success": true,
  "data": {
    "deleted": true,
    "message": "Reservation cancelled (no seats remaining)"
  }
}
```

---

#### 6.3. Lấy danh sách booking của user

**Endpoint:** `GET /api/v1/bookings`

**Authentication:** Required (Login)

**Mô tả:** API này dùng để lấy danh sách các vé đã đặt của user (và user phải login)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "showtime": {
        "_id": "507f1f77bcf86cd799439013",
        "movie": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Inception",
          "minutes": 148
        },
        "cinema": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Cinemax Sinh Viên",
          "address": "Nhà văn hóa sinh viên, TP.HCM"
        },
        "startTime": "2025-12-25T18:30:00.000Z",
        "price": 45000
      },
      "user": {
        "_id": "507f1f77bcf86cd799439015",
        "username": "john_doe"
      },
      "seat": [
        { "row": "A", "number": 1 },
        { "row": "A", "number": 2 }
      ],
      "totalPrice": 90000,
      "bookedAt": "2025-12-25T10:30:00.000Z"
    }
  ]
}
```

---

#### 6.4. Lấy chi tiết booking

**Endpoint:** `GET /api/v1/bookings/:id`

**Authentication:** Required

**Mô tả:** API này dùng để lấy chi tiết một vé đã đặt theo id.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "user": "john_doe",
    "movie": "Inception",
    "cinema": "Cinemax Sinh Viên",
    "address": "Nhà văn hóa sinh viên, TP.HCM",
    "startTime": "2025-12-25T18:30:00.000Z",
    "totalPrice": 90000,
    "seat": ["A - 1", "A - 2"],
    "quantity": 2,
    "bookedAt": "2025-12-25T10:30:00.000Z"
  }
}
```

---

#### 6.5. Lấy danh sách tất cả booking (Admin only)

**Endpoint:** `GET /api/v1/bookings/all`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để lấy danh sách tất cả booking trong hệ thống. Chỉ admin mới có quyền truy cập.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439014",
      "user": "john_doe",
      "movie": "Inception",
      "cinema": "Cinemax Sinh Viên",
      "address": "Nhà văn hóa sinh viên, TP.HCM",
      "startTime": "2025-12-25T18:30:00.000Z",
      "totalPrice": 90000,
      "seat": ["A - 1", "A - 2"],
      "quantity": 2,
      "status": "confirmed",
      "bookedAt": "2025-12-25T10:30:00.000Z",
      "paidAt": "2025-12-25T10:32:00.000Z",
      "paymentProvider": "zalopay",
      "paymentTransId": "...",
      "paymentMeta": {}
    }
  ]
}
```

---

#### 6.6. Lấy tổng doanh thu (Admin only)

**Endpoint:** `GET /api/v1/bookings/revenue`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để lấy tổng doanh thu từ các booking đã thanh toán (status = 'confirmed') trong một khoảng thời gian.

**Query Parameters:**
- `fromDate` (required): Ngày bắt đầu (format: YYYY-MM-DD)
- `toDate` (required): Ngày kết thúc (format: YYYY-MM-DD)

**Example Request:**
```
GET /api/v1/bookings/revenue?fromDate=2025-01-01&toDate=2025-12-31
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 4500000,
    "fromDate": "2025-01-01T00:00:00.000Z",
    "toDate": "2025-12-31T23:59:59.999Z"
  }
}
```

**Response (400 Bad Request) - Thiếu params:**
```json
{
  "success": false,
  "message": "fromDate and toDate are required (format: YYYY-MM-DD)"
}
```

**Response (400 Bad Request) - Date range không hợp lệ:**
```json
{
  "success": false,
  "message": "fromDate must be less than or equal to toDate"
}
```

**Lưu ý:**
- Chỉ tính các booking có status = 'confirmed' (đã thanh toán)
- Doanh thu được tính dựa trên `totalPrice` của booking
- Thời gian được tính dựa trên `paidAt` (thời gian thanh toán)

---

#### 6.7. Thống kê booking chi tiết (Admin only)

**Endpoint:** `GET /api/v1/bookings/statistics`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để lấy thống kê chi tiết về booking với nhiều filter options. Có thể lọc theo khoảng thời gian, phim, rạp hoặc kết hợp các filter.

**Query Parameters:**
- `fromDate` (required): Ngày bắt đầu (format: YYYY-MM-DD)
- `toDate` (required): Ngày kết thúc (format: YYYY-MM-DD)
- `movieId` (optional): Lọc theo phim (MongoDB ObjectId)
- `cinemaId` (optional): Lọc theo rạp (MongoDB ObjectId)

**Example Requests:**
```
# Thống kê tất cả
GET /api/v1/bookings/statistics?fromDate=2025-01-01&toDate=2025-12-31

# Thống kê theo phim
GET /api/v1/bookings/statistics?fromDate=2025-01-01&toDate=2025-12-31&movieId=507f1f77bcf86cd799439011

# Thống kê theo rạp
GET /api/v1/bookings/statistics?fromDate=2025-01-01&toDate=2025-12-31&cinemaId=507f1f77bcf86cd799439012

# Thống kê theo phim và rạp
GET /api/v1/bookings/statistics?fromDate=2025-01-01&toDate=2025-12-31&movieId=507f1f77bcf86cd799439011&cinemaId=507f1f77bcf86cd799439012
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 4500000,
    "totalBookings": 100,
    "totalTickets": 250,
    "byMovie": [
      {
        "movieId": "507f1f77bcf86cd799439011",
        "movieTitle": "Inception",
        "revenue": 2000000,
        "tickets": 120,
        "bookings": 50
      },
      {
        "movieId": "507f1f77bcf86cd799439012",
        "movieTitle": "Avatar 3",
        "revenue": 1500000,
        "tickets": 80,
        "bookings": 30
      }
    ],
    "byCinema": [
      {
        "cinemaId": "507f1f77bcf86cd799439013",
        "cinemaName": "Cinemax Sinh Viên",
        "revenue": 1800000,
        "tickets": 100,
        "bookings": 40
      },
      {
        "cinemaId": "507f1f77bcf86cd799439014",
        "cinemaName": "CGV Landmark",
        "revenue": 1200000,
        "tickets": 70,
        "bookings": 25
      }
    ],
    "filters": {
      "fromDate": "2025-01-01T00:00:00.000Z",
      "toDate": "2025-12-31T23:59:59.999Z",
      "movieId": null,
      "cinemaId": null
    }
  }
}
```

**Response (200 OK) - Với filter theo phim:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 2000000,
    "totalBookings": 50,
    "totalTickets": 120,
    "byMovie": [
      {
        "movieId": "507f1f77bcf86cd799439011",
        "movieTitle": "Inception",
        "revenue": 2000000,
        "tickets": 120,
        "bookings": 50
      }
    ],
    "byCinema": [
      {
        "cinemaId": "507f1f77bcf86cd799439013",
        "cinemaName": "Cinemax Sinh Viên",
        "revenue": 1200000,
        "tickets": 60,
        "bookings": 25
      }
    ],
    "filters": {
      "fromDate": "2025-01-01T00:00:00.000Z",
      "toDate": "2025-12-31T23:59:59.999Z",
      "movieId": "507f1f77bcf86cd799439011",
      "cinemaId": null
    }
  }
}
```

**Response (400 Bad Request) - Thiếu params:**
```json
{
  "success": false,
  "message": "fromDate and toDate are required (format: YYYY-MM-DD)"
}
```

**Response (400 Bad Request) - Invalid ObjectId:**
```json
{
  "success": false,
  "message": "Invalid movieId format"
}
```

**Lưu ý:**
- Chỉ tính các booking có status = 'confirmed' (đã thanh toán)
- `byMovie` và `byCinema` được sắp xếp theo doanh thu giảm dần
- Có thể kết hợp nhiều filter cùng lúc (movieId + cinemaId)
- Nếu không có dữ liệu, các mảng sẽ trả về rỗng và tổng = 0

---

### 7. Payment APIs

#### 7.1. Tạo order thanh toán Zalopay

**Endpoint:** `POST /api/v1/payments`

**Authentication:** Required

**Mô tả:** Tạo order thanh toán Zalopay từ booking. Booking phải có status `pending` và còn hiệu lực (chưa hết hạn 5 phút). 

**Lưu ý:** Khi user ấn thanh toán, chỉ cần gửi `bookingId`. Backend sẽ tự động lấy toàn bộ ghế từ booking để tạo order thanh toán.

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439014"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "return_code": 1,
    "return_message": "success",
    "order_url": "https://qcgateway.zalopay.vn/openinapp?order=...",
    "order_token": "ACSMARlbXkIzcSCNHDWC_5jA",
    "zp_trans_token": "...",
    "qr_code": "00020101021226520010vn.zalopay..."
  }
}
```

**Lưu ý:**
- Nếu booking đã hết hạn (quá 5 phút), sẽ trả về lỗi và không tạo được order thanh toán
- Frontend sẽ sử dụng `order_url` để chuyển hướng người dùng đến trang thanh toán của ZaloPay.
---

#### 7.2. Callback từ Zalopay

**Endpoint:** `POST /api/v1/payments/callback`

**Authentication:** Không cần (Zalopay tự động gọi, không cần code để gọi tới API này)

**Mô tả:** Endpoint này được Zalopay tự động gọi sau khi thanh toán thành công. Backend sẽ tự động cập nhật booking status thành `confirmed`.

**Request Body (từ Zalopay):**
```json
{
  "data": "{\"app_trans_id\":\"251225_123456\",\"zp_trans_id\":\"...\",\"amount\":90000,...}",
  "mac": "abc123..."
}
```

**Response:**
```json
{
  "return_code": 1,
  "return_message": "success"
}
```

**Lưu ý:** Frontend không cần gọi API này. Đây là webhook từ Zalopay.

Để chạy được, hãy cài `ngrok` [https://ngrok.com/] và lấy token, sau đó sử dụng
```zsh
ngrok http 3000
```

để ngrok có thể chuyển localhost thành địa chỉ public để zalopay có thể callback lại, ae có địa chỉ này thì dán vào .env ở cái ZALOPAY_CALLBACK_URL nhé. Ngoài ra ae có thể sử dụng redirecturl và thêm nó vào trong .env để chuyển hướng người dùng đến trang thanh toán thành công của mình

Tài khoản Zalopay Sandbox để test chuyển khoản VISA: 4111 1111 1111 1111

AE có thể đọc thêm doc của Zalopay tại đây: https://developers.zalopay.vn/v2/general/overview.html

---

### HTTP Status Codes

- `200 OK`: Request thành công
- `201 Created`: Tạo resource thành công
- `400 Bad Request`: Request không hợp lệ (thiếu field, validation error, etc.)
- `401 Unauthorized`: Không có token hoặc token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập (ví dụ: user thường không thể tạo phim)
- `404 Not Found`: Resource không tồn tại
- `500 Internal Server Error`: Lỗi server