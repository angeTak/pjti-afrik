import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mgaurbjzclovyianituf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYXVyYmp6Y2xvdnlpYW5pdHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTY3NDEsImV4cCI6MjA5MjUzMjc0MX0.U25623CaKAy1H0CJk9hlEww0lqyZEgSjbYwPdCdkz2E';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSupabase() {
  console.log("Testing Supabase connection...");
  
  const tables = ['settings', 'registrations', 'teams', 'news', 'partners', 'gallery', 'partnership_requests'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error fetching from ${table}:`, error.message);
    } else {
      console.log(`Success fetching from ${table}. Rows: ${data.length}`);
      if (data.length > 0) {
        console.log(`Sample from ${table}:`, data[0]);
      }
    }
  }
}

testSupabase();
