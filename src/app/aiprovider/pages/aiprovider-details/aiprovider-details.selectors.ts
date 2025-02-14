import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { AIProvider } from '../../../shared/generated'
import { AIProviderFeature } from '../../aiprovider.reducers'
import { initialState } from './aiprovider-details.reducers'
import { AIProviderDetailsViewModel } from './aiprovider-details.viewmodel'

export const AIProviderDetailsSelectors = createChildSelectors(AIProviderFeature.selectDetails, initialState)

export const selectAIProviderDetailsViewModel = createSelector(
  AIProviderDetailsSelectors.selectDetails,
  (details: AIProvider | undefined): AIProviderDetailsViewModel => ({
    details
  })
)
