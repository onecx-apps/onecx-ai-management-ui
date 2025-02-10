import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { AIKnowledgeBaseSearchCriteria } from './aiknowledge-base-search.parameters'

export interface AIKnowledgeBaseSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: AIKnowledgeBaseSearchCriteria
  results: RowListGridData[]
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
}
