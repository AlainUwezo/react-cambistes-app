import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ikhisdxkxxeyfdchnsjx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlraGlzZHhreHhleWZkY2huc2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MTEyNTQsImV4cCI6MjA1NTQ4NzI1NH0.49QZ6AH7D6OtjlbyvLkgSAeY6uZ9CNbyiLnb_rReb3c";

export const supabase = createClient(supabaseUrl, supabaseKey);
