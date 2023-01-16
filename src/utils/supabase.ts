import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://pubtrgqgfzizxxyawohm.supabase.co',
  `${import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1YnRyZ3FnZnppenh4eWF3b2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM4Njc2NzAsImV4cCI6MTk4OTQ0MzY3MH0.VdcDXBK8lKT7whaa0kB3Z2YwS6RPYH2Rs1dIoQgEBCo}`
);

export default supabase;
