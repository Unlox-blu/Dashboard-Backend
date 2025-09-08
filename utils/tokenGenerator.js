const crypto = require('crypto');

function generateResetToken() {
  const token = crypto.randomBytes(20).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

module.exports = generateResetToken;
