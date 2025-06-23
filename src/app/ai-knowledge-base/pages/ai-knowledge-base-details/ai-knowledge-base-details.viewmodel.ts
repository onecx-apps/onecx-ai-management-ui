import { AIContext, AiKnowledgeBase } from '../../../shared/generated'

export interface AiKnowledgeBaseDetailsViewModel {
  details: AiKnowledgeBase | undefined
  detailsLoaded: boolean
  detailsLoadingIndicator: boolean

  contexts: AIContext[]
  contextsLoaded: boolean
  contextsLoadingIndicator: boolean

  backNavigationPossible: boolean
  editMode: boolean
  isSubmitting: boolean
}
