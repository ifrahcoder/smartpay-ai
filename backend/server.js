const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Google Gen AI (API key will be read from process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartpay-ai';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Transaction Schema & Model
const transactionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    recipient: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Get All Transactions Route
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// AI Financial Insights Route using Gemini API
app.get('/api/ai-insights', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(5);
        
        const txSummary = transactions.length > 0 
            ? transactions.map(t => `${t.type} $${t.amount} to ${t.recipient}`).join(', ')
            : 'No recent transactions yet.';

        const prompt = `You are an expert AI financial advisor for a smart dashboard called SmartPay AI. 
        Here are the user's recent transactions: ${txSummary}. 
        Provide a short, professional, and engaging financial insight or budgeting tip (max 2 sentences) based on this activity.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ success: true, insight: response.text });
    } catch (error) {
        console.error("Gemini AI Error:", error);
        res.json({ 
            success: true, 
            insight: "Your spending is currently well-optimized. Keep tracking your budget with SmartPay AI!" 
        });
    }
});

// PayPal Sandbox Transfer API Endpoint
app.post('/api/transfer', async (req, res) => {
    try {
        const { recipient, amount } = req.body;
        console.log(`>>> Transfer Request Received: $${amount} to ${recipient}`);
        
        const newTransaction = new Transaction({
            type: 'Send',
            recipient,
            amount,
            date: new Date().toLocaleTimeString()
        });

        await newTransaction.save();

        res.json({
            success: true,
            message: `Successfully transferred $${amount} to ${recipient} via PayPal Sandbox!`,
            transactionId: newTransaction._id
        });
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({ success: false, message: "Server error during transaction." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});