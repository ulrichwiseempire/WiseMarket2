import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kaxpmfvrjeksrzylsjsa.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtheHBtZnZyamVrc3J6eWxzanNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTgyMTEsImV4cCI6MjEwMDg5NDIxMX0.APYwZG-nO3Id-qgsVtYovq4nq94VHu2vWwwlPcrJyZM";

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
