import { useCallback, useEffect, useMemo, useState } from 'react'
import { InContext } from './InContext.js'
import { LANGUAGES, t as translate } from './strings.js'

export function InProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('msme-lang') || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('msme-lang', lang)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((key) => translate(lang, key), [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      languages: LANGUAGES,
    }),
    [lang, t],
  )

  return <InContext.Provider value={value}>{children}</InContext.Provider>
}
