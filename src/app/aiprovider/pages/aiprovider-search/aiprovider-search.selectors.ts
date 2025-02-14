import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { AIProviderFeature } from '../../aiprovider.reducers'
import { initialState } from './aiprovider-search.reducers'
import { AIProviderSearchViewModel } from './aiprovider-search.viewmodel'

export const AIProviderSearchSelectors = createChildSelectors(AIProviderFeature.selectSearch, initialState)

export const selectResults = createSelector(AIProviderSearchSelectors.selectResults, (results): RowListGridData[] => {
  return results.map((item) => ({
    imagePath: '',
    id: item.id,
    name: item.name,
    description: item.description,
    llmUrl: item.llmUrl,
    modelName: item.modelName,
    modelVersion: item.modelVersion,
    appId: item.appId
  }))
})

export const selectDisplayedColumns = createSelector(
  AIProviderSearchSelectors.selectColumns,
  AIProviderSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectAIProviderSearchViewModel = createSelector(
  AIProviderSearchSelectors.selectColumns,
  AIProviderSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  AIProviderSearchSelectors.selectViewMode,
  AIProviderSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): AIProviderSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)
