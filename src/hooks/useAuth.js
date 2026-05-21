import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const refreshProfile = async () => {
    const { data } = await supabase.auth.getSession()
    const currentUser = data.session?.user ?? null

    if (!currentUser) {
      setProfile(null)
      return null
    }

    const displayName = currentUser.user_metadata?.display_name ?? currentUser.email
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .eq('id', currentUser.id)
      .maybeSingle()

    const nextProfile =
      profileData ?? {
        id: currentUser.id,
        email: currentUser.email,
        display_name: displayName,
      }

    setProfile(nextProfile)
    return nextProfile
  }

  useEffect(() => {
    let isMounted = true

    const ensureProfile = async (currentUser) => {
      if (!currentUser) {
        return null
      }

      const displayName = currentUser.user_metadata?.display_name ?? currentUser.email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email, display_name')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (existingProfile) {
        return existingProfile
      }

      const { data: upsertedProfile } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          email: currentUser.email,
          display_name: displayName,
        })
        .select('id, email, display_name')
        .single()

      return upsertedProfile ?? { id: currentUser.id, email: currentUser.email, display_name: displayName }
    }

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      const currentSession = data.session ?? null

      if (!isMounted) {
        return
      }

      setSession(currentSession)
      setIsAuthLoading(false)

      if (currentSession?.user) {
        const profileData = await ensureProfile(currentSession.user)

        if (isMounted) {
          setProfile(profileData)
        }
      }
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, nextSession) => {
      if (!isMounted) {
        return
      }

      setSession(nextSession)

      if (nextSession?.user) {
        const profileData = await ensureProfile(nextSession.user)

        if (isMounted) {
          setProfile(profileData)
        }
      } else if (isMounted) {
        setProfile(null)
      }

      if (isMounted) {
        setIsAuthLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    profile,
    user: session?.user ?? null,
    isSignedIn: Boolean(session?.user),
    isAuthLoading,
    refreshProfile,
  }
}
