import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lryfufidcxnxdzglbzgq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWZ1ZmlkY3hueGR6Z2xiemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMjkzNzQsImV4cCI6MjA3NjYwNTM3NH0.2EeB26Ga2F2o9doXEhUORBB9k2YZniH-LQvZ5BZSBeU'
);

export default function CoinSystem() {
  const [userId, setUserId] = useState('');
  const [balance, setBalance] = useState(0);
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let saved = localStorage.getItem('user_id');
    if (!saved) {
      saved = 'user_' + Math.floor(Math.random() * 10000);
      localStorage.setItem('user_id', saved);
    }
    setUserId(saved);
    fetchBalance(saved);
    fetchTransactions();
  }, []);

  async function fetchBalance(id) {
    const { data, error } = await supabase
      .from('users_coins')
      .select('balance')
      .eq('owner_id', id)
      .maybeSingle();

    if (error) console.error(error);
    else if (data) setBalance(data.balance);
    else {
      await supabase.from('users_coins').insert([{ owner_id: id, balance: 100 }]);
      setBalance(100);
    }
  }

  async function fetchTransactions() {
    const { data } = await supabase
      .from('coin_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    setTransactions(data || []);
  }

  async function handleTransfer() {
    if (!target || !amount) return alert('Please fill all fields');
    setLoading(true);

    const amt = parseInt(amount);
    if (amt <= 0) return alert('Invalid amount');

    // Update sender
    await supabase.rpc('update_balance', { user_id: userId, amount_change: -amt });
    // Update receiver
    await supabase.rpc('update_balance', { user_id: target, amount_change: amt });

    // Record transaction
    await supabase.from('coin_transactions').insert([
      { from_id: userId, to_id: target, amount: amt, description: 'Gift' },
    ]);

    fetchBalance(userId);
    fetchTransactions();
    setAmount('');
    setLoading(false);
    alert('Transfer complete!');
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>💰 Virtual Coin Center</h1>
      <div style={styles.card}>
        <p><b>Your ID:</b> {userId}</p>
        <p><b>Balance:</b> 🪙 {balance}</p>
      </div>

      <div style={styles.form}>
        <input
          placeholder="Receiver ID"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleTransfer} style={styles.button} disabled={loading}>
          {loading ? 'Processing...' : 'Send Coins'}
        </button>
      </div>

      <div style={styles.transactions}>
        <h3>Recent Transactions</h3>
        {transactions.map((t) => (
          <div key={t.id} style={styles.txItem}>
            <p>{t.from_id} → {t.to_id}</p>
            <p>🪙 {t.amount}</p>
            <small>{new Date(t.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: 'linear-gradient(to bottom, #fff9e6, #ffedb3)',
    minHeight: '100vh',
    padding: '40px',
    fontFamily: 'Poppins, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: { color: '#f5b400', fontSize: '2em', marginBottom: '20px' },
  card: {
    background: '#fff7d1',
    borderRadius: '10px',
    padding: '15px 25px',
    marginBottom: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '280px',
  },
  input: {
    padding: '10px',
    border: '1px solid #f0c86d',
    borderRadius: '6px',
    outline: 'none',
  },
  button: {
    background: '#ffca28',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  transactions: {
    marginTop: '30px',
    width: '300px',
    background: '#fff6c8',
    borderRadius: '10px',
    padding: '15px',
  },
  txItem: {
    background: '#fff',
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
};
