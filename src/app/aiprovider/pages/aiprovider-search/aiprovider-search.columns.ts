import { ColumnType, DataTableColumn } from '@onecx/angular-accelerator'

export const AIProviderSearchColumns: DataTableColumn[] = [
    {
        columnType: ColumnType.STRING,
        id: 'name',
        nameKey: 'AI_PROVIDER_SEARCH.COLUMNS.NAME',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.FULL'
        ]
        },
        {
        columnType: ColumnType.STRING,
        id: 'description',
        nameKey: 'AI_PROVIDER_SEARCH.COLUMNS.DESCRIPTION',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.FULL'
        ]
        },
        {
        columnType: ColumnType.STRING,
        id: 'llmUrl',
        nameKey: 'AI_PROVIDER_SEARCH.COLUMNS.LLMURL',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.FULL'
        ]
        },
        {
        columnType: ColumnType.STRING,
        id: 'modelName',
        nameKey: 'AI_PROVIDER_SEARCH.COLUMNS.MODELNAME',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.FULL'
        ]
        },
        {
        columnType: ColumnType.STRING,
        id: 'modelVersion',
        nameKey: 'AI_PROVIDER_SEARCH.COLUMNS.MODELVERSION',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.FULL'
        ]
        },
        {
        columnType: ColumnType.STRING,
        id: 'appId',
        nameKey: 'AI_PROVIDER_SEARCH.COLUMNS.APPID',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'AI_PROVIDER_SEARCH.PREDEFINED_GROUP.FULL'
        ]
    },
]

