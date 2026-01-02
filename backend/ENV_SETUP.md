# Cấu hình môi trường (.env)

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
# Server Port
PORT=3000

# MongoDB Connection String
# Local MongoDB: mongodb://localhost:27017/movie-ticket-system
# MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGO_URI=mongodb://localhost:27017/movie-ticket-system

# JWT Secret for authentication (có thể dùng bất kỳ chuỗi nào)
JWT_SECRET=your_super_secret_jwt_key_here

# ZaloPay Configuration (tùy chọn, chỉ cần nếu dùng thanh toán)
ZALOPAY_APP_ID=your_zalopay_app_id
ZALOPAY_KEY1=your_zalopay_key1
ZALOPAY_KEY2=your_zalopay_key2
ZALOPAY_ENDPOINT=https://sandbox.zalopay.com.vn/v001/tpe/createorder
ZALOPAY_CALLBACK_URL=http://localhost:3000/api/v1/payments/callback
ZALOPAY_REDIRECT_URL=http://localhost:5173/payment-success
```

## Hướng dẫn nhanh:

1. Tạo file `.env` trong thư mục `backend`
2. Copy nội dung trên vào file
3. Thay đổi `MONGO_URI` thành connection string của MongoDB của bạn
4. Thay đổi `JWT_SECRET` thành một chuỗi bí mật bất kỳ

## MongoDB Local:
Nếu bạn đã cài MongoDB local, dùng:
```
MONGO_URI=mongodb://localhost:27017/movie-ticket-system
```

## MongoDB Atlas (Cloud):
Nếu dùng MongoDB Atlas, lấy connection string từ dashboard và paste vào:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

