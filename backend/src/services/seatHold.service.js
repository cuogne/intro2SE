const redis = require('../config/redis.config');

const HOLD_TTL = 300;

const holdKey = (showtimeId) => `hold:${showtimeId}`;

const serializeHold = (userId) =>
  JSON.stringify({
    userId: String(userId),
    expiresAt: Date.now() + HOLD_TTL * 1000,
  });

const parseHold = (value) => {
  try {
    const parsed = JSON.parse(value);
    if (parsed && parsed.userId && Number.isFinite(parsed.expiresAt)) {
      return parsed;
    }
  } catch (error) {
    // Values written before timestamp-based holds are plain user IDs.
  }

  return { userId: value, expiresAt: null };
};

const holdSeat = async (showtimeId, row, number, userId) => {
  const key = holdKey(showtimeId);
  await redis.hset(key, { [`${row}-${number}`]: serializeHold(userId) });
};

const releaseSeat = async (showtimeId, row, number) => {
  const key = holdKey(showtimeId);
  await redis.hdel(key, `${row}-${number}`);
};

const releaseSeats = async (showtimeId, seats) => {
  if (!seats || seats.length === 0) return;
  const key = holdKey(showtimeId);
  const fields = seats.map((s) => `${s.row}-${s.number}`);
  await redis.hdel(key, ...fields);
};

const isSeatHeld = async (showtimeId, row, number) => {
  const key = holdKey(showtimeId);
  const field = `${row}-${number}`;
  const raw = await redis.hget(key, field);
  if (!raw) return null;

  const hold = parseHold(raw);
  if (hold.expiresAt !== null && hold.expiresAt <= Date.now()) {
    await redis.hdel(key, field);
    return null;
  }

  return hold.userId;
};

const getHeldSeatsForShowtime = async (showtimeId) => {
  const key = holdKey(showtimeId);
  const all = await redis.hgetall(key);
  if (!all || Object.keys(all).length === 0) return {};

  const activeHolds = {};
  const expiredFields = [];
  for (const [seatKey, raw] of Object.entries(all)) {
    const hold = parseHold(raw);
    if (hold.expiresAt !== null && hold.expiresAt <= Date.now()) {
      expiredFields.push(seatKey);
    } else {
      activeHolds[seatKey] = hold.userId;
    }
  }

  if (expiredFields.length > 0) {
    await redis.hdel(key, ...expiredFields);
  }

  return activeHolds;
};

const getUserHeldSeats = async (showtimeId, userId) => {
  const all = await getHeldSeatsForShowtime(showtimeId);
  const userIdStr = userId ? String(userId) : null;
  const seats = [];
  for (const [seatKey, holder] of Object.entries(all)) {
    if (String(holder) === userIdStr) {
      const [row, number] = seatKey.split('-');
      seats.push({ row, number: parseInt(number) });
    }
  }
  return seats;
};

const refreshHold = async (showtimeId, userId) => {
  // Each seat owns its expiry timestamp; never refresh the whole hash.
  return getUserHeldSeats(showtimeId, userId);
};

module.exports = {
  holdSeat,
  releaseSeat,
  releaseSeats,
  isSeatHeld,
  getHeldSeatsForShowtime,
  getUserHeldSeats,
  refreshHold,
  HOLD_TTL,
};
