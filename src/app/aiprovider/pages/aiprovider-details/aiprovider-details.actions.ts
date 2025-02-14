import { createActionGroup, props } from '@ngrx/store'
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
    'Edit aiprovider details button clicked': props<{
      id: number | string
    }>(),
  }
})
