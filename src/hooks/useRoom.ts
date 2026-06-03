import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Room } from '../types'

export type RoomState =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
  | { status: 'ok'; room: Room }

export function useRoom(roomId: string | undefined): RoomState {
  const [state, setState] = useState<RoomState>({ status: 'loading' })

  useEffect(() => {
    if (!roomId) { setState({ status: 'not_found' }); return }

    setState({ status: 'loading' })
    supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setState({ status: 'not_found' })
        else setState({ status: 'ok', room: data as Room })
      })
  }, [roomId])

  return state
}
