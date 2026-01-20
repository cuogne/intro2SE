const CryptoJS = require('crypto-js');
const moment = require('moment'); // npm install moment
const zalopayConfig = require('../config/zalopay.config');
const momoConfig = require('../config/momo.config');
const Booking = require('../models/booking.model');
const axios = require('axios');
require('dotenv').config();

// read more: https://developers.zalopay.vn/v2/general/overview.html

// appid|app_trans_id|appuser|amount|apptime|embeddata|item
// const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
// order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
const createMac = (data, key1) => {
    const dataString = data.app_id + '|' + data.app_trans_id + '|' + data.app_user + '|' + data.amount + '|' +
        data.app_time + '|' + data.embed_data + '|' + data.item;

    return CryptoJS.HmacSHA256(dataString, key1).toString();
};

const createMomoSignature = (accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId, requestType, secretKey) => {
    const rawSignature =
        'accessKey=' + accessKey +
        '&amount=' + amount +
        '&extraData=' + extraData +
        '&ipnUrl=' + ipnUrl +
        '&orderId=' + orderId +
        '&orderInfo=' + orderInfo +
        '&partnerCode=' + partnerCode +
        '&redirectUrl=' + redirectUrl +
        '&requestId=' + requestId +
        '&requestType=' + requestType;

    return CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);
}

// Tạo order Zalopay từ booking
const createZalopayOrder = async (bookingId) => {

    // truy van booking de lay thong tin
    const booking = await Booking.findById(bookingId)
        .populate({
            path: 'showtime',
            select: 'startTime price',
            populate: [
                { path: 'movie', select: 'title' },
                { path: 'cinema', select: 'name' }
            ]
        })
        .populate('user', 'username');

    if (!booking) {
        throw new Error('Booking not found');
    }

    if (booking.status === 'confirmed') {
        throw new Error('Booking already paid');
    }

    if (booking.status === 'pending') {
        const now = new Date();
        if (booking.holdExpiresAt && booking.holdExpiresAt <= now) {
            throw new Error('Booking has expired. Please select seats again.');
        }
    }

    if (!booking.showtime || !booking.showtime.movie || !booking.showtime.cinema) {
        throw new Error('Booking data is incomplete. Please ensure showtime, movie, and cinema are populated.');
    }

    const amount = booking.totalPrice; // tong tien can thanh toan
    const movieTitle = booking.showtime.movie.title || 'Phim'
    const cinemaName = booking.showtime.cinema.name || 'Rạp chiếu phim'
    const startTime = moment(booking.showtime.startTime).format('HH:mm DD/MM/YYYY');

    const items = JSON.stringify([{
        itemid: bookingId.toString(),
        itemname: `Vé xem phim: ${movieTitle}`,
        itemcinema: `Rạp: ${cinemaName}`,
        itemstarttime: `Suất chiếu: ${startTime}`,
        itemprice: amount,
        itemquantity: 1
    }]);

    const description = `Thanh toán vé xem phim - ${movieTitle} tại ${cinemaName} - Suất chiếu: ${startTime}`.trim();

    const redirectUrlBase = process.env.ZALOPAY_REDIRECT_URL || 'https://facebook.com';
    const redirectUrl = redirectUrlBase.includes('?')
        ? `${redirectUrlBase}&bookingId=${bookingId}`
        : `${redirectUrlBase}?bookingId=${bookingId}`;

    const embed_data = {
        //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
        redirecturl: redirectUrl,
    };

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: parseInt(zalopayConfig.app_id),
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: booking.user._id.toString(),
        app_time: Date.now(), // milliseconds
        item: items,
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        description: description,
        bank_code: '', // để trống sẽ ra nhiều lựa chọn thanh toán, còn để zalopayapp nó ra mỗi QR
        //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
        //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
        callback_url: zalopayConfig.callbackUrl
    };

    order.mac = createMac(order, zalopayConfig.key1);

    try {
        const result = await axios.post(zalopayConfig.endpoint, null,
            { params: order }
        );

        if (result.data && result.data.return_code === 1) {
            booking.paymentTransId = order.app_trans_id;
            booking.paymentProvider = 'zalopay';
            booking.paymentMeta = {
                orderToken: result.data.order_token,
                zpTransToken: result.data.zp_trans_token
            };
            await booking.save();
        }

        return result.data;
    }
    catch (error) {
        throw new Error('Error creating Zalopay order: ' + error.message);
    }
};

