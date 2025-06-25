import {
  DataTableColumn,
  DiagramComponentState,
  InteractiveDataViewComponentState,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { AIKnowledgeBase } from 'src/app/shared/generated'
import { AiKnowledgeBaseSearchCriteria } from './ai-knowledge-base-search.parameters'

export interface AiKnowledgeBaseSearchState {
  columns: DataTableColumn[]
  results: AIKnowledgeBase[]
  displayedColumns: string[] | null
  chartVisible: boolean
  resultComponentState: InteractiveDataViewComponentState | null
  searchHeaderComponentState: SearchHeaderComponentState | null
  diagramComponentState: DiagramComponentState | null
  searchLoadingIndicator: boolean
  criteria: AiKnowledgeBaseSearchCriteria
  searchExecuted: boolean
}
