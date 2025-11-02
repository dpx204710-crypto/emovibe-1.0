import '../styles/global.css';
import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = useMemo(()=> createClient(SUPABASE_URL, SUPABASE_ANON), [SUPABASE_URL, SUPABASE_ANON]) || null;

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}