import { combineReducers, createFeature } from '@ngrx/store'
import { AiContextState } from './ai-context.state'

export const aiContextFeature = createFeature({
  name: 'aiContext',
  reducer: combineReducers<AiContextState>({})
})
