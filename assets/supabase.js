import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const supabase = createClient(
  "https://你的项目ID.supabase.co",
  "你的anon公钥"
);