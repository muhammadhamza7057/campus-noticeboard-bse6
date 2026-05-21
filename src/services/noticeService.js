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
      return toNotice({
        id: crypto.randomUUID(),
        title: payload.title,
        body: payload.description,
        category: payload.category,
        user_id: payload.userId,
        created_at: new Date().toISOString(),
      })
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
  update: async (payload) => {
    const record = {
      title: payload.title,
      body: payload.description,
      category: payload.category,
      user_id: payload.userId,
    }

    if (!supabase) {
      return toNotice({
        id: payload.id,
        title: record.title,
        body: record.body,
        category: record.category,
        user_id: record.user_id,
        created_at: payload.date ?? new Date().toISOString(),
      })
    }

    const { data, error } = await supabase
      .from(tableName)
      .update(record)
      .eq('id', payload.id)
      .select('id, title, body, category, created_at, user_id, profiles:profiles(id, display_name, email)')
      .single()

    if (error) {
      throw error
    }

    return toNotice(data)
  },
  remove: async (noticeId) => {
    if (!supabase) {
      return true
    }

    const { error } = await supabase.from(tableName).delete().eq('id', noticeId)

    if (error) {
      throw error
    }

    return true
  },
}
