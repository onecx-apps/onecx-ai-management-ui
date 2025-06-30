import {
  DataTableColumn,
  DiagramComponentState,
  InteractiveDataViewComponentState,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { AiContext } from 'src/app/shared/generated'
import { AiContextSearchCriteria } from './ai-context-search.parameters'

export interface AiContextSearchState {
  columns: DataTableColumn[]
  results: AiContext[]
  displayedColumns: string[] | null
  chartVisible: boolean
  resultComponentState: InteractiveDataViewComponentState | null
  searchHeaderComponentState: SearchHeaderComponentState | null
  diagramComponentState: DiagramComponentState | null
  searchLoadingIndicator: boolean
  criteria: AiContextSearchCriteria
  searchExecuted: boolean
}
