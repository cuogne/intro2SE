Ở đây t có làm 2 cái thanh toán là ZaloPay và Momo

### ZaloPay:

- Tạo order thanh toán ZaloPay dựa theo booking đã tạo: `POST /api/v1/payments/zalopay` với body `{ "bookingId": "id_booking" }`

Response trả về:
```json
{
  "success": true,
  "data": {
    "return_code": 1,
    "return_message": "Giao dịch thành công",
    "sub_return_code": 1,
    "sub_return_message": "Giao dịch thành công",
    "zp_trans_token": "AC6errMMzrYAXtb_zCA2kXyw",
    "order_url": "https://qcgateway.zalopay.vn/openinapp?order=eyJ6cHRyYW5zdG9rZW4iOiJBQzZlcnJNTXpyWUFYdGJfekNBMmtYeXciLCJhcHBpZCI6MjU1M30=",
    "cashier_order_url": "https://onelink.zalopay.vn/pay-order?order=eyJ6cHRyYW5zdG9rZW4iOiJBQzZlcnJNTXpyWUFYdGJfekNBMmtYeXciLCJhcHBpZCI6MjU1M30=",
    "order_token": "AC6errMMzrYAXtb_zCA2kXyw",
    "qr_code": "00020101021226530010vn.zalopay01061800050203001031816357958197287719338620010A00000072701320006970454011899ZP26002O021728580208QRIBFTTA5204739953037045405300005802VN6304DECA"
  }
}
```

Trong đó có phần `order_url` là link để redirect người dùng tới trang thanh toán của ZaloPay. Bên Frontend sẽ nhận được link này và thực hiện redirect người dùng tới trang thanh toán.

Trong .env có 1 trường là `ZALOPAY_REDIRECT_URL` là link frontend sẽ redirect về sau khi thanh toán xong. (Tức là cái trang frontend sẽ hiện kết quả thanh toán cho người dùng xem)

Trường `ZALOPAY_CALLBACK_URL` là link backend ZaloPay sẽ gọi về để thông báo kết quả thanh toán.
Cái này thì sẽ không dùng localhost được mà tụi bây phải dùng 1 cái ngrok: [https://ngrok.com/](https://ngrok.com/).

Mỗi khi chạy sẽ chạy 2 lệnh là `ngrok http 3000` và `npm run dev` để chạy server backend.
Trong ngrok sẽ cung cấp cho tụi bây 1 cái link kiểu như `https://tyron-ungradated-tina.ngrok-free.dev`, thì cái link này sẽ thay cho cái `localhost:3000` thường thấy.

Ví dụ để callback url zalopay thì sẽ là `https://tyron-ungradated-tina.ngrok-free.dev/api/v1/payments/zalopay/callback` thay vì là `http://localhost:3000/api/v1/payments/zalopay/callback` (Phải chạy cái này thì database mới được cập nhật trạng thái thanh toán thành công được).

Cái này thì mỗi máy khác nhau nên tụi bây tự chạy ngrok lấy link rồi điền vào .env.

ZaloPay thì giờ nó bị lỗi qq gì đó ko biết, bữa test còn chạy + quét QR + chuyển khoản được mà giờ thì ko được nữa, nên xuống Momo test v (nhma vẫn để tính năng thanh toán cho ZaloPay luôn nhma ko click vô được vậy).

### Momo:

Momo thì cũng tương tự ZaloPay:
`POST /api/v1/payments/momo` với body `{ "bookingId": "id_booking" }`

Response:
```json
{
  "partnerCode": "MOMO",
  "orderId": "MOMO1767354253392",
  "requestId": "MOMO1767354253392",
  "amount": 30000,
  "responseTime": 1767354253904,
  "message": "Thành công.",
  "resultCode": 0,
  "payUrl": "https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3xNT01PMTc2NzM1NDI1MzM5Mg&s=e751e568ba8ed9aa492a8d1fcaaf8cf1957996ec17b4003b3422c874930376be"
}
```

cái `payUrl` là link để redirect người dùng tới trang thanh toán của Momo.

Vì hiện tại cái QR để quét thanh toán Momo t không dùng Momo UAT quét được nên tụi bây có test thì dùng nhập thẻ Visa/Master để test.

NAME: NGUYEN VAN A	
STK: 5200 0000 0000 1096	
CARD EXPDATE: 05/26	
CVC: 111

Thì ở đây cũng có 2 cái trong .env là `MOMO_REDIRECT_URL` (frontend redirect url) và `MOMO_CALLBACK_URL` (backend callback url) tương tự ZaloPay vậy. Cũng phải dùng ngrok để chạy cái callback url này.