import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../services/productService.js";
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, images, certifications, stock } = req.body;
        if (!name || !description || price === undefined || !category || stock === undefined) {
            return res.status(400).json({ message: 'Name,Description,price,stock and category are required' });
        }
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const product = await createProduct({
            name,
            description,
            price,
            category,
            images,
            certifications,
            ownerId: req.user.userId,
            stock
        });
        return res.status(201).json({ message: 'Product created successfully', product });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};
export const getProductByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ product });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication Required' });
        }
        const product = await updateProduct(id, req.user.userId, req.body);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product updated successfully', product });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getAllProductsController = async (req, res) => {
    try {
        const products = await getAllProducts();
        return res.status(200).json({ products });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication Required' });
        }
        const product = await deleteProduct(id, req.user.userId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
//# sourceMappingURL=productController.js.map