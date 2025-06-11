import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store'
import { createReducer, on } from '@ngrx/store'
import { AiKnowledgeBaseSearchActions } from './ai-knowledge-base-search.actions'
import { aiKnowledgeBaseSearchColumns } from './ai-knowledge-base-search.columns'
import { aiKnowledgeBaseSearchCriteriasSchema } from './ai-knowledge-base-search.parameters'
import { AiKnowledgeBaseSearchState } from './ai-knowledge-base-search.state'

export const initialState: AiKnowledgeBaseSearchState = {
  columns: aiKnowledgeBaseSearchColumns,
  results: [],
  displayedColumns: [],
  chartVisible: false,
  resultComponentState: null,
  searchHeaderComponentState: null,
  diagramComponentState: null,
  searchLoadingIndicator: false,
  criteria: {},
  searchExecuted: false
}

export const aiKnowledgeBaseSearchReducer = createReducer(
  initialState,
  on(routerNavigatedAction, (state: AiKnowledgeBaseSearchState, action: RouterNavigatedAction) => {
    const results = aiKnowledgeBaseSearchCriteriasSchema.safeParse(action.payload.routerState.root.queryParams)
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
    AiKnowledgeBaseSearchActions.resetButtonClicked,
    (state: AiKnowledgeBaseSearchState): AiKnowledgeBaseSearchState => ({
      ...state,
      results: initialState.results,
      criteria: {},
      searchExecuted: false
    })
  ),
  on(
    AiKnowledgeBaseSearchActions.searchButtonClicked,
    (state: AiKnowledgeBaseSearchState, { searchCriteria }): AiKnowledgeBaseSearchState => ({
      ...state,
      criteria: searchCriteria
    })
  ),
  on(
    AiKnowledgeBaseSearchActions.aiKnowledgeBaseSearchResultsReceived,
    (state: AiKnowledgeBaseSearchState, { stream }): AiKnowledgeBaseSearchState => ({
      ...state,
      results: stream,
      searchLoadingIndicator: false,
      searchExecuted: true
    })
  ),
  on(
    AiKnowledgeBaseSearchActions.aiKnowledgeBaseSearchResultsLoadingFailed,
    (state: AiKnowledgeBaseSearchState): AiKnowledgeBaseSearchState => ({
      ...state,
      results: [],
      searchLoadingIndicator: false
    })
  ),
  on(
    AiKnowledgeBaseSearchActions.chartVisibilityToggled,
    (state: AiKnowledgeBaseSearchState): AiKnowledgeBaseSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    AiKnowledgeBaseSearchActions.resultComponentStateChanged,
    (state: AiKnowledgeBaseSearchState, resultComponentState): AiKnowledgeBaseSearchState => ({
      ...state,
      resultComponentState
    })
  ),
  on(
    AiKnowledgeBaseSearchActions.searchHeaderComponentStateChanged,
    (state: AiKnowledgeBaseSearchState, searchHeaderComponentState): AiKnowledgeBaseSearchState => ({
      ...state,
      searchHeaderComponentState
    })
  ),
  on(
    AiKnowledgeBaseSearchActions.diagramComponentStateChanged,
    (state: AiKnowledgeBaseSearchState, diagramComponentState): AiKnowledgeBaseSearchState => ({
      ...state,
      diagramComponentState
    })
  ),
  on(
    AiKnowledgeBaseSearchActions.displayedColumnsChanged,
    (state: AiKnowledgeBaseSearchState, { displayedColumns }): AiKnowledgeBaseSearchState => ({
      ...state,

      displayedColumns: displayedColumns.map((v) => v.id)
    })
  )
)
