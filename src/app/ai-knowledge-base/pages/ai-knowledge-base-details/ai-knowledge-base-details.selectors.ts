import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { selectBackNavigationPossible } from '../../../shared/selectors/onecx.selectors'
import { AIContext, AIKnowledgeBase } from '../../../shared/generated'
import { aiKnowledgeBaseFeature } from '../../ai-knowledge-base.reducers'
import { initialState } from './ai-knowledge-base-details.reducers'
import { AiKnowledgeBaseDetailsViewModel } from './ai-knowledge-base-details.viewmodel'

export const aiKnowledgeBaseDetailsSelectors = createChildSelectors(aiKnowledgeBaseFeature.selectDetails, initialState)

export const selectAiKnowledgeBaseDetailsViewModel = createSelector(
  aiKnowledgeBaseDetailsSelectors.selectDetails,
  aiKnowledgeBaseDetailsSelectors.selectDetailsLoaded,
  aiKnowledgeBaseDetailsSelectors.selectDetailsLoadingIndicator,

  aiKnowledgeBaseDetailsSelectors.selectContexts,
  aiKnowledgeBaseDetailsSelectors.selectContextsLoaded,
  aiKnowledgeBaseDetailsSelectors.selectContextsLoadingIndicator,

  selectBackNavigationPossible,
  aiKnowledgeBaseDetailsSelectors.selectEditMode,
  aiKnowledgeBaseDetailsSelectors.selectIsSubmitting,
  (
    details: AIKnowledgeBase | undefined,
    detailsLoaded: boolean,
    detailsLoadingIndicator: boolean,

    contexts: AIContext[],
    contextsLoaded: boolean,
    contextsLoadingIndicator: boolean,

    backNavigationPossible: boolean,
    editMode: boolean,
    isSubmitting: boolean
  ): AiKnowledgeBaseDetailsViewModel => ({
    details,
    detailsLoaded,
    detailsLoadingIndicator,

    contexts,
    contextsLoaded,
    contextsLoadingIndicator,

    backNavigationPossible,
    editMode,
    isSubmitting
  })
)
