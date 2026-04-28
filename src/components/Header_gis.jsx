import { useEffect, useRef, useState } from 'react'

const HEADER_TONES = [
  { id: 'mist', label: 'Mist' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'mint', label: 'Mint' },
  { id: 'sunset', label: 'Sunset' },
]

export default function HeaderGis({ t, lang, setLang, languages, theme = 'white', setTheme }) {
  const headerRef = useRef(null)
  const [headerTone, setHeaderTone] = useState(() => {
    try {
      return localStorage.getItem('msme-header-tone') || 'mist'
    } catch {
      return 'mist'
    }
  })
  const [logoMotion, setLogoMotion] = useState(() => {
    try {
      return localStorage.getItem('msme-logo-motion') !== 'off'
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('msme-header-tone', headerTone)
    } catch {
      /* ignore */
    }
  }, [headerTone])

  useEffect(() => {
    try {
      localStorage.setItem('msme-logo-motion', logoMotion ? 'on' : 'off')
    } catch {
      /* ignore */
    }
  }, [logoMotion])

  useEffect(() => {
    const el = headerRef.current
    if (!el || typeof document === 'undefined') return

    const syncHeaderHeight = () => {
      const next = Math.max(70, Math.ceil(el.getBoundingClientRect().height))
      document.documentElement.style.setProperty('--header-h', `${next}px`)
    }

    syncHeaderHeight()
    window.addEventListener('resize', syncHeaderHeight)

    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => syncHeaderHeight())
      ro.observe(el)
    }

    return () => {
      window.removeEventListener('resize', syncHeaderHeight)
      if (ro) ro.disconnect()
    }
  }, [lang, t])

  return (
    <header id="appHeader" ref={headerRef} data-tone={headerTone}>
      <div className="brand">
        <div className={`logo-shell ${logoMotion ? 'is-live' : ''}`}>
          <img
            className={`hepc-logo ${logoMotion ? 'is-animated' : ''}`}
            src="/hepc-logo.png"
            width={128}
            height={52}
            alt="HEPC"
          />
        </div>
        <div className="brand-text">
          <h1>{t('title')}</h1>
          <div className="sub">{t('tagline')}</div>
        </div>
      </div>

      <nav className="app-nav" aria-label="Session and language">
        <div className="header-controls">
          <div className="header-auth">
            <span className="user-pill" id="headerUserName">
              {/* {t('userDisplay')} */}
              {t("Harsac")}
            </span>
          </div>

          <div className="lang-block">
            <label className="lang-label">
              <span className="visually-hidden">{t('language')}</span>
              <select
                className="lang-select"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label={t('language')}
              >
                {(languages || []).map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="header-tone-switcher" role="group" aria-label="Header tone">
            <span className="header-tone-label">Tone</span>
            {HEADER_TONES.map((tone) => (
              <button
                key={tone.id}
                type="button"
                className={`header-tone-swatch ${headerTone === tone.id ? 'active' : ''}`}
                data-tone-id={tone.id}
                title={`Header: ${tone.label}`}
                aria-pressed={headerTone === tone.id}
                onClick={() => setHeaderTone(tone.id)}
              />
            ))}
          </div>

          <div className="ui-theme-switcher" role="group" aria-label="UI theme">
            <button
              type="button"
              className={`ui-theme-btn ${theme === 'white' ? 'active' : ''}`}
              aria-pressed={theme === 'white'}
              onClick={() => setTheme && setTheme('white')}
            >
              White
            </button>
            <button
              type="button"
              className={`ui-theme-btn ${theme === 'black' ? 'active' : ''}`}
              aria-pressed={theme === 'black'}
              onClick={() => setTheme && setTheme('black')}
            >
              Black
            </button>
          </div>

          {/* <button
            type="button"
            className="logo-motion-btn"
            aria-pressed={logoMotion}
            onClick={() => setLogoMotion((s) => !s)}
            title="Toggle logo animation"
          >
            {logoMotion ? 'Motion on' : 'Motion off'}
          </button> */}
        </div>
        <div className="header-links">
          <a href="#" onClick={(e) => e.preventDefault()}>
            {t('navResources')}
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            {t('navSupport')}
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            {/* {t('navPolicies')} */}
            Logout
          </a>
          
        </div>
      </nav>
    </header>
  )
}
