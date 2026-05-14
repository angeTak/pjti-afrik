import { createClient } from '@supabase/supabase-js';

// Configuration avec la bonne clé Anon
const supabaseUrl = 'https://mgaurbjzclovyianituf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYXVyYmp6Y2xvdnlpYW5pdHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTY3NDEsImV4cCI6MjA5MjUzMjc0MX0.U25623CaKAy1H0CJk9hlEww0lqyZEgSjbYwPdCdkz2E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
