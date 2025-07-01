import { AiContextDetailsState } from './pages/ai-context-details/ai-context-details.state'
import { AiContextSearchState } from './pages/ai-context-search/ai-context-search.state' // eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AiContextState {
  details: AiContextDetailsState
  search: AiContextSearchState
}
