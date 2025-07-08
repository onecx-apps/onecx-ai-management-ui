import { AIContext } from '../../../shared/generated'

export interface AiContextDetailsViewModel {
  details: AIContext | undefined
  detailsLoadingIndicator: boolean
  backNavigationPossible: boolean
  detailsLoaded: boolean
  editMode: boolean
  isSubmitting: boolean
}
