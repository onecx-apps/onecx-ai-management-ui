import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
// import { selectBackNavigationPossible } from '../../../shared/selectors/onecx.selectors'
import { AiKnowledgeBase } from '../../../shared/generated'
import { aiKnowledgeBaseFeature } from '../../ai-knowledge-base.reducers'
import { initialState } from './ai-knowledge-base-details.reducers'
import { AiKnowledgeBaseDetailsViewModel } from './ai-knowledge-base-details.viewmodel'

// Can't find this selector
function selectBackNavigationPossible(state: Record<string, any>): boolean {
  console.log('state: ', state)
  throw new Error('Function not implemented.')
}

export const aiKnowledgeBaseDetailsSelectors = createChildSelectors(aiKnowledgeBaseFeature.selectDetails, initialState)

export const selectAiKnowledgeBaseDetailsViewModel = createSelector(
  aiKnowledgeBaseDetailsSelectors.selectDetails,
  aiKnowledgeBaseDetailsSelectors.selectDetailsLoadingIndicator,
  selectBackNavigationPossible,
  aiKnowledgeBaseDetailsSelectors.selectDetailsLoaded,
  aiKnowledgeBaseDetailsSelectors.selectEditMode,
  aiKnowledgeBaseDetailsSelectors.selectIsSubmitting,
  (
    details: AiKnowledgeBase | undefined,
    detailsLoadingIndicator: boolean,
    backNavigationPossible: boolean,
    detailsLoaded: boolean,
    editMode: boolean,
    isSubmitting: boolean
  ): AiKnowledgeBaseDetailsViewModel => ({
    details,
    detailsLoadingIndicator,
    backNavigationPossible,
    detailsLoaded,
    editMode,
    isSubmitting
  })
)
