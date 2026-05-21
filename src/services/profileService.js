import { supabase } from '../lib/supabase'

export async function updateProfile({ userId, email, displayName }) {
  const updates = {
    id: userId,
    email,
    display_name: displayName,
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(updates)
    .select('id, email, display_name')
    .single()

  if (error) {
    throw error
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      display_name: displayName,
    },
  })

  if (authError) {
    throw authError
  }

  return data
}