import { AIContext, MCPServer, AIProvider } from '../../../shared/generated'

export interface AiContextDetailsState {
  details: AIContext | undefined
  detailsLoadingIndicator: boolean
  detailsLoaded: boolean

  aiProviders: AIProvider[] | undefined
  aiProvidersLoaded: boolean
  aiProvidersLoadingIndicator: boolean

  mcpServers: MCPServer[] | undefined
  mcpServersLoaded: boolean
  mcpServersLoadingIndicator: boolean
  
  backNavigationPossible: boolean
  editMode: boolean
  isSubmitting: boolean
}
