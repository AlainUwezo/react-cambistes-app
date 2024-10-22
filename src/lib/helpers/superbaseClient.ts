import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://knodovsrxyqnicxrivyu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtub2RvdnNyeHlxbmljeHJpdnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzMjA0NDMsImV4cCI6MjA0NDg5NjQ0M30.M6jDXtJHehaGur_MgUjLF8zEF3oIg3inkXPfIKXeooE";

export const supabase = createClient(supabaseUrl, supabaseKey);
