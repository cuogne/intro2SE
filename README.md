## Intro2SE - Movie Ticket System

### Tổng quan
Project "Movie Ticket System" là một hệ thống quản lý vé xem phim trực tuyến, cho phép người dùng dễ dàng đặt vé, chọn chỗ ngồi và thanh toán trực tuyến. Hệ thống cung cấp giao diện thân thiện, giúp người dùng tìm kiếm các bộ phim yêu thích, xem lịch chiếu và lựa chọn rạp phù hợp.

### Tech:
- Frontend: React Typescript, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT, bcryptjs
- Payment Gateway: ZaloPay và Momo

### Cài đặt và chạy project
1. Clone repository:

```zsh
git clone https://github.com/cuogne/intro2SE.git
```

2. Cài đặt dependencies cho cả frontend và backend:

```zsh
cd intro2SE

cd frontend
npm install

cd ../backend
npm install
```

3. Cài ngrok [https://ngrok.com/] để tạo public URL cho callback payment:

4. Chạy ngrok để tạo public URL cho callback payment:

```zsh
ngrok http 3000
```

> Port phải giống với port backend server đang chạy (mặc định là 3000)

Ngrok sẽ cung cấp một URL công khai ở phần `Forwarding` (ví dụ: `https://your.ngrok-free.dev`), bạn cần sử dụng URL này để cập nhật các biến môi trường `ZALOPAY_CALLBACK_URL` và `MOMO_CALLBACK_URL` trong file `.env` của backend.

5. Setup .env cho backend:

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```zsh
PORT=3000                   # hoặc 1 port nào khác
MONGO_URI=YOUR_MONGO_URI    # có thể là mongodb local hoặc atlas
JWT_SECRET=your_jwt_secret_key
ZALOPAY_CALLBACK_URL={https://your.ngrok-free.dev}/api/v1/payments/zalopay/callback
MOMO_CALLBACK_URL={https://your.ngrok-free.dev}/api/v1/payments/momo/callback
ZALOPAY_REDIRECT_URL=http://localhost:5173/success
MOMO_REDIRECT_URL=http://localhost:5173/success
```

4. Chạy ngrok (mở terminal mới):

```zsh
ngrok http 3000
```

5. Chạy backend server:

```zsh
cd backend
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

6. Chạy frontend (mở terminal mới):

```zsh
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`