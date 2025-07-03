import { AIContext, AIKnowledgeBase } from '../../../shared/generated'

export interface AiKnowledgeBaseDetailsViewModel {
  details: AIKnowledgeBase | undefined
  detailsLoaded: boolean
  detailsLoadingIndicator: boolean

  contexts: AIContext[]
  contextsLoaded: boolean
  contextsLoadingIndicator: boolean

  backNavigationPossible: boolean
  editMode: boolean
  isSubmitting: boolean
}
