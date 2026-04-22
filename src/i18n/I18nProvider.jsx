import { useCallback, useEffect, useMemo, useState } from 'react'
import { I18nContext } from './I18nContext.js'
import { LANGUAGES, t as translate } from './strings.js'

export function I18nProvider({ children }) {
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

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
