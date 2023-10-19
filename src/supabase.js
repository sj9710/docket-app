
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qrhgfgimvtgmamoigdyr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyaGdmZ2ltdnRnbWFtb2lnZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2ODcxNTYsImV4cCI6MjAxMzI2MzE1Nn0.nbvj-vsDWJLg-95W3EZ1wRNPezpfeucYM0uHrEXq_WM'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;