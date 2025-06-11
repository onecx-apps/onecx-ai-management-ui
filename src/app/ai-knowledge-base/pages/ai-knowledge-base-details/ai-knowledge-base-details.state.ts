import { AiKnowledgeBase } from '../../../shared/generated'

export interface AiKnowledgeBaseDetailsState {
  details: AiKnowledgeBase | undefined
  detailsLoadingIndicator: boolean
  detailsLoaded: boolean
  editMode: boolean
  isSubmitting: boolean
}
