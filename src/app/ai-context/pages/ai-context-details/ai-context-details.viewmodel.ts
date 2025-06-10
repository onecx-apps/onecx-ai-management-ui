import { AiContext } from '../../../shared/generated'

export interface AiContextDetailsViewModel {
  details: AiContext | undefined
  detailsLoadingIndicator: boolean
  backNavigationPossible: boolean
  detailsLoaded: boolean
  editMode: boolean
  isSubmitting: boolean
}
