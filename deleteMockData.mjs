import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mgaurbjzclovyianituf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYXVyYmp6Y2xvdnlpYW5pdHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTY3NDEsImV4cCI6MjA5MjUzMjc0MX0.U25623CaKAy1H0CJk9hlEww0lqyZEgSjbYwPdCdkz2E';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function deleteMock() {
  console.log("Deleting mock data...");

  // Delete mock teams
  const { error: teamError } = await supabase
    .from('teams')
    .delete()
    .in('name', ['Alpha Cyber', 'RoboTech Togo']);

  if (teamError) {
    console.error("Error deleting teams:", teamError);
  } else {
    console.log("Mock teams deleted.");
  }

  // Delete mock registrations
  const { error: regError } = await supabase
    .from('registrations')
    .delete()
    .in('parent_name', ['Jean Dupont', 'Marie Curie', 'Paul Pogba', 'Sarah Connor', 'Test']);

  if (regError) {
    console.error("Error deleting registrations:", regError);
  } else {
    console.log("Mock registrations deleted.");
  }

  console.log("Cleanup complete!");
}

deleteMock();
