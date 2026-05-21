import { resolveInvesthryFeatureUrl } from './resolveMapServiceUrl.js'

/**
 * Point-in-polygon query order for Vidhan Sabha profile (merge all hits).
 * layerId 0 unless service publishes multiple layers (Vidhansabha_map).
 */
export function getAssemblyInvesthryQuerySources() {
  return [
    {
      key: 'assemblyDemography',
      url: resolveInvesthryFeatureUrl('ASSEMBLY_DEMOGRAPHY'),
      layerId: 0,
    },
    {
      key: 'vidhansabhaCoreAreaView',
      url: resolveInvesthryFeatureUrl('VIDHANSABHA_CORE_AREA_VIEW'),
      layerId: 0,
    },
    {
      key: 'vidhansabhaCoreArea',
      url: resolveInvesthryFeatureUrl('VIDHANSABHA_CORE_AREA'),
      layerId: 0,
    },
    {
      key: 'haryanaAssemblyBnd',
      url: resolveInvesthryFeatureUrl('HARYANA_ASSEMBLY_BND'),
      layerId: 0,
    },
    {
      key: 'assemblyBoundary',
      url: resolveInvesthryFeatureUrl('ASSEMBLY_BOUNDARY'),
      layerId: 0,
    },
    {
      key: 'assemblyBndBlockHeap',
      url: resolveInvesthryFeatureUrl('ASSEMBLY_BND_WITH_BLOCK_HEAP'),
      layerId: 0,
    },
    {
      key: 'vidhansabhaMap',
      url: resolveInvesthryFeatureUrl('VIDHANSABHA_MAP'),
      layerId: 0,
    },
    {
      key: 'districtWiseArea',
      url: resolveInvesthryFeatureUrl('DISTRICT_WISE_AREA'),
      layerId: 0,
    },
    {
      key: 'blockBoundary',
      url: resolveInvesthryFeatureUrl('BLOCK_BOUNDARY'),
      layerId: 0,
    },
    {
      key: 'noMsmeArea',
      url: resolveInvesthryFeatureUrl('NO_MSME_AREA'),
      layerId: 0,
    },
  ].filter(function (row) {
    return !!row.url
  })
}
