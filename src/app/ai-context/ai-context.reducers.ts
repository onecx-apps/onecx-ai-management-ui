import { combineReducers, createFeature } from '@ngrx/store'
import { AiContextState } from './ai-context.state'
import { aiContextSearchReducer } from './pages/ai-context-search/ai-context-search.reducers'

export const aiContextFeature = createFeature({
  name: 'aiContext',
  reducer: combineReducers<AiContextState>({
    search: aiContextSearchReducer
  })
})
