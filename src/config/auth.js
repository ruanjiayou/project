module.exports = {
  key: AUTH.KEY,
  type: 'JWT',
  alg: 'HS256',
  exp: AUTH.EXP,
  secret: AUTH.SECRET,
  salt: AUTH.SALT
};