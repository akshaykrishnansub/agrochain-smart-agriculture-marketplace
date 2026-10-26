import Product from "../models/Product.js";
const createProduct = async (productData) => {
    return await Product.create(productData);
};
const updateProduct = async (productId, ownerId, productData) => {
    return await Product.findByIdAndUpdate({ _id: productId, ownerId: ownerId, }, productData, { new: true, runValidators: true });
};
const getAllProducts = async () => {
    return await Product.find();
};
const getProductById = async (productId) => {
    return await Product.findById(productId);
};
const deleteProduct = async (productId, ownerId) => {
    return await Product.findOneAndDelete({ _id: productId, ownerId: ownerId });
};
export { createProduct, updateProduct, getAllProducts, deleteProduct, getProductById };
//# sourceMappingURL=productService.js.map