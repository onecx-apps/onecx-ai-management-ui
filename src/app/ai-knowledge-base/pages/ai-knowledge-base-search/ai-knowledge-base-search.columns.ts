import { ColumnType, DataTableColumn } from '@onecx/angular-accelerator'

// ACTION S6: Define search results columns: https://onecx.github.io/docs/nx-plugins/current/general/getting_started/search/configure-search-results.html#action-6
export const aiKnowledgeBaseSearchColumns: DataTableColumn[] = [
  {
    columnType: ColumnType.STRING,
    id: 'id',
    nameKey: 'AI_KNOWLEDGE_BASE_SEARCH.COLUMNS.ID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.STRING,
    id: 'name',
    nameKey: 'AI_KNOWLEDGE_BASE_SEARCH.COLUMNS.NAME',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.STRING,
    id: 'description',
    nameKey: 'AI_KNOWLEDGE_BASE_SEARCH.COLUMNS.DESCRIPTION',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'AI_KNOWLEDGE_BASE_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  }
]
