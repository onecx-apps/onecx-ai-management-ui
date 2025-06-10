import { AiKnowledgeBaseDetailsState } from './pages/ai-knowledge-base-details/ai-knowledge-base-details.state'
import { AiKnowledgeBaseSearchState } from './pages/ai-knowledge-base-search/ai-knowledge-base-search.state'
export interface AiKnowledgeBaseState {
  details: AiKnowledgeBaseDetailsState
  search: AiKnowledgeBaseSearchState
}
