import { SupabaseClient } from "@supabase/supabase-js";
import 'dotenv/config'; 

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

export const Supabase = new SupabaseClient(supabaseUrl, supabaseKey);