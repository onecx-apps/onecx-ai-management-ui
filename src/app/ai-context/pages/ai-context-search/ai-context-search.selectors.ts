import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { RowListGridData } from '@onecx/portal-integration-angular'
import { aiContextFeature } from '../../ai-context.reducers'
import { initialState } from './ai-context-search.reducers'
import { AiContextSearchViewModel } from './ai-context-search.viewmodel'

export const aiContextSearchSelectors = createChildSelectors(aiContextFeature.selectSearch, initialState)

export const selectResults = createSelector(aiContextSearchSelectors.selectResults, (results): RowListGridData[] => {
  return results.map((item) => ({
    imagePath: '',
    id: item.id || '',
    ...item
  }))
})

export const selectAiContextSearchViewModel = createSelector(
  aiContextSearchSelectors.selectColumns,
  aiContextSearchSelectors.selectCriteria,
  selectResults,
  aiContextSearchSelectors.selectResultComponentState,
  aiContextSearchSelectors.selectSearchHeaderComponentState,
  aiContextSearchSelectors.selectDiagramComponentState,
  aiContextSearchSelectors.selectChartVisible,
  aiContextSearchSelectors.selectSearchLoadingIndicator,
  aiContextSearchSelectors.selectSearchExecuted,
  (
    columns,
    searchCriteria,
    results,
    resultComponentState,
    searchHeaderComponentState,
    diagramComponentState,
    chartVisible,
    searchLoadingIndicator,
    searchExecuted
  ): AiContextSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    resultComponentState,
    searchHeaderComponentState,
    diagramComponentState,
    chartVisible,
    searchLoadingIndicator,
    searchExecuted
  })
)
