import { createContext } from 'react'
import { LANGUAGES } from './strings.js'

export const InContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  languages: LANGUAGES,
})
