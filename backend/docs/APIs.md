# API Documentation

## Base URL

```
http://localhost:3000
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
### User APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới (username, email, password) | No |
| POST | `/api/auth/login` | Đăng nhập và nhận token | No |

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
| GET | `/api/v1/showtimes` | Lấy danh sách tất cả suất chiếu<br>Query params: `?movieId=&cinemaId=&date=&page=&limit=` | No |
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
| POST | `/api/v1/bookings/reserve` | Giữ ghế 5 phút | Login |

### Payment APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/payments` | Tạo order thanh toán Zalopay từ booking | Login |
| POST | `/api/v1/payments/callback` | Callback từ Zalopay (Zalopay tự động gọi) | No |

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

### 2. Movie APIs

#### 2.1. Lấy danh sách phim

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

#### 2.2. Lấy chi tiết phim

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

#### 2.3. Tạo phim mới (Admin only)

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

#### 2.4. Cập nhật phim (Admin only)

**Endpoint:** `PUT /api/v1/movies/:id`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để cập nhật thông tin phim (chỉ dành cho admin).

**Request Body:** (Tương tự như tạo phim, chỉ cần gửi các field muốn cập nhật)

---

#### 2.5. Xóa phim (Admin only)

**Endpoint:** `DELETE /api/v1/movies/:id`

**Mô tả:** API này dùng để xoá phim (chỉ dành cho admin).

**Authentication:** Required (Admin only)

---

### 3. Cinema APIs

#### 3.1. Lấy danh sách rạp

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

#### 3.2. Lấy chi tiết rạp

**Endpoint:** `GET /api/v1/cinemas/:id`

**Mô tả:** API này dùng để lấy chi tiết một rạp theo id.

**Authentication:** Không cần

---

#### 3.3. Tạo rạp mới (Admin only)

**Endpoint:** `POST /api/v1/cinemas`

**Authentication:** Required (Admin only)

**Mô tả:** API này dùng để tạo rạp mới kèm với layout ghế (chỉ dành cho admin).

**Request Body:**
```json
{
  "name": "Cinemax Sinh Viên",
  "address": "Nhà văn hóa sinh viên, TP.HCM",
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
```

---

### 4. Showtime APIs

#### 4.1. Lấy danh sách suất chiếu

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

#### 4.2. Lấy chi tiết suất chiếu (với trạng thái ghế)

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

#### 4.3. Tạo suất chiếu mới (Admin only)

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

### 5. Booking APIs

#### 5.1. Giữ ghế 5 phút

**Endpoint:** `POST /api/v1/bookings/reserve`

**Authentication:** Required

**Mô tả:** API này dùng để giữ ghế trong 5 phút. Khi user chọn ghế trên UI, gọi API này để tạo booking với status `pending` và `holdExpiresAt`.

**Request Body:**
```json
{
  "showtimeId": "507f1f77bcf86cd799439013",
  "seats": [
    { "row": "A", "number": 1 },
    { "row": "A", "number": 2 }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "bookingId": "507f1f77bcf86cd799439014",
    "holdExpiresAt": "2025-12-25T10:35:00.000Z",
    "expiresInSeconds": 300,
    "message": "Seats reserved for 5 minutes"
  }
}
```

**Lưu ý quan trọng:**
- Ghế sẽ được giữ trong **5 phút** (300 giây)
- Sau 5 phút, nếu không thanh toán, booking sẽ tự động bị xóa và ghế được giải phóng
- Frontend nên hiển thị countdown timer dựa trên `holdExpiresAt`
- Nếu user muốn thanh toán, sử dụng `bookingId` này để tạo payment order

---

#### 5.2. Tạo booking (Khi user ấn thanh toán)

**Endpoint:** `POST /api/v1/bookings`

**Authentication:** Required

**Mô tả:** API này tạo booking mới với status `pending` và `holdExpiresAt`. Thường được dùng khi user chọn ghế và ấn thanh toán ngay (không qua bước reserve).

**Request Body:**
```json
{
  "showtimeId": "507f1f77bcf86cd799439013",
  "seats": [
    { "row": "A", "number": 1 },
    { "row": "A", "number": 2 }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "showtime": "507f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439015",
    "seat": [
      { "row": "A", "number": 1 },
      { "row": "A", "number": 2 }
    ],
    "totalPrice": 90000,
    "status": "pending",
    "holdExpiresAt": "2025-12-25T10:35:00.000Z",
    "bookedAt": "2025-12-25T10:30:00.000Z"
  }
}
```

---

#### 5.3. Lấy danh sách booking của user

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

#### 5.4. Lấy chi tiết booking

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

### 6. Payment APIs

#### 6.1. Tạo order thanh toán Zalopay

**Endpoint:** `POST /api/v1/payments`

**Authentication:** Required

**Mô tả:** Tạo order thanh toán Zalopay từ booking. Booking phải có status `pending` và còn hiệu lực (chưa hết hạn 5 phút).

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

#### 6.2. Callback từ Zalopay

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

### Flow của API
1. User đăng kí tài khoản và login (POST /api/auth/register và POST /api/auth/login)
2. User chọn phim, rạp, suất chiếu và ghế (GET /api/v1/movies, GET /api/v1/cinemas, GET /api/v1/showtimes)
3. User ấn thanh toán (POST /api/v1/bookings)
4. Backend tạo booking với status `pending` và `holdExpiresAt` (POST /api/v1/bookings)
5. Backend tạo order thanh toán Zalopay (POST /api/v1/payments) và frontend sẽ chuyển hướng người dùng đến trang thanh toán của ZaloPay.
6. User thanh toán và Zalopay sẽ tự động gọi callback tới API này (POST /api/v1/payments/callback)
7. Backend cập nhật booking status thành `confirmed` (POST /api/v1/payments/callback)

### HTTP Status Codes

- `200 OK`: Request thành công
- `201 Created`: Tạo resource thành công
- `400 Bad Request`: Request không hợp lệ (thiếu field, validation error, etc.)
- `401 Unauthorized`: Không có token hoặc token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập (ví dụ: user thường không thể tạo phim)
- `404 Not Found`: Resource không tồn tại
- `500 Internal Server Error`: Lỗi server