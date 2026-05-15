import { useContext } from 'react'
import { InContext } from './InContext.js'

export function useIn() {
  return useContext(InContext)
}
