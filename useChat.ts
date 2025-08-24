import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { ChatSession, ChatMessage } from '@/lib/supabase'

interface SendMessageData {
  message: string
  sessionId?: string
  aiProvider?: string
}

export function useChat() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (data: SendMessageData) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          action: 'send_message',
          message: data.message,
          sessionId: data.sessionId,
          aiProvider: data.aiProvider || 'openai'
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const getChatSessions = useCallback(async (): Promise<ChatSession[]> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          action: 'get_sessions'
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data || []
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const getChatMessages = useCallback(async (sessionId: string): Promise<ChatMessage[]> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          action: 'get_messages',
          sessionId
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data || []
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  return {
    sendMessage,
    getChatSessions,
    getChatMessages,
    loading,
    error
  }
}