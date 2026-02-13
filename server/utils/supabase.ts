import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = () => {
  const config = useRuntimeConfig()

  return createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  )
}
