import { createFeatureSelector } from '@ngrx/store'
import { aiKnowledgeBaseFeature } from './ai-knowledge-base.reducers'
import { AiKnowledgeBaseState } from './ai-knowledge-base.state'

export const selectAiKnowledgeBaseFeature = createFeatureSelector<AiKnowledgeBaseState>(aiKnowledgeBaseFeature.name)
