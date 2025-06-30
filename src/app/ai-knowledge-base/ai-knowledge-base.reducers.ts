import { combineReducers, createFeature } from '@ngrx/store'
import { AiKnowledgeBaseState } from './ai-knowledge-base.state'
import { aiKnowledgeBaseDetailsReducer } from './pages/ai-knowledge-base-details/ai-knowledge-base-details.reducers'
import { aiKnowledgeBaseSearchReducer } from './pages/ai-knowledge-base-search/ai-knowledge-base-search.reducers'

export const aiKnowledgeBaseFeature = createFeature({
  name: 'aiKnowledgeBase',
  reducer: combineReducers<AiKnowledgeBaseState>({
    details: aiKnowledgeBaseDetailsReducer,
    search: aiKnowledgeBaseSearchReducer
  })
})
