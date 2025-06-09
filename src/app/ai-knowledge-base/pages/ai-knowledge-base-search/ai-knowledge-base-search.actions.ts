import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
  GroupByCountDiagramComponentState,
  InteractiveDataViewComponentState,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { AiKnowledgeBase } from '../../../shared/generated'
import { AiKnowledgeBaseSearchCriteria } from './ai-knowledge-base-search.parameters'

export const AiKnowledgeBaseSearchActions = createActionGroup({
  source: 'AiKnowledgeBaseSearch',
  events: {
    'Details button clicked': props<{
      id: number | string
    }>(),

    'Search button clicked': props<{
      searchCriteria: AiKnowledgeBaseSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'aiKnowledgeBase search results received': props<{
      stream: AiKnowledgeBase[]
      size: number
      number: number
      totalElements: number
      totalPages: number
    }>(),
    'aiKnowledgeBase search results loading failed': props<{ error: string | null }>(),
    'Export button clicked': emptyProps(),
    'Result component state changed': props<InteractiveDataViewComponentState>(),
    'Search header component state changed': props<SearchHeaderComponentState>(),
    'Diagram component state changed': props<GroupByCountDiagramComponentState>(),
    'Chart visibility toggled': emptyProps()
  }
})
