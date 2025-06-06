import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
  GroupByCountDiagramComponentState,
  InteractiveDataViewComponentState,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { AiContext } from '../../../shared/generated'
import { AiContextSearchCriteria } from './ai-context-search.parameters'

export const AiContextSearchActions = createActionGroup({
  source: 'AiContextSearch',
  events: {
    'Search button clicked': props<{
      searchCriteria: AiContextSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'aiContext search results received': props<{
      stream: AiContext[]
      size: number
      number: number
      totalElements: number
      totalPages: number
    }>(),
    'aiContext search results loading failed': props<{ error: string | null }>(),
    'Export button clicked': emptyProps(),
    'Result component state changed': props<InteractiveDataViewComponentState>(),
    'Search header component state changed': props<SearchHeaderComponentState>(),
    'Diagram component state changed': props<GroupByCountDiagramComponentState>(),
    'Chart visibility toggled': emptyProps()
  }
})
