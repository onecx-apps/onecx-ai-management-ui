import { AIContext, AiKnowledgeBase } from '../../../shared/generated'

export interface AiKnowledgeBaseDetailsState {
  details: AiKnowledgeBase | undefined
  detailsLoaded: boolean
  detailsLoadingIndicator: boolean

  contexts: AIContext[]
  contextsLoaded: boolean
  contextsLoadingIndicator: boolean

  editMode: boolean
  isSubmitting: boolean
}
