import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { aIKnowledgeBaseFeature } from '../../aiknowledge-base.reducers'
import { initialState } from './aiknowledge-base-search.reducers'
import { AIKnowledgeBaseSearchViewModel } from './aiknowledge-base-search.viewmodel'

export const aIKnowledgeBaseSearchSelectors = createChildSelectors(aIKnowledgeBaseFeature.selectSearch, initialState)

export const selectResults = createSelector(
  aIKnowledgeBaseSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imagePath: '',
    }))
  }
)

export const selectDisplayedColumns = createSelector(
  aIKnowledgeBaseSearchSelectors.selectColumns,
  aIKnowledgeBaseSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectAIKnowledgeBaseSearchViewModel = createSelector(
  aIKnowledgeBaseSearchSelectors.selectColumns,
  aIKnowledgeBaseSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  aIKnowledgeBaseSearchSelectors.selectViewMode,
  aIKnowledgeBaseSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): AIKnowledgeBaseSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)
