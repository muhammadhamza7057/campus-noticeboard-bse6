import { supabase } from '../lib/supabase'

const googleProviderDisabledMessage =
  'Google sign-in is not enabled in Supabase yet. Enable the provider first.'

function normalizeAuthError(error) {
  const message = error?.message ?? ''

  if (
    error?.error_code === 'validation_failed' &&
    /Unsupported provider/i.test(message)
  ) {
    return new Error(googleProviderDisabledMessage)
  }

  if (/provider is not enabled/i.test(message) || /unsupported provider/i.test(message)) {
    return new Error(googleProviderDisabledMessage)
  }

  return error instanceof Error ? error : new Error(message || 'Authentication failed')
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw error
  }

  return data
}

export async function signUpWithEmail({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    throw error
  }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: data.user.email,
      display_name: displayName || data.user.user_metadata?.display_name || '',
    })
  }

  return data
}

export async function signInWithGoogle() {
  const redirectTo = window.location.origin

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: 'select_account',
        },
      },
    })

    if (error) {
      throw normalizeAuthError(error)
    }

    return data
  } catch (error) {
    throw normalizeAuthError(error)
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}
