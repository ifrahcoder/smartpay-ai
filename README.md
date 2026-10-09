# SmartPay AI 🚀
AI-Powered Financial Insights & Intelligent Transactions (Built for the PayPal AI Hackathon)

## 📌 Overview
**SmartPay AI** is a modern fintech application that bridges secure digital payments with advanced artificial intelligence. Built using the MERN stack and integrated with the PayPal Sandbox environment, SmartPay AI not only executes secure financial transfers but also leverages **Google Gemini AI** to analyze spending patterns and generate real-time, personalized financial insights for users.

---

## 🛠️ Tech Stack
* **Frontend**: React, Vite, CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **AI Engine**: Google Gemini API (`@google/genai`)
* **Payment Gateway**: PayPal Sandbox SDK / API

---

## ✨ Key Features
1. **Intelligent Transfers**: Seamlessly send money using PayPal Sandbox integration with automatic balance updates.
2. **MongoDB Data Persistence**: Securely store and retrieve all transaction records and balance history.
3. **Gemini AI Smart Insights**: Real-time analysis of user transaction behavior to provide customized budgeting and financial recommendations.
4. **Interactive Dashboard**: Clean, responsive UI showing total balances, recent transactions, and AI-generated insights.

---

## 🚀 Getting Started & Installation

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/ifrahcoder/smartpay-ai.git](https://github.com/ifrahcoder/smartpay-ai.git)
cd smartpay-ai
cd backend
npm install
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartpay-ai
GEMINI_API_KEY=your_google_gemini_api_key_here
node server.js
cd frontend
npm install
npm run dev
Hackathon Submission Details
Event: PayPal AI Hackathon

Developer: ifrahcoder
git add README.md
git commit -m "Add project README.md for hackathon submission"
git push origin main


