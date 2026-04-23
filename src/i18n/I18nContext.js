import { createContext } from 'react'
import { LANGUAGES } from './strings.js'

export const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  languages: LANGUAGES,
})
