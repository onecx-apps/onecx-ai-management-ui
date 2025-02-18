import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AIProvider } from '../../../shared/generated'

export const AIProviderDetailsActions = createActionGroup({
  source: 'AIProviderDetails',
  events: {
    'navigated to details page': props<{
      id: string | undefined
    }>(),
    'aiprovider details received': props<{
      details: AIProvider
    }>(),
    'aiprovider details loading failed': props<{ error: string | null }>(),
    'aiprovider details edit mode set': props<{ editMode: boolean }>(),
    'api key visibility toggled': emptyProps(),
  }
})
