// ========== SUPABASE CONNECTION ==========
const SUPABASE_URL = 'https://gdoekryeodypttosmdrp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkb2Vrcnllb2R5cHR0b3NtZHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzQwNTEsImV4cCI6MjA5ODc1MDA1MX0.IRTIA0yEBPrmaMFl6Iz46aZfSb2gGtTtxnVP_jm2HTA';

const { createClient } = supabase;
const supabaseClient = createClient('https://gdoekryeodypttosmdrp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkb2Vrcnllb2R5cHR0b3NtZHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzQwNTEsImV4cCI6MjA5ODc1MDA1MX0.IRTIA0yEBPrmaMFl6Iz46aZfSb2gGtTtxnVP_jm2HTA');