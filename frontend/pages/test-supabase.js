// frontend/pages/test-supabase.js
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export default function TestSupabase() {
  const [status, setStatus] = useState('Connecting...')

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY
    )
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*').limit(1)
        if (error && error.code === 'PGRST301') {
          setStatus('✅ Connected (table not found, but Supabase works)')
        } else if (error) {
          setStatus('⚠️ Connected, but query error: ' + error.message)
        } else {
          setStatus('✅ Connected! Users count: ' + (data?.length || 0))
        }
      } catch (err) {
        setStatus('❌ Connection failed: ' + err.message)
      }
    }
    testConnection()
  }, [])

  return (
    <div style={{ padding: 50 }}>
      <h1>Supabase Connection Test</h1>
      <p>{status}</p>
    </div>
  )
}
