import { DataTableColumn } from '@onecx/portal-integration-angular'
import { AIKnowledgeBase } from 'src/app/shared/generated'
import { AIKnowledgeBaseSearchCriteria } from './aiknowledge-base-search.parameters'

export interface AIKnowledgeBaseSearchState {
  columns: DataTableColumn[]
  results: AIKnowledgeBase[]
  displayedColumns: string[] | null
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
  searchLoadingIndicator: boolean
  criteria: AIKnowledgeBaseSearchCriteria
}
