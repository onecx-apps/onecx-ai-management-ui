import {
  DataTableColumn,
  DiagramComponentState,
  InteractiveDataViewComponentState,
  RowListGridData,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { AiKnowledgeBaseSearchCriteria } from './ai-knowledge-base-search.parameters'

export interface AiKnowledgeBaseSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: AiKnowledgeBaseSearchCriteria
  results: RowListGridData[]
  resultComponentState: InteractiveDataViewComponentState | null
  searchHeaderComponentState: SearchHeaderComponentState | null
  diagramComponentState: DiagramComponentState | null
  chartVisible: boolean
  searchLoadingIndicator: boolean
  searchExecuted: boolean
}
