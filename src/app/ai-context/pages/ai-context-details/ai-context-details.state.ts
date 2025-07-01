import { AiContext } from '../../../shared/generated'

export interface AiContextDetailsState {
  details: AiContext | undefined
  detailsLoadingIndicator: boolean
  backNavigationPossible: boolean
  detailsLoaded: boolean
  editMode: boolean
  isSubmitting: boolean
}
