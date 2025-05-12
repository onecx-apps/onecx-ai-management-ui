import { createFeatureSelector } from '@ngrx/store'
import { AIProviderFeature } from './aiprovider.reducers'
import { AIProviderState } from './aiprovider.state'

export const selectAIProviderFeature = createFeatureSelector<AIProviderState>(AIProviderFeature.name)
