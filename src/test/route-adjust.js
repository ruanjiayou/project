const adjustor = require('../API/libs/adjustor');
const routes = [
    { type: 'use', path: '/users/*', handle: null },
    { type: 'use', path: '/*', handle: null },
    { type: 'get', path: '/', handle: null },
    { type: 'use', path: '/admin/articles/:id([0-9]+)', handle: null },
    { type: 'post', path: '/auth/user/sign-in', handle: null },
    { type: 'post', path: '/auth/user/sign-up', handle: null },
    { type: 'get', path: '/users', handle: null },
    { type: 'use', path: '/admin/*', handle: null },
    { type: 'get', path: '/users/self', handle: null },
    { type: 'get', path: '/images', handle: null },
    { type: 'get', path: '/images/:imageId([0-9]+)', handle: null },
    { type: 'post', path: '/images/:imageId([0-9]+)', handle: null },
    { type: 'put', path: '/images/:imageId([0-9]+)', handle: null },
    { type: 'delete', path: '/images/:imageId([0-9]+)', handle: null }
];

console.log(adjustor(routes));