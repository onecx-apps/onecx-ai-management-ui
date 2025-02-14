import { combineReducers, createFeature } from '@ngrx/store'
import { AIKnowledgeBaseState } from './aiknowledge-base.state'
import { aIKnowledgeBaseSearchReducer } from './pages/aiknowledge-base-search/aiknowledge-base-search.reducers'

export const aIKnowledgeBaseFeature = createFeature({
  name: 'aIKnowledgeBase',
  reducer: combineReducers<AIKnowledgeBaseState>({
    search: aIKnowledgeBaseSearchReducer
  })
})
