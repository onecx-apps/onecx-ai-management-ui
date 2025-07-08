import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AIContext, AIKnowledgeBase } from '../../../shared/generated'

export const AiKnowledgeBaseDetailsActions = createActionGroup({
  source: 'AiKnowledgeBaseDetails',
  events: {
    'navigated to details page': props<{
      id: string | undefined
    }>(),
    'ai knowledge base details received': props<{
      details: AIKnowledgeBase
    }>(),
    'ai knowledge base reloaded details received': props<{
      details: AIKnowledgeBase
    }>(),
    'ai knowledge base details loading failed': props<{ error: string | null }>(),
    'ai knowledge base contexts received': props<{
      contexts: AIContext[]
    }>(),
    'ai knowledge base reloaded contexts received': props<{
      contexts: AIContext[]
    }>(),
    'ai knowledge base contexts loading failed': props<{ error: string | null }>(),
    'edit mode set': props<{ editMode: boolean }>(),
    'Update ai knowledge base cancelled': emptyProps(),
    'Update ai knowledge base succeeded': emptyProps(),
    'Update ai knowledge base failed': props<{
      error: string | null
    }>(),
    'Delete ai knowledge base cancelled': emptyProps(),
    'Delete ai knowledge base succeeded': emptyProps(),
    'Delete ai knowledge base failed': props<{
      error: string | null
    }>(),
    'cancel edit back clicked': emptyProps(),
    'cancel edit confirm clicked': emptyProps(),
    'cancel edit not dirty': emptyProps(),
    'edit button clicked': emptyProps(),
    'save button clicked': props<{
      details: AIKnowledgeBase
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
