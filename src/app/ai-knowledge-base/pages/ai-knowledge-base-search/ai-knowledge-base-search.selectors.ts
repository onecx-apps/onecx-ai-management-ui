import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { RowListGridData } from '@onecx/portal-integration-angular'
import { aiKnowledgeBaseFeature } from '../../ai-knowledge-base.reducers'
import { initialState } from './ai-knowledge-base-search.reducers'
import { AiKnowledgeBaseSearchViewModel } from './ai-knowledge-base-search.viewmodel'

export const aiKnowledgeBaseSearchSelectors = createChildSelectors(aiKnowledgeBaseFeature.selectSearch, initialState)

export const selectResults = createSelector(
  aiKnowledgeBaseSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      imagePath: '',
      ...item
      // ACTION S7: Create a mapping of the items and their corresponding translation keys
      // https://onecx.github.io/docs/nx-plugins/current/general/getting_started/search/configure-search-results.html#action-7
    }))
  }
)

export const selectAiKnowledgeBaseSearchViewModel = createSelector(
  aiKnowledgeBaseSearchSelectors.selectColumns,
  aiKnowledgeBaseSearchSelectors.selectCriteria,
  selectResults,
  aiKnowledgeBaseSearchSelectors.selectResultComponentState,
  aiKnowledgeBaseSearchSelectors.selectSearchHeaderComponentState,
  aiKnowledgeBaseSearchSelectors.selectDiagramComponentState,
  aiKnowledgeBaseSearchSelectors.selectChartVisible,
  aiKnowledgeBaseSearchSelectors.selectSearchLoadingIndicator,
  aiKnowledgeBaseSearchSelectors.selectSearchExecuted,
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
  ): AiKnowledgeBaseSearchViewModel => ({
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
