const authRouter = require('./auth');
const productRouter = require('./product');

function route(app) {
    // Sau này có thêm route sản phẩm, hóa đơn... thì thêm vào đây
    app.use('/api/auth', authRouter);
    app.use('/api/product', productRouter);
    
    // Ví dụ: app.use('/api/products', productRouter);
}

module.exports = route;