## Intro2SE - Movie Ticket System
⚙️ Hướng dẫn cài đặt & Khởi chạy
Quy trình chạy ứng dụng này bao gồm hai phần độc lập: Backend (Server API) và Frontend (Ứng dụng React).

Bước 1: Khởi động Backend Server
Ứng dụng Frontend không thể hoạt động nếu Backend không chạy trên cổng 3000.

Mở Terminal mới và di chuyển tới thư mục chứa mã nguồn Backend (ví dụ: cd backend).

Cài đặt thư viện: Chạy npm install.

Kiểm tra file .env (tạo nếu không có): Đảm bảo file chứa các biến môi trường quan trọng:
PORT=
MONGO_URI=
JWT_SECRET=

Chạy lệnh:
npm start
# Hoặc node index.js

Đảm bảo server báo: 
+ Server is running on port 3000 
+ Connected to MongoDB.

Bước 2: Khởi động Frontend App
Mở Terminal khác và di chuyển tới thư mục Frontend (ví dụ: cd frontend).

Cài đặt thư viện: Chạy npm install.

Chạy ứng dụng: 
npm run dev

Truy cập trình duyệt tại địa chỉ: http://localhost:5173