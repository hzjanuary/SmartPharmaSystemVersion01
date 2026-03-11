const db = require('../config/db');

const productController = {
    // 1. TẠO SẢN PHẨM MỚI (CREATE)
    create: async (req, res) => {
        try {
            const { 
                product_name, category_id, supplier_id, unit, 
                purchase_price, selling_price, quantity, expiry_date, image, description 
            } = req.body;

            const sql = `INSERT INTO product 
                (product_name, category_id, supplier_id, unit, purchase_price, selling_price, quantity, expiry_date, image, description) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const [result] = await db.query(sql, [
                product_name, category_id, supplier_id, unit, 
                purchase_price, selling_price, quantity || 0, expiry_date, image, description
            ]);

            res.status(201).json({ message: "Thêm sản phẩm thành công!", productId: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 2. LẤY DANH SÁCH SẢN PHẨM (READ) - Kèm theo tên danh mục và nhà cung cấp
    read: async (req, res) => {
        try {
            const sql = `
                SELECT p.*, c.category_name, s.supplier_name 
                FROM product p
                LEFT JOIN product_category c ON p.category_id = c.category_id
                LEFT JOIN supplier s ON p.supplier_id = s.supplier_id
                ORDER BY p.created_at DESC
            `;
            const [rows] = await db.query(sql);
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 3. CẬP NHẬT SẢN PHẨM (UPDATE)
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                product_name, category_id, supplier_id, unit, 
                purchase_price, selling_price, quantity, expiry_date, image, description 
            } = req.body;

            const sql = `UPDATE product SET 
                product_name = ?, category_id = ?, supplier_id = ?, unit = ?, 
                purchase_price = ?, selling_price = ?, quantity = ?, 
                expiry_date = ?, image = ?, description = ? 
                WHERE product_id = ?`;

            const [result] = await db.query(sql, [
                product_name, category_id, supplier_id, unit, 
                purchase_price, selling_price, quantity, expiry_date, image, description, id
            ]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật!" });
            }

            res.status(200).json({ message: "Cập nhật sản phẩm thành công!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 4. XÓA SẢN PHẨM (DELETE)
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // Lưu ý: Nếu sản phẩm đã có trong hóa đơn nhập/xuất, việc xóa có thể bị lỗi do ràng buộc khóa ngoại (Foreign Key)
            const [result] = await db.query('DELETE FROM product WHERE product_id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
            }

            res.status(200).json({ message: "Đã xóa sản phẩm thành công!" });
        } catch (error) {
            // Kiểm tra lỗi ràng buộc khóa ngoại (ví dụ sản phẩm đã bán không được xóa)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ message: "Không thể xóa sản phẩm này vì đã có dữ liệu nhập/xuất kho liên quan!" });
            }
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productController;