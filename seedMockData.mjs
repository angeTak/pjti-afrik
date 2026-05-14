import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mgaurbjzclovyianituf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYXVyYmp6Y2xvdnlpYW5pdHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTY3NDEsImV4cCI6MjA5MjUzMjc0MX0.U25623CaKAy1H0CJk9hlEww0lqyZEgSjbYwPdCdkz2E';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log("Seeding mock data...");

  // 1. Create Registrations
  const mockRegistrations = [
    { parent_name: 'Jean Dupont', phone: '90001122', email: 'jean@example.com', city: 'Lomé', child_name: 'Lucas Dupont', age_group: '11-14', school_level: '6ème', status: 'registered', amount_paid: 50000, installments_paid: 1 },
    { parent_name: 'Marie Curie', phone: '90002233', email: 'marie@example.com', city: 'Kara', child_name: 'Leo Curie', age_group: '15-18', school_level: '2nde', status: 'registered', amount_paid: 50000, installments_paid: 1 },
    { parent_name: 'Paul Pogba', phone: '90003344', email: 'paul@example.com', city: 'Sokodé', child_name: 'Amine Pogba', age_group: '11-14', school_level: '5ème', status: 'registered', amount_paid: 50000, installments_paid: 1 },
    { parent_name: 'Sarah Connor', phone: '90004455', email: 'sarah@example.com', city: 'Lomé', child_name: 'John Connor', age_group: '15-18', school_level: '1ère', status: 'registered', amount_paid: 50000, installments_paid: 1 },
  ];

  const { data: insertedRegs, error: regError } = await supabase.from('registrations').insert(mockRegistrations).select();
  if (regError) {
    console.error("Error inserting registrations:", regError);
    return;
  }
  console.log(`Inserted ${insertedRegs.length} registrations.`);

  // 2. Create Teams
  const mockTeams = [
    {
      name: 'Alpha Cyber',
      description: 'Un projet innovant de cybersécurité pour protéger les mots de passe des étudiants.',
      captain_id: insertedRegs[0].id,
      member_ids: [insertedRegs[0].id, insertedRegs[1].id],
      is_published: true,
      total_points: 0
    },
    {
      name: 'RoboTech Togo',
      description: 'Création d\'un robot autonome capable de trier les déchets recyclables dans les écoles.',
      captain_id: insertedRegs[2].id,
      member_ids: [insertedRegs[2].id, insertedRegs[3].id],
      is_published: true,
      total_points: 0
    }
  ];

  const { data: insertedTeams, error: teamError } = await supabase.from('teams').insert(mockTeams).select();
  if (teamError) {
    console.error("Error inserting teams:", teamError);
    return;
  }
  console.log(`Inserted ${insertedTeams.length} teams.`);

  // 3. Update Settings to open votes
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const { error: settingsError } = await supabase.from('settings').update({
    vote_start_date: now.toISOString(),
    vote_end_date: nextWeek.toISOString(),
  }).eq('id', 1); // Assuming row id 1

  if (settingsError) {
    console.error("Error updating settings:", settingsError);
  } else {
    console.log("Updated settings to open votes.");
  }

  console.log("Seeding complete!");
}

seed();
