import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { AIProviderSearchCriteria } from './aiprovider-search.parameters'

export interface AIProviderSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: AIProviderSearchCriteria
  results: RowListGridData[]
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
}
