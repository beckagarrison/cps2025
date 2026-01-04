import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const run = async () => {
  const { data, error } = await supabase
    .from('test_items')
    .select('*')
    .limit(5)

  console.log(data, error)
}

run()

