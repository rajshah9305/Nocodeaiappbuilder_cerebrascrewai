import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { ApiKey } from '@/lib/supabase'

interface AddApiKeyData {
  provider: string
  apiKey: string
  keyName: string
}

export function useApiKeys() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addApiKey = useCallback(async (data: AddApiKeyData) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('api-key-management', {
        body: {
          action: 'add',
          provider: data.provider,
          apiKey: data.apiKey,
          keyName: data.keyName
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

  const updateApiKey = useCallback(async (keyId: string, data: Partial<AddApiKeyData>) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('api-key-management', {
        body: {
          action: 'update',
          keyId,
          ...data
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

  const deleteApiKey = useCallback(async (keyId: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('api-key-management', {
        body: {
          action: 'delete',
          keyId
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

  const listApiKeys = useCallback(async (): Promise<ApiKey[]> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('api-key-management', {
        body: {
          action: 'list'
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
    addApiKey,
    updateApiKey,
    deleteApiKey,
    listApiKeys,
    loading,
    error
  }
}