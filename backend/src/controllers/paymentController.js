import Product from "../models/Product.js";
import stripe from "../config/stripe.js";
export const createCheckoutSessionController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const { productId, quantity } = req.body;
        if (typeof productId !== "string" || !productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Valid product ID and quantity are required" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.price <= 0 || !Number.isFinite(product.price)) {
            return res.status(400).json({ message: "Product price is invalid" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Insufficient Stock" });
        }
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity
                },
            ],
            metadata: {
                buyerId: req.user.userId,
                productId: product._id.toString(),
                quantity: quantity.toString()
            },
            success_url: `${frontendUrl}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/checkout?payment=cancelled`,
        });
        return res.status(200).json({ url: session.url });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
//# sourceMappingURL=paymentController.js.map