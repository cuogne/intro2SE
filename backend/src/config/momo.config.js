require('dotenv').config();

const config = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  orderInfo: 'pay with MoMo',
  partnerCode: 'MOMO',
  redirectUrl: process.env.MOMO_REDIRECT_URL, // Frontend redirect URL
  ipnUrl: process.env.MOMO_CALLBACK_URL, // Backend callback URL
  requestType: 'payWithCC', // 'captureWallet' = QR/Wallet; 'payWithCC' = Visa/Master; 'payWithATM' = ATM
  extraData: '',
  orderGroupId: '',
  autoCapture: true,
  lang: 'vi',
};

module.exports = config;