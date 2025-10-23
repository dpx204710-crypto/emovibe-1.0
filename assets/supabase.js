// assets/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://lryfufidcxnxdzglbzgq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWZ1ZmlkY3hueGR6Z2xiemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMjkzNzQsImV4cCI6MjA3NjYwNTM3NH0.2EeB26Ga2F2o9doXEhUORBB9k2YZniH-LQvZ5BZSBeU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)