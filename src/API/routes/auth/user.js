const userAuthRoute = global.$BLLs.AuthUser;

module.exports = {
    'use /users/*': userAuthRoute.auth,
    'post /auth/user/sign-in': userAuthRoute.signIn,
    'post /auth/user/sign-up': userAuthRoute.signUp,
    'post /auth/user/refresh-token': userAuthRoute.refreshToken,
    'post /auth/user/forgot-password': userAuthRoute.varifyEmail,
    'post /auth/user/reset-password': userAuthRoute.resetPassword,
    'post /auth/user/change-password': userAuthRoute.forgotPassword
};