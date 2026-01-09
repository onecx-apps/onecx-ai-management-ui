import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { selectBackNavigationPossible } from 'src/app/shared/selectors/onecx.selectors'
import { AIContext, MCPServer, AIProvider } from '../../../shared/generated'
import { aiContextFeature } from '../../ai-context.reducers'
import { initialState } from './ai-context-details.reducers'
import { AiContextDetailsViewModel } from './ai-context-details.viewmodel'

export const aiContextDetailsSelectors = createChildSelectors(aiContextFeature.selectDetails, initialState)

export const selectAiContextDetailsViewModel = createSelector(
  aiContextDetailsSelectors.selectDetails,
  aiContextDetailsSelectors.selectDetailsLoadingIndicator,
  aiContextDetailsSelectors.selectDetailsLoaded,
  aiContextDetailsSelectors.selectAiProviders,
  aiContextDetailsSelectors.selectAiProvidersLoadingIndicator,
  aiContextDetailsSelectors.selectAiProvidersLoaded,
  aiContextDetailsSelectors.selectMcpServers,
  aiContextDetailsSelectors.selectMcpServersLoadingIndicator,
  aiContextDetailsSelectors.selectMcpServersLoaded,
  selectBackNavigationPossible,
  aiContextDetailsSelectors.selectEditMode,
  aiContextDetailsSelectors.selectIsSubmitting,
  (
    details: AIContext | undefined,
    detailsLoadingIndicator: boolean,
    detailsLoaded: boolean,
    aiProviders: AIProvider[] | undefined,
    aiProvidersLoadingIndicator: boolean,
    aiProvidersLoaded: boolean,
    MCPServers: MCPServer[] | undefined,
    MCPServersLoadingIndicator: boolean,
    MCPServersLoaded: boolean,
    backNavigationPossible: boolean,
    editMode: boolean,
    isSubmitting: boolean
  ): AiContextDetailsViewModel => ({
    details,
    detailsLoadingIndicator,
    detailsLoaded,
    aiProviders,
    aiProvidersLoadingIndicator,
    aiProvidersLoaded,
    MCPServers,
    MCPServersLoaded,
    MCPServersLoadingIndicator,
    backNavigationPossible,
    editMode,
    isSubmitting
  })
)
