import { AiKnowledgeBase } from '../../../shared/generated'

export interface AiKnowledgeBaseDetailsViewModel {
  details: AiKnowledgeBase | undefined
  detailsLoadingIndicator: boolean
  backNavigationPossible: boolean
  detailsLoaded: boolean
  editMode: boolean
  isSubmitting: boolean
}
