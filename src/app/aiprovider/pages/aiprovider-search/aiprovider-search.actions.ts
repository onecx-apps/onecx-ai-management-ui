import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DataTableColumn } from '@onecx/angular-accelerator'
import { AIProvider } from '../../../shared/generated'
import { AIProviderSearchCriteria } from './aiprovider-search.parameters'

export const AIProviderSearchActions = createActionGroup({
  source: 'AIProviderSearch',
  events: {
    'Delete aiprovider button clicked': props<{
      id: number | string
    }>(),
    'Delete aiprovider cancelled': emptyProps(),
    'Delete aiprovider succeeded': emptyProps(),
    'Delete aiprovider failed': props<{
      error: string | null
    }>(),

    'Create aiprovider button clicked': emptyProps(),
    'Edit aiprovider button clicked': props<{
      id: number | string
    }>(),
    'Create aiprovider cancelled': emptyProps(),
    'Update aiprovider cancelled': emptyProps(),
    'Create aiprovider succeeded': emptyProps(),
    'Update aiprovider succeeded': emptyProps(),
    'Create aiprovider failed': props<{
      error: string | null
    }>(),
    'Update aiprovider failed': props<{
      error: string | null
    }>(),
    'Edit aiprovider details button clicked': props<{
      id: number | string
    }>(),
    'Details button clicked': props<{
      id: number | string
    }>(),
    'Search button clicked': props<{
      searchCriteria: AIProviderSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'aiprovider search results received': props<{
      results: AIProvider[]
      totalNumberOfResults: number
    }>(),
    'aiprovider search results loading failed': props<{ error: string | null }>(),
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
