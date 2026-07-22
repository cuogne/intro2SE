const redis = require('../config/redis.config')

const HOLD_TTL = 300

const holdKey = (showtimeId) => `hold:${showtimeId}`

const holdSeat = async (showtimeId, row, number, userId) => {
  const key = holdKey(showtimeId)
  await redis.hset(key, { [`${row}-${number}`]: String(userId) })
  await redis.expire(key, HOLD_TTL)
}

const releaseSeat = async (showtimeId, row, number) => {
  const key = holdKey(showtimeId)
  await redis.hdel(key, `${row}-${number}`)
}

const releaseSeats = async (showtimeId, seats) => {
  if (!seats || seats.length === 0) return
  const key = holdKey(showtimeId)
  const fields = seats.map(s => `${s.row}-${s.number}`)
  await redis.hdel(key, ...fields)
}

const isSeatHeld = async (showtimeId, row, number) => {
  const key = holdKey(showtimeId)
  const holder = await redis.hget(key, `${row}-${number}`)
  return holder || null
}

const getHeldSeatsForShowtime = async (showtimeId) => {
  const key = holdKey(showtimeId)
  const all = await redis.hgetall(key)
  if (!all || Object.keys(all).length === 0) return {}
  return all
}

const getUserHeldSeats = async (showtimeId, userId) => {
  const all = await getHeldSeatsForShowtime(showtimeId)
  const userIdStr = userId ? String(userId) : null
  const seats = []
  for (const [seatKey, holder] of Object.entries(all)) {
    if (String(holder) === userIdStr) {
      const [row, number] = seatKey.split('-')
      seats.push({ row, number: parseInt(number) })
    }
  }
  return seats
}

const refreshHold = async (showtimeId, userId) => {
  const key = holdKey(showtimeId)
  const ttl = await redis.ttl(key)
  if (ttl > 0 && ttl < 60) {
    await redis.expire(key, HOLD_TTL)
  }
}

module.exports = {
  holdSeat,
  releaseSeat,
  releaseSeats,
  isSeatHeld,
  getHeldSeatsForShowtime,
  getUserHeldSeats,
  refreshHold,
  HOLD_TTL,
}
