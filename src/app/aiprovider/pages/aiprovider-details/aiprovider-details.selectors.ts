import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { AIProvider } from '../../../shared/generated'
import { AIProviderFeature } from '../../aiprovider.reducers'
import { initialState } from './aiprovider-details.reducers'
import { AIProviderDetailsViewModel } from './aiprovider-details.viewmodel'

export const AIProviderDetailsSelectors = createChildSelectors(AIProviderFeature.selectDetails, initialState)

export const selectAIProviderDetailsViewModel = createSelector(
  AIProviderDetailsSelectors.selectDetails,
  AIProviderDetailsSelectors.selectEditMode,
  AIProviderDetailsSelectors.selectIsApiKeyHidden,
  (
    details: AIProvider | undefined, 
    editMode,
    isApiKeyHidden
  ): AIProviderDetailsViewModel => ({
    details,
    editMode,
    isApiKeyHidden
  })
)
