import Stripe from "stripe";
import stripe from "../config/stripe.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
export const stripeWebhookController = async (req, res) => {
    //verify signature
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
        return res.status(400).json({ message: "Missing stripe signature or webhook secret" });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    }
    catch (err) {
        console.error("Stripe signature verification failed", err);
        return res.status(400).json({ message: "Invalid webhook signature" });
    }
    //check payment status
    if (event.type !== "checkout.session.completed") {
        return res.status(200).json({ received: true });
    }
    const checkoutSession = event.data.object;
    if (checkoutSession.payment_status !== "paid") {
        return res.status(200).json({ received: true });
    }
    //Destructuring safely when no metadata is present
    const { buyerId, productId, quantity: quantityString } = checkoutSession.metadata ?? {};
    const quantity = Number(quantityString);
    if (!checkoutSession.id || !buyerId || !productId || !Number.isInteger(quantity) || quantity < 1 || !mongoose.isValidObjectId(buyerId) || !mongoose.isValidObjectId(productId)) {
        return res.status(400).json("Invalid checkout session metadata");
    }
    const mongoSession = await mongoose.startSession();
    try {
        await mongoSession.withTransaction(async () => {
            const existingOrder = await Order.findOne({
                stripeSessionId: checkoutSession.id
            }).session(mongoSession);
            if (existingOrder) {
                return;
            }
            const product = await Product.findOneAndUpdate({
                _id: productId,
                stock: { $gte: quantity }
            }, {
                $inc: { stock: -quantity }
            }, {
                new: true,
                session: mongoSession
            });
            if (!product) {
                throw new Error("Product not found or insufficient stock");
            }
            await Order.create([{
                    buyerId,
                    productId,
                    quantity,
                    totalPrice: checkoutSession.amount_total / 100,
                    status: "CONFIRMED",
                    paymentStatus: "PAID",
                    paymentInfo: {
                        provider: "stripe",
                        paymentIntentId: typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : null
                    },
                    stripeSessionId: checkoutSession.id
                }], { session: mongoSession });
        });
        return res.status(200).json({ received: true });
    }
    catch (err) {
        console.error("Stripe webhook processing failed", err);
        return res.status(500).json({ message: "Webhook processing failed" });
    }
    finally {
        await mongoSession.endSession();
    }
};
//# sourceMappingURL=stripeWebhookController.js.map