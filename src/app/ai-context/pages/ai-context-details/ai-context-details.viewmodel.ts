import { AIContext, MCPServer, AIProvider } from '../../../shared/generated'

export interface AiContextDetailsViewModel {
  details: AIContext | undefined
  detailsLoadingIndicator: boolean
  detailsLoaded: boolean

  aiProviders: AIProvider[] | undefined
  aiProvidersLoaded: boolean
  aiProvidersLoadingIndicator: boolean

  MCPServers: MCPServer[] | undefined
  MCPServersLoaded: boolean
  MCPServersLoadingIndicator: boolean
  
  backNavigationPossible: boolean
  editMode: boolean
  isSubmitting: boolean
}
