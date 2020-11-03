const crypto = require('crypto')

module.exports = {
  cryptPassword(password, salt) {
    const hash = crypto.createHmac(
      'sha512',
      salt,
    ) /** Hashing algorithm sha512 */
    hash.update(password)
    const value = hash.digest('base64')
    return {
      salt,
      passwordHash: value,
    }
  },
  genRandomSalt(length) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0, length)
  },
  getNowUnixTimestamp() {
    return Math.round(new Date().getTime() / 1000)
  },
  omit(obj, keys) {
    return Object.keys(obj).reduce((r, i) => {
      if (!keys.include(i)) {
        r[i] = obj[i]
      }
      return r
    }, {})
  },
}
