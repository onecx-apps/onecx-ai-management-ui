import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store'
import { createReducer, on } from '@ngrx/store'
import { AIProviderSearchActions } from './aiprovider-search.actions'
import { AIProviderSearchColumns } from './aiprovider-search.columns'
import { AIProviderSearchCriteriasSchema } from './aiprovider-search.parameters'
import { AIProviderSearchState } from './aiprovider-search.state'

export const initialState: AIProviderSearchState = {
  columns: AIProviderSearchColumns,
  results: [],
  displayedColumns: null,
  viewMode: 'basic',
  chartVisible: false,
  searchLoadingIndicator: false,
  criteria: {}
}

export const AIProviderSearchReducer = createReducer(
  initialState,
  on(routerNavigatedAction, (state: AIProviderSearchState, action: RouterNavigatedAction) => {
    const results = AIProviderSearchCriteriasSchema.safeParse(action.payload.routerState.root.queryParams)
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
    AIProviderSearchActions.resetButtonClicked,
    (state: AIProviderSearchState): AIProviderSearchState => ({
      ...state,
      results: initialState.results,
      criteria: {}
    })
  ),
  on(
    AIProviderSearchActions.searchButtonClicked,
    (state: AIProviderSearchState, { searchCriteria }): AIProviderSearchState => ({
      ...state,
      searchLoadingIndicator: true,
      criteria: searchCriteria
    })
  ),
  on(
    AIProviderSearchActions.aiproviderSearchResultsReceived,
    (state: AIProviderSearchState, { results }): AIProviderSearchState => ({
      ...state,
      results
    })
  ),
  on(
    AIProviderSearchActions.aiproviderSearchResultsLoadingFailed,
    (state: AIProviderSearchState): AIProviderSearchState => ({
      ...state,
      results: []
    })
  ),
  on(
    AIProviderSearchActions.chartVisibilityRehydrated,
    (state: AIProviderSearchState, { visible }): AIProviderSearchState => ({
      ...state,
      chartVisible: visible
    })
  ),
  on(
    AIProviderSearchActions.chartVisibilityToggled,
    (state: AIProviderSearchState): AIProviderSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    AIProviderSearchActions.viewModeChanged,
    (state: AIProviderSearchState, { viewMode }): AIProviderSearchState => ({
      ...state,
      viewMode: viewMode
    })
  ),
  on(
    AIProviderSearchActions.displayedColumnsChanged,
    (state: AIProviderSearchState, { displayedColumns }): AIProviderSearchState => ({
      ...state,
      displayedColumns: displayedColumns.map((v) => v.id)
    })
  )
)
