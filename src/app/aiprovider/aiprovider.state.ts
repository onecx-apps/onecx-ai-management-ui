import { AIProviderDetailsState } from './pages/aiprovider-details/aiprovider-details.state'
import { AIProviderSearchState } from './pages/aiprovider-search/aiprovider-search.state'
export interface AIProviderState {
  details: AIProviderDetailsState

  search: AIProviderSearchState
}
