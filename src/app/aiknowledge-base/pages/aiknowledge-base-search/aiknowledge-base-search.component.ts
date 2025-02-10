import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { isValidDate } from '@onecx/accelerator'
import { Action, BreadcrumbService, DataTableColumn, ExportDataService } from '@onecx/portal-integration-angular'
import { PrimeIcons } from 'primeng/api'
import { map, Observable } from 'rxjs'
import { AIKnowledgeBaseSearchActions } from './aiknowledge-base-search.actions'
import {
  AIKnowledgeBaseSearchCriteria,
  aIKnowledgeBaseSearchCriteriasSchema
} from './aiknowledge-base-search.parameters'
import { selectAIKnowledgeBaseSearchViewModel } from './aiknowledge-base-search.selectors'
import { AIKnowledgeBaseSearchViewModel } from './aiknowledge-base-search.viewmodel'

@Component({
  selector: 'app-aiknowledge-base-search',
  templateUrl: './aiknowledge-base-search.component.html',
  styleUrls: ['./aiknowledge-base-search.component.scss']
})
export class AIKnowledgeBaseSearchComponent implements OnInit {
  viewModel$: Observable<AIKnowledgeBaseSearchViewModel> = this.store.select(selectAIKnowledgeBaseSearchViewModel)

  // ACTION S10: Update header actions
  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.exportItems()
        },
        {
          labelKey: vm.chartVisible
            ? 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          icon: PrimeIcons.EYE,
          titleKey: vm.chartVisible
            ? 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          show: 'asOverflow',
          actionCallback: () => this.toggleChartVisibility()
        }
      ]
      return actions
    })
  )

  // ACTION S9: Please select the column to be displayed in the diagram
  diagramColumnId = 'id'
  diagramColumn$ = this.viewModel$.pipe(
    map((vm) => vm.columns.find((e) => e.id === this.diagramColumnId) as DataTableColumn)
  )

  public aIKnowledgeBaseSearchFormGroup: FormGroup = this.formBuilder.group({
    ...(Object.fromEntries(aIKnowledgeBaseSearchCriteriasSchema.keyof().options.map((k) => [k, null])) as Record<
      keyof AIKnowledgeBaseSearchCriteria,
      unknown
    >)
  } satisfies Record<keyof AIKnowledgeBaseSearchCriteria, unknown>)

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly exportDataService: ExportDataService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_BASE_SEARCH.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_BASE_SEARCH.BREADCRUMB',
        routerLink: '/aiknowledge-base'
      }
    ])
    this.viewModel$.subscribe((vm) => this.aIKnowledgeBaseSearchFormGroup.patchValue(vm.searchCriteria))
  }

  search(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<AIKnowledgeBaseSearchCriteria>, [key, value]) => ({
        ...acc,
        [key]: isValidDate(value)
          ? new Date(
              Date.UTC(
                value.getFullYear(),
                value.getMonth(),
                value.getDate(),
                value.getHours(),
                value.getMinutes(),
                value.getSeconds()
              )
            )
          : value || undefined
      }),
      {}
    )
    this.store.dispatch(AIKnowledgeBaseSearchActions.searchButtonClicked({ searchCriteria }))
  }

  resetSearch() {
    this.store.dispatch(AIKnowledgeBaseSearchActions.resetButtonClicked())
  }

  exportItems() {
    this.store.dispatch(AIKnowledgeBaseSearchActions.exportButtonClicked())
  }

  viewModeChanged(viewMode: 'basic' | 'advanced') {
    this.store.dispatch(
      AIKnowledgeBaseSearchActions.viewModeChanged({
        viewMode: viewMode
      })
    )
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(AIKnowledgeBaseSearchActions.displayedColumnsChanged({ displayedColumns }))
  }

  toggleChartVisibility() {
    this.store.dispatch(AIKnowledgeBaseSearchActions.chartVisibilityToggled())
  }
}
