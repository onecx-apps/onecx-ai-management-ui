import { ColumnType, DataTableColumn } from '@onecx/angular-accelerator'

export const aiContextSearchColumns: DataTableColumn[] = [
  {
    id: 'appId',
    columnType: ColumnType.STRING,
    nameKey: 'AI_CONTEXT_SEARCH.COLUMNS.APPID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: ['AI_CONTEXT_SEARCH.PREDEFINED_GROUP.EXTENDED', 'AI_CONTEXT_SEARCH.PREDEFINED_GROUP.FULL']
  },
  {
    id: 'name',
    columnType: ColumnType.STRING,
    nameKey: 'AI_CONTEXT_SEARCH.COLUMNS.NAME',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: ['AI_CONTEXT_SEARCH.PREDEFINED_GROUP.EXTENDED', 'AI_CONTEXT_SEARCH.PREDEFINED_GROUP.FULL']
  },
  {
    id: 'description',
    columnType: ColumnType.STRING,
    nameKey: 'AI_CONTEXT_SEARCH.COLUMNS.DESCRIPTION',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: ['AI_CONTEXT_SEARCH.PREDEFINED_GROUP.EXTENDED', 'AI_CONTEXT_SEARCH.PREDEFINED_GROUP.FULL']
  }
]
// DONE: ACTION S6: Define search results columns: https://onecx.github.io/docs/nx-plugins/current/general/getting_started/search/configure-search-results.html#action-6
