import { combineReducers, createFeature } from '@ngrx/store'
import { AIProviderState } from './aiprovider.state'
import { aIProviderDetailsReducer } from './pages/aiprovider-details/aiprovider-details.reducers'
import { AIProviderSearchReducer } from './pages/aiprovider-search/aiprovider-search.reducers'

export const AIProviderFeature = createFeature({
  name: 'AIProvider',
  reducer: combineReducers<AIProviderState>({
    details: aIProviderDetailsReducer,
    search: AIProviderSearchReducer
  })
})
