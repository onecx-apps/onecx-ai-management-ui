import { AIContext, AIKnowledgeBase } from '../../../shared/generated'

export interface AiKnowledgeBaseDetailsState {
  details: AIKnowledgeBase | undefined
  detailsLoaded: boolean
  detailsLoadingIndicator: boolean

  contexts: AIContext[]
  contextsLoaded: boolean
  contextsLoadingIndicator: boolean

  editMode: boolean
  isSubmitting: boolean
}
