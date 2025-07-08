import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { selectBackNavigationPossible } from 'src/app/shared/selectors/onecx.selectors'
import { AIContext } from '../../../shared/generated'
import { aiContextFeature } from '../../ai-context.reducers'
import { initialState } from './ai-context-details.reducers'
import { AiContextDetailsViewModel } from './ai-context-details.viewmodel'

export const aiContextDetailsSelectors = createChildSelectors(aiContextFeature.selectDetails, initialState)

export const selectAiContextDetailsViewModel = createSelector(
  aiContextDetailsSelectors.selectDetails,
  aiContextDetailsSelectors.selectDetailsLoadingIndicator,
  selectBackNavigationPossible,
  aiContextDetailsSelectors.selectDetailsLoaded,
  aiContextDetailsSelectors.selectEditMode,
  aiContextDetailsSelectors.selectIsSubmitting,
  (
    details: AIContext | undefined,
    detailsLoadingIndicator: boolean,
    backNavigationPossible: boolean,
    detailsLoaded: boolean,
    editMode: boolean,
    isSubmitting: boolean
  ): AiContextDetailsViewModel => ({
    details,
    detailsLoadingIndicator,
    backNavigationPossible,
    detailsLoaded,
    editMode,
    isSubmitting
  })
)
