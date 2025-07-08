import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AIContext } from '../../../shared/generated'

export const AiContextDetailsActions = createActionGroup({
  source: 'AIContextDetails',
  events: {
    'navigated to details page': props<{
      id: string | undefined
    }>(),
    'ai context details received': props<{
      details: AIContext
    }>(),
    'ai context reloaded details received': props<{
      details: AIContext
    }>(),
    'ai context details loading failed': props<{ error: string | null }>(),
    'edit mode set': props<{ editMode: boolean }>(),
    'Update ai context cancelled': emptyProps(),
    'Update ai context succeeded': emptyProps(),
    'Update ai context failed': props<{
      error: string | null
    }>(),
    'Delete ai context cancelled': emptyProps(),
    'Delete ai context succeeded': emptyProps(),
    'Delete ai context failed': props<{
      error: string | null
    }>(),
    'cancel edit back clicked': emptyProps(),
    'cancel edit confirm clicked': emptyProps(),
    'cancel edit not dirty': emptyProps(),
    'edit button clicked': emptyProps(),
    'save button clicked': props<{
      details: AIContext
    }>(),
    'cancel button clicked': props<{
      dirty: boolean
    }>(),
    'delete button clicked': emptyProps(),
    'navigate back button clicked': emptyProps(),
    'back navigation started': emptyProps(),
    'back navigation failed': emptyProps(),
    'navigation to search started': emptyProps(),
    'navigation to search not started': emptyProps()
  }
})
