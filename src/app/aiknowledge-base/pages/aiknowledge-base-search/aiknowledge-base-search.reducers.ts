import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store'
import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeBaseSearchActions } from './aiknowledge-base-search.actions'
import { aIKnowledgeBaseSearchColumns } from './aiknowledge-base-search.columns'
import { aIKnowledgeBaseSearchCriteriasSchema } from './aiknowledge-base-search.parameters'
import { AIKnowledgeBaseSearchState } from './aiknowledge-base-search.state'

export const initialState: AIKnowledgeBaseSearchState = {
  columns: aIKnowledgeBaseSearchColumns,
  results: [],
  displayedColumns: null,
  viewMode: 'basic',
  chartVisible: false,
  searchLoadingIndicator: false,
  criteria: {}
}

export const aIKnowledgeBaseSearchReducer = createReducer(
  initialState,
  on(routerNavigatedAction, (state: AIKnowledgeBaseSearchState, action: RouterNavigatedAction) => {
    const results = aIKnowledgeBaseSearchCriteriasSchema.safeParse(action.payload.routerState.root.queryParams)
    if (results.success) {
      return {
        ...state,
        criteria: results.data,
        searchLoadingIndicator: Object.keys(action.payload.routerState.root.queryParams).length != 0
      }
    }
    return state
  }),
  on(
    AIKnowledgeBaseSearchActions.resetButtonClicked,
    (state: AIKnowledgeBaseSearchState): AIKnowledgeBaseSearchState => ({
      ...state,
      results: initialState.results,
      criteria: {}
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.searchButtonClicked,
    (state: AIKnowledgeBaseSearchState, { searchCriteria }): AIKnowledgeBaseSearchState => ({
      ...state,
      searchLoadingIndicator: true,
      criteria: searchCriteria
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.aiknowledgeBaseSearchResultsReceived,
    (state: AIKnowledgeBaseSearchState, { results }): AIKnowledgeBaseSearchState => ({
      ...state,
      results
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.aiknowledgeBaseSearchResultsLoadingFailed,
    (state: AIKnowledgeBaseSearchState): AIKnowledgeBaseSearchState => ({
      ...state,
      results: []
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.chartVisibilityRehydrated,
    (state: AIKnowledgeBaseSearchState, { visible }): AIKnowledgeBaseSearchState => ({
      ...state,
      chartVisible: visible
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.chartVisibilityToggled,
    (state: AIKnowledgeBaseSearchState): AIKnowledgeBaseSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.viewModeChanged,
    (state: AIKnowledgeBaseSearchState, { viewMode }): AIKnowledgeBaseSearchState => ({
      ...state,
      viewMode: viewMode
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.displayedColumnsChanged,
    (state: AIKnowledgeBaseSearchState, { displayedColumns }): AIKnowledgeBaseSearchState => ({
      ...state,
      displayedColumns: displayedColumns.map((v) => v.id)
    })
  )
)
