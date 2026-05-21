import { getFrontendRuntimeConfig } from "../../services/apiUrlService.js"
import { MSME_MAP_SERVICE_KEYS, setHsacggmMapServiceUrls } from "./arcgisMapServiceUrls.js"

const cache = {
  loaded: false,
  loadingPromise: null,
  lastResult: null,
}

function missingKeysFromMap(mapServices) {
  return MSME_MAP_SERVICE_KEYS.filter((key) => !String(mapServices?.[key] || "").trim())
}

export async function loadMapServiceUrlsFromBackend() {
  if (cache.loaded && cache.lastResult) {
    return cache.lastResult
  }
  if (cache.loadingPromise) {
    return cache.loadingPromise
  }

  cache.loadingPromise = (async () => {
    try {
      const payload = await getFrontendRuntimeConfig()
      const runtimeMap = setHsacggmMapServiceUrls(payload?.mapServices || {})
      const missingKeys = Array.isArray(payload?.missingKeys)
        ? payload.missingKeys
        : missingKeysFromMap(runtimeMap)

      const result = {
        ok: true,
        source: payload?.source || "database",
        mapServices: runtimeMap,
        missingKeys,
      }
      cache.loaded = true
      cache.lastResult = result
      return result
    } catch (error) {
      setHsacggmMapServiceUrls({})
      const result = {
        ok: false,
        source: "unavailable",
        mapServices: {},
        missingKeys: [...MSME_MAP_SERVICE_KEYS],
        error,
      }
      cache.loaded = true
      cache.lastResult = result
      return result
    } finally {
      cache.loadingPromise = null
    }
  })()

  return cache.loadingPromise
}
