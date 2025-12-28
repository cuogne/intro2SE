const CryptoJS = require('crypto-js');
const moment = require('moment'); // npm install moment
const zalopayConfig = require('../config/zalopay.config');
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

    const embed_data = {
        //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
        redirecturl: process.env.ZALOPAY_REDIRECT_URL || 'https://facebook.com',
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
        bank_code: 'zalopayapp', // để trống thì sẽ thanh toán thêm mấy cái khác
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

module.exports = {
    createZalopayOrder,
    handleCallback
};
