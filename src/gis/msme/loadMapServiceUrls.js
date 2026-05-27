import { getFrontendRuntimeConfig } from "../../services/apiUrlService.js"
import { MSME_MAP_SERVICE_KEYS, setHsacggmMapServiceUrls } from "./arcgisMapServiceUrls.js"
import { refreshResolvedMapServiceUrls } from "./serviceUrlsAndLayers.js"
import {
  INVESTHRY_FEATURE_SERVICE_KEYS,
  setInvesthryFeatureServiceUrls,
} from "./investhryFeatureServiceUrls.js"

const cache = {
  loaded: false,
  loadingPromise: null,
  lastResult: null,
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function missingKeysFromMap(mapServices) {
  return [...MSME_MAP_SERVICE_KEYS, ...INVESTHRY_FEATURE_SERVICE_KEYS].filter(
    (key) => !String(mapServices?.[key] || "").trim(),
  )
}

export function resetMapServiceUrlCache() {
  cache.loaded = false
  cache.loadingPromise = null
  cache.lastResult = null
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
      let payload = null
      let lastError = null
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          payload = await getFrontendRuntimeConfig()
          break
        } catch (error) {
          lastError = error
          if (attempt < 3) await sleep(2000)
        }
      }
      if (!payload) {
        throw lastError || new Error("frontend-config unavailable")
      }
      const runtimeMap = payload?.mapServices || {}
      const hsacggmMapServices = setHsacggmMapServiceUrls(runtimeMap)
      const investhryFeatureServices = setInvesthryFeatureServiceUrls(runtimeMap)
      refreshResolvedMapServiceUrls()
      const missingKeys = Array.isArray(payload?.missingKeys)
        ? payload.missingKeys
        : missingKeysFromMap(runtimeMap)

      const result = {
        ok: true,
        source: payload?.source || "database",
        mapServices: runtimeMap,
        hsacggmMapServices,
        investhryFeatureServices,
        missingKeys,
      }
      cache.loaded = true
      cache.lastResult = result
      return result
    } catch (error) {
      setHsacggmMapServiceUrls({})
      setInvesthryFeatureServiceUrls({})
      refreshResolvedMapServiceUrls()
      const result = {
        ok: false,
        source: "unavailable",
        mapServices: {},
        hsacggmMapServices: {},
        investhryFeatureServices: {},
        missingKeys: [...MSME_MAP_SERVICE_KEYS, ...INVESTHRY_FEATURE_SERVICE_KEYS],
        error,
      }
      // Keep failure responses out of the long-lived cache so startup race/network blips can recover.
      cache.loaded = false
      cache.lastResult = result
      return result
    } finally {
      cache.loadingPromise = null
    }
  })()

  return cache.loadingPromise
}
