import React, { createContext, useContext, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import type { AuthModel } from 'pocketbase'

interface AuthContextType {
  user: AuthModel | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<void>
  logout: () => void
  updateCredentials: (data: {
    email?: string
    password?: string
    oldPassword?: string
    name?: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthModel | null>(pb.authStore.model)
  const [token, setToken] = useState<string | null>(pb.authStore.token)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Escuta mudanças no authStore
    const unsubscribe = pb.authStore.onChange((newToken, model) => {
      setToken(newToken)
      setUser(model)
    })

    // Checa validade do token existente
    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => {
          pb.authStore.clear()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, pass: string) => {
    await pb.collection('users').authWithPassword(email, pass)
    setUser(pb.authStore.model)
    setToken(pb.authStore.token)
  }

  const updateCredentials = async (data: {
    email?: string
    password?: string
    oldPassword?: string
    name?: string
  }) => {
    if (!pb.authStore.record?.id) {
      throw new Error('Nenhum usuário logado.')
    }
    const updatePayload: Record<string, any> = {}
    if (data.name) updatePayload.name = data.name
    if (data.email) updatePayload.email = data.email
    if (data.password) {
      updatePayload.password = data.password
      updatePayload.passwordConfirm = data.password
      if (data.oldPassword) {
        updatePayload.oldPassword = data.oldPassword
      }
    }
    const updated = await pb.collection('users').update(pb.authStore.record.id, updatePayload)
    setUser(updated)
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
