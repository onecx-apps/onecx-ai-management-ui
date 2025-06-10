import { AiContext } from '../../../shared/generated'

export interface AiContextDetailsState {
  details: AiContext | undefined
  detailsLoadingIndicator: boolean
  detailsLoaded: boolean
  editMode: boolean
  isSubmitting: boolean
}
