import { useEffect, useState } from 'react'
import { noticeService } from '../services/noticeService'

export function useNotices(seedNotices) {
  const [notices, setNotices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadNotices = async () => {
      setIsLoading(true)

      try {
        const data = await noticeService.list(seedNotices)

        if (isMounted) {
          setNotices(data)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadNotices()

    return () => {
      isMounted = false
    }
  }, [seedNotices])

  const addNotice = async (notice) => {
    const savedNotice = await noticeService.create(notice)

    setNotices((current) => [savedNotice, ...current])
  }

  return { notices, isLoading, addNotice }
}
