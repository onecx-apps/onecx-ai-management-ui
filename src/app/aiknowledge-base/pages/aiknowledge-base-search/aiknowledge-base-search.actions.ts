import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DataTableColumn } from '@onecx/angular-accelerator'
import { AIKnowledgeBase } from '../../../shared/generated'
import { AIKnowledgeBaseSearchCriteria } from './aiknowledge-base-search.parameters'

export const AIKnowledgeBaseSearchActions = createActionGroup({
  source: 'AIKnowledgeBaseSearch',
  events: {
    'Search button clicked': props<{
      searchCriteria: AIKnowledgeBaseSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'aiknowledge base search results received': props<{
      results: AIKnowledgeBase[]
      totalNumberOfResults: number
    }>(),
    'aiknowledge base search results loading failed': props<{ error: string | null }>(),
    'Displayed columns changed': props<{
      displayedColumns: DataTableColumn[]
    }>(),
    'Chart visibility rehydrated': props<{
      visible: boolean
    }>(),
    'Chart visibility toggled': emptyProps(),
    'View mode changed': props<{
      viewMode: 'basic' | 'advanced'
    }>(),
    'Export button clicked': emptyProps()
  }
})
