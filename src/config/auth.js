module.exports = {
  key: AUTH_KEY,
  type: 'JWT',
  alg: 'HS256',
  exp: AUTH_EXP,
  secret: AUTH_SECRET,
  salt: AUTH_SALT
};