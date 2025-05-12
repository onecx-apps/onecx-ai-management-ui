import { DataTableColumn } from '@onecx/portal-integration-angular'
import { AIProvider } from 'src/app/shared/generated'
import { AIProviderSearchCriteria } from './aiprovider-search.parameters'

export interface AIProviderSearchState {
  columns: DataTableColumn[]
  results: AIProvider[]
  displayedColumns: string[] | null
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
  searchLoadingIndicator: boolean
  criteria: AIProviderSearchCriteria
}
