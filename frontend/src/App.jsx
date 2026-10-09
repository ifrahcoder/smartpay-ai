import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck, Sparkles, Activity, X } from 'lucide-react';

function App() {
  const [balance, setBalance] = useState(4850.75);
  const [insights, setInsights] = useState("Loading AI financial insights...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions and AI insights on component load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Transactions
      const txRes = await fetch('http://127.0.0.1:5000/api/transactions');
      const txData = await txRes.json();
      if (txData.success) {
        setTransactions(txData.transactions);
      }

      // Fetch AI Insights
      const aiRes = await fetch('http://127.0.0.1:5000/api/ai-insights');
      const aiData = await aiRes.json();
      if (aiData.success) {
        setInsights(aiData.insight);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      alert("Please enter a valid amount greater than 0!");
      return;
    }
    if (numAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount: numAmount })
      });
      const data = await response.json();

      if (data.success) {
        setBalance(balance - numAmount);
        await fetchData(); // Refresh transactions and AI insights

        setRecipient('');
        setAmount('');
        setIsModalOpen(false);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Transaction failed! Ensure backend server is running on port 5000.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', padding: '2rem', position: 'relative' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>SmartPay AI</h1>
          <p style={{ color: '#4b5563', margin: '4px 0 0 0' }}>AI-Powered Financial Insights & Intelligent Transactions</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e0e7ff', padding: '8px 16px', borderRadius: '9999px', color: '#3730a3', fontWeight: '500' }}>
          <ShieldCheck size={20} />
          <span>PayPal Sandbox Active</span>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Balance Card */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#4b5563', fontWeight: '500' }}>Total Balance</span>
            <Wallet style={{ color: '#4f46e5' }} />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>${balance.toLocaleString()}</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{ flex: 1, backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '500' }}
            >
              <ArrowUpRight size={18} /> Send
            </button>
            <button style={{ flex: 1, backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '500' }}>
              <ArrowDownLeft size={18} /> Request
            </button>
          </div>
        </div>

        {/* AI Financial Insights Card (Powered by Gemini) */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderLeft: '4px solid #4f46e5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Sparkles style={{ color: '#4f46e5' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Gemini AI Smart Insights</h3>
          </div>
          <p style={{ color: '#4b5563', lineHeight: '1.5', margin: 0 }}>{insights}</p>
        </div>

      </div>

      {/* Recent Transactions & Actions */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} /> Recent Transactions (MongoDB + PayPal Sandbox)
        </h3>
        {transactions.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No transactions yet. Click "Send" to test a transfer!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.map((tx) => (
              <div key={tx._id || tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Sent to {tx.recipient}</span>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{tx.date}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#dc2626' }}>-${tx.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Money Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Send Money (PayPal Sandbox)</h3>
            <form onSubmit={handleSendMoney} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>Recipient Email or Name</label>
                <input 
                  type="text" 
                  value={recipient} 
                  onChange={(e) => setRecipient(e.target.value)} 
                  placeholder="e.g. john@example.com" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>Amount ($)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="0.00" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
                />
              </div>
              <button 
                type="submit" 
                style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}
              >
                Confirm Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;