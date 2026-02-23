const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const prisma = require('../db');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// In-memory session store for conversational state
const sessions = {};

// Helper to send WhatsApp messages
async function sendMsg(to, body) {
    try {
        await client.messages.create({
            from: TWILIO_WHATSAPP_NUMBER,
            to,
            body
        });
    } catch (err) {
        console.error('Twilio Send Error:', err.message);
    }
}

// Webhook endpoint receiver
router.post('/', async (req, res) => {
    const incomingMsg = req.body.Body.trim();
    const fromNumber = req.body.From; // format: "whatsapp:+1234567890"

    // Standardize phone string format
    const phone = fromNumber.replace('whatsapp:', '');

    let user = await prisma.user.findUnique({ where: { phone } });
    let state = sessions[fromNumber] || { step: 'IDLE' };

    if (incomingMsg.toLowerCase() === 'hi' || incomingMsg.toLowerCase() === 'hello') {
        state = { step: 'IDLE' }; // reset
        sessions[fromNumber] = state;

        let reply = `Welcome to Goodmilk 🥛\n\n`;
        if (!user) reply += `*Please register on our website to access full features!*\n\n`;

        reply += `What would you like to do?\n1️⃣ Place Order\n2️⃣ Start Subscription\n3️⃣ View My Orders\n4️⃣ Pause Delivery\n5️⃣ Resume Delivery\n6️⃣ Check Bill`;
        await sendMsg(fromNumber, reply);
        return res.type('text/xml').send('<Response></Response>');
    }

    // Handle flow logic placeholder
    if (state.step === 'IDLE') {
        if (incomingMsg === '1') {
            sessions[fromNumber] = { step: 'ORDER_PRODUCT' };
            await sendMsg(fromNumber, `Select product:\n1. Cow Milk\n2. Buffalo Milk\n3. Toned Milk`);
        } else if (incomingMsg === '3') {
            if (!user) {
                await sendMsg(fromNumber, `Please register on website first.`);
            } else {
                const orders = await prisma.order.findMany({ where: { userId: user.id }, take: 3, orderBy: { createdAt: 'desc' } });
                let txt = `Your recent orders:\n\n`;
                orders.forEach(o => { txt += `ID: ${o.id.substring(0, 6)}\nProduct: ${o.product}\nQty: ${o.quantity}L\nStatus: ${o.status}\n\n` });
                await sendMsg(fromNumber, txt || "No recent orders.");
            }
        } else {
            await sendMsg(fromNumber, `I didn't understand that. Type 'Hi' to start over.`);
        }
    } else if (state.step === 'ORDER_PRODUCT') {
        const products = { '1': 'Cow Milk', '2': 'Buffalo Milk', '3': 'Toned Milk' };
        if (!products[incomingMsg]) {
            await sendMsg(fromNumber, `Invalid. Type 1, 2, or 3.`);
        } else {
            sessions[fromNumber].product = products[incomingMsg];
            sessions[fromNumber].step = 'ORDER_QTY';
            await sendMsg(fromNumber, `Enter quantity (liters):`);
        }
    } else if (state.step === 'ORDER_QTY') {
        const qty = parseInt(incomingMsg);
        if (isNaN(qty) || qty <= 0) {
            await sendMsg(fromNumber, `Please enter a valid number.`);
        } else {
            sessions[fromNumber].qty = qty;

            try {
                await prisma.order.create({
                    data: {
                        userId: user ? user.id : undefined,
                        phone: phone,
                        product: sessions[fromNumber].product,
                        quantity: qty,
                        deliveryDate: new Date(Date.now() + 86400000), // Tomorrow
                        source: 'WHATSAPP'
                    }
                });

                await sendMsg(fromNumber, `✅ Order Confirmed\nProduct: ${sessions[fromNumber].product}\nQty: ${qty}L\nDelivery: Tomorrow`);
            } catch (e) {
                await sendMsg(fromNumber, `Error placing order. Please try again.`);
            }
            sessions[fromNumber] = { step: 'IDLE' };
        }
    }

    res.type('text/xml').send('<Response></Response>');
});

module.exports = router;
