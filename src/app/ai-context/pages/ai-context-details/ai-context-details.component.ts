import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService, ObjectDetailItem } from '@onecx/portal-integration-angular'
import { map, Observable, BehaviorSubject, combineLatest } from 'rxjs'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PrimeIcons } from 'primeng/api'
import { AiContextDetailsActions } from './ai-context-details.actions'
import { AiContextDetailsViewModel } from './ai-context-details.viewmodel'
import { selectAiContextDetailsViewModel } from './ai-context-details.selectors'
import {
  MCPServer,
  AIProvider
} from 'src/app/shared/generated'

@Component({
  selector: 'app-ai-context-details',
  templateUrl: './ai-context-details.component.html',
  styleUrls: ['./ai-context-details.component.scss']
})
export class AiContextDetailsComponent implements OnInit {
  viewModel$: Observable<AiContextDetailsViewModel> = this.store.select(selectAiContextDetailsViewModel)

  headerLabels$: Observable<ObjectDetailItem[]> = this.viewModel$.pipe(
    map(() => {
      const labels: ObjectDetailItem[] = []
      return labels
    })
  )

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          titleKey: 'AI_CONTEXT_DETAILS.GENERAL.BACK',
          labelKey: 'AI_CONTEXT_DETAILS.GENERAL.BACK',
          show: 'always',
          disabled: !vm.backNavigationPossible,
          icon: PrimeIcons.ARROW_LEFT,
          conditional: true,
          showCondition: !vm.editMode,
          actionCallback: () => {
            this.goBack()
          }
        },
        {
          titleKey: 'AI_CONTEXT_DETAILS.GENERAL.EDIT',
          labelKey: 'AI_CONTEXT_DETAILS.GENERAL.EDIT',
          show: 'always',
          icon: PrimeIcons.PENCIL,
          conditional: true,
          showCondition: !vm.editMode,
          actionCallback: () => {
            this.edit()
          }
        },
        {
          titleKey: 'AI_CONTEXT_DETAILS.GENERAL.CANCEL',
          labelKey: 'AI_CONTEXT_DETAILS.GENERAL.CANCEL',
          show: 'always',
          icon: PrimeIcons.TIMES,
          conditional: true,
          showCondition: vm.editMode,
          disabled: vm.isSubmitting,
          actionCallback: () => {
            this.cancel()
          }
        },
        {
          titleKey: 'AI_CONTEXT_DETAILS.GENERAL.SAVE',
          labelKey: 'AI_CONTEXT_DETAILS.GENERAL.SAVE',
          show: 'always',
          icon: PrimeIcons.SAVE,
          conditional: true,
          disabled: vm.isSubmitting,
          showCondition: vm.editMode,
          actionCallback: () => {
            this.save()
          }
        },
        {
          titleKey: 'AI_CONTEXT_DETAILS.GENERAL.DELETE',
          labelKey: 'AI_CONTEXT_DETAILS.GENERAL.DELETE',
          icon: PrimeIcons.TRASH,
          show: 'asOverflow',
          btnClass: '',
          conditional: true,
          showCondition: !vm.editMode,
          actionCallback: () => {
            this.delete()
          }
        }
      ]
      return actions
    })
  )

  public formGroup: FormGroup

  providerQuery$: BehaviorSubject<string> = new BehaviorSubject<string>('')
  filteredProviders$: Observable<AIProvider[]>

  mcpServerQuery$: BehaviorSubject<string> = new BehaviorSubject<string>('')
  filteredMCPServers$: Observable<MCPServer[]>

  constructor(
    private readonly store: Store,
    private readonly breadcrumbService: BreadcrumbService
  ) {

    this.providerQuery$ = new BehaviorSubject<string>('')
    this.filteredProviders$ = combineLatest([this.providerQuery$, this.viewModel$]).pipe(
      map(([query, vm]) => {
        const suggestions = [...(vm.details?.provider ? [vm.details.provider] : []), ...vm.aiProviders ?? []]
        return suggestions.filter((p) =>
          (p.name + ' ' + (p.appId || '')).toLowerCase().includes(query.toLowerCase())
          && vm.details?.provider?.id !== p.id)
      })
    )

    this.mcpServerQuery$ = new BehaviorSubject<string>('')
    this.filteredMCPServers$ = combineLatest([
      this.mcpServerQuery$,
      this.viewModel$
    ]).pipe(
      map(([query, vm]) => {
        const suggestions = [...(vm.details?.mcpServers ?? []), ...vm.MCPServers ?? []]
        return suggestions.filter((mcp) =>
          (mcp.name + ' ' + (mcp.protocol || '')).toLowerCase().includes(query.toLowerCase())
          && vm.details?.mcpServers?.every(selected => selected.id !== mcp.id)
        )
      })
    )

    this.formGroup = new FormGroup({
      id: new FormControl('', [Validators.maxLength(255)]),
      appId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      mcpServers: new FormControl(undefined),
      provider: new FormControl(undefined),
    })
    this.formGroup.disable()

    this.viewModel$.subscribe((vm) => {
      if (!vm.editMode) {
        this.formGroup.patchValue({
          id: vm.details?.id || '',
          appId: vm.details?.appId || '',
          name: vm.details?.name || '',
          description: vm.details?.description || '',
          mcpServers: vm.details?.mcpServers,
          provider: vm.details?.provider,
        })

        this.formGroup.markAsPristine()
      }
      if (vm.editMode) {
        this.formGroup.enable()
      } else {
        this.formGroup.disable()
      }
    })
  }

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_CONTEXT_DETAILS.BREADCRUMB',
        labelKey: 'AI_CONTEXT_DETAILS.BREADCRUMB',
        routerLink: '/ai-context'
      }
    ])
  }

  getMCPName(mcpServer: MCPServer): string {
    return mcpServer ? `${mcpServer.name} (${mcpServer.protocol})` : ''
  }

  searchMCPServers(event: { query: string }) {
    this.mcpServerQuery$.next(event.query)
  }

  searchProviders(event: { query: string }) {
    this.providerQuery$.next(event.query)
  }

  edit() {
    this.store.dispatch(AiContextDetailsActions.editButtonClicked())
  }

  cancel() {
    this.store.dispatch(AiContextDetailsActions.cancelButtonClicked({ dirty: this.formGroup.dirty }))
  }

  save() {
    const formValue = this.formGroup.value

    const payload = {
      ...formValue
    }

    this.store.dispatch(
      AiContextDetailsActions.saveButtonClicked({
        details: payload
      })
    )
  }

  delete() {
    this.store.dispatch(AiContextDetailsActions.deleteButtonClicked())
  }

  goBack() {
    this.store.dispatch(AiContextDetailsActions.navigateBackButtonClicked())
  }
}
