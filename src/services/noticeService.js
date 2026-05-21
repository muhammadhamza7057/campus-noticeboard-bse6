import { supabase } from '../lib/supabase'

const tableName = 'notices'

function toNotice(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.body,
    body: item.body,
    category: item.category,
    author: item.author ?? item.profiles?.display_name ?? 'Campus User',
    userId: item.user_id,
    date: item.date ?? item.created_at ?? new Date().toISOString(),
  }
}

export const noticeService = {
  list: async (fallbackNotices = []) => {
    if (!supabase) {
      return fallbackNotices
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('id, title, body, category, created_at, user_id, profiles:profiles(id, display_name, email)')
      .order('created_at', { ascending: false })

    if (error) {
      return fallbackNotices
    }

    return (data ?? []).map(toNotice)
  },
  create: async (payload) => {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }

    const record = {
      title: payload.title,
      body: payload.description,
      category: payload.category,
      user_id: payload.userId,
    }

    const { data, error } = await supabase.from(tableName).insert(record).select().single()

    if (error) {
      throw error
    }

    return toNotice(data)
  },
}