const createMomoOrder = async (bookingId) => {
    const booking = await Booking.findById(bookingId)
        .populate({
            path: 'showtime',
            select: 'startTime price',
            populate: [
                { path: 'movie', select: 'title' },
                { path: 'cinema', select: 'name' }
            ]
        })
        .populate('user', 'username');

    if (!booking) throw new Error('Booking not found');
    if (booking.status === 'confirmed') throw new Error('Booking already paid');

    // Create Momo Order
    const partnerCode = momoConfig.partnerCode;
    const accessKey = momoConfig.accessKey;
    const secretKey = momoConfig.secretKey;
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = `Thanh toán vé ${booking.showtime.movie.title}`;
    const redirectUrl = `${momoConfig.redirectUrl}?bookingId=${bookingId}`;
    const ipnUrl = momoConfig.ipnUrl;
    const amount = booking.totalPrice; // Number
    const requestType = momoConfig.requestType;
    // Encode bookingId into extraData to persist through redirect
    const extraDataObj = { bookingId: bookingId.toString() };
    const extraData = Buffer.from(JSON.stringify(extraDataObj)).toString('base64');
    const lang = 'vi';

    const signature = createMomoSignature(
        accessKey, amount.toString(), extraData, ipnUrl, orderId, orderInfo,
        partnerCode, redirectUrl, requestId, requestType, secretKey
    );

    const requestBody = {
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount, // Send as Number
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: momoConfig.autoCapture,
        extraData: extraData,
        orderGroupId: momoConfig.orderGroupId,
        signature: signature
    };

    try {
        const result = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (result.data && result.data.resultCode === 0) {
            booking.paymentTransId = orderId;
            booking.paymentProvider = 'momo';
            booking.paymentMeta = {
                requestId: requestId,
                payUrl: result.data.payUrl
            };
            await booking.save();
        }

        return result.data;
    } catch (error) {
        if (error.response) {
            console.error('Momo API Error Response:', error.response.data);
            throw new Error(`Error creating Momo order: ${JSON.stringify(error.response.data)}`);
        }
        throw new Error('Error creating Momo order: ' + error.message);
    }
};

const handleCallback = async (dataStr, reqMac) => {
    try {
        let mac = CryptoJS.HmacSHA256(dataStr, zalopayConfig.key2).toString();

        if (reqMac !== mac) {
            console.error('Invalid MAC in callback');
            return {
                return_code: -1,
                return_message: "mac not equal"
            };
        }

        const callbackData = JSON.parse(dataStr);
        const booking = await Booking.findOne({
            paymentTransId: callbackData.app_trans_id
        }).populate('showtime user');

        if (!booking) {
            console.error('Booking not found for app_trans_id:', callbackData.app_trans_id);
            return { return_code: 0, return_message: 'booking not found' };
        }

        // Chặn callback trùng
        if (booking.status !== 'pending') {
            console.log('Booking already processed, status:', booking.status);
            return { return_code: 1, return_message: 'already processed' };
        }

        // Check thanh toán thành công
        if (!callbackData.zp_trans_id) {
            console.error('Payment failed, no zp_trans_id in callback');
            return { return_code: 0, return_message: 'payment failed - no transaction id' };
        }

        // Check số tiền
        if (callbackData.amount !== booking.totalPrice) {
            console.error('Amount mismatch:', {
                bookingAmount: booking.totalPrice,
                callbackAmount: callbackData.amount
            });
            throw new Error('Amount mismatch');
        }

        // Cập nhật booking thành công
        booking.status = 'confirmed';
        booking.paidAt = new Date();
        booking.paymentMeta = {
            ...booking.paymentMeta,
            provider: 'ZALOPAY',
            zpTransId: callbackData.zp_trans_id,
            callbackTime: new Date()
        };

        await booking.save();
        console.log("thanh toan thanh cong")

        return { return_code: 1, return_message: 'success' };

    } catch (error) {
        console.error('❌ Error processing callback:', error);
        console.error('Stack trace:', error.stack);
        return { return_code: 0, return_message: error.message };
    }
};


const handleMomoCallback = async (callbackData) => {
    try {
        const {
            partnerCode, orderId, requestId, amount, orderInfo,
            orderType, transId, resultCode, message, payType,
            responseTime, extraData, signature
        } = callbackData;

        // Verify signature
        const accessKey = momoConfig.accessKey;
        const secretKey = momoConfig.secretKey;
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

        const generatedSignature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

        if (signature !== generatedSignature) {
            console.error('Invalid Momo signature');
            return { statusCode: 400, message: "Invalid signature" };
        }

        if (resultCode === 0) {
            const booking = await Booking.findOne({ paymentTransId: orderId });
            if (!booking) {
                return { statusCode: 404, message: 'Booking not found' };
            }

            if (booking.status !== 'confirmed') {
                booking.status = 'confirmed';
                booking.paidAt = new Date();
                booking.paymentMeta = {
                    ...booking.paymentMeta,
                    provider: 'MOMO',
                    momoTransId: transId,
                    callbackTime: new Date()
                };
                await booking.save();
            }
        }

        return { statusCode: 204 };
    } catch (error) {
        console.error('Momo callback error:', error);
        return { statusCode: 500, message: error.message };
    }
};

module.exports = {
    createZalopayOrder,
    handleCallback,
    createMomoOrder,
    handleMomoCallback
};
