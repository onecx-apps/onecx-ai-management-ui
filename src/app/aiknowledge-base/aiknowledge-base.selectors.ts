import { createFeatureSelector } from '@ngrx/store'
import { aIKnowledgeBaseFeature } from './aiknowledge-base.reducers'
import { AIKnowledgeBaseState } from './aiknowledge-base.state'

export const selectAIKnowledgeBaseFeature = createFeatureSelector<AIKnowledgeBaseState>(aIKnowledgeBaseFeature.name)
