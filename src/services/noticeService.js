import { supabase } from '../lib/supabase'

const tableName = 'notices'

function toNotice(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    priority: item.priority,
    author: item.author,
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
      .select('id, title, description, category, priority, author, date, created_at')
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
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      author: payload.author,
      date: payload.date,
    }

    const { data, error } = await supabase.from(tableName).insert(record).select().single()

    if (error) {
      throw error
    }

    return toNotice(data)
  },
}
