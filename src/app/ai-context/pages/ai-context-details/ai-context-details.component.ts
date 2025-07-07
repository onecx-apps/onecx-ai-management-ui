import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService, ObjectDetailItem } from '@onecx/portal-integration-angular'
import { map, Observable } from 'rxjs'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PrimeIcons } from 'primeng/api'
import { AiContextDetailsActions } from './ai-context-details.actions'
import { AiContextDetailsViewModel } from './ai-context-details.viewmodel'
import { selectAiContextDetailsViewModel } from './ai-context-details.selectors'
import {
  AIKnowledgeBase,
  AIKnowledgeDatabase,
  AIKnowledgeDocument,
  AIKnowledgeUrl,
  AIKnowledgeVectorDb,
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
          icon: PrimeIcons.ARROW_LEFT,
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

  knowledgeBases: AIKnowledgeBase[] = []
  providers: AIProvider[] = []
  vectorDbs: AIKnowledgeVectorDb[] = []

  knowledgeUrlOptions$: Observable<AIKnowledgeUrl[]> = this.viewModel$.pipe(
    map((vm) => vm.details?.aIKnowledgeUrl || [])
  )
  knowledgeDbOptions$: Observable<AIKnowledgeDatabase[]> = this.viewModel$.pipe(
    map((vm) => vm.details?.aIKnowledgeDbs || [])
  )
  documentOptions$: Observable<AIKnowledgeDocument[]> = this.viewModel$.pipe(
    map((vm) => vm.details?.aIKnowledgeDocuments || [])
  )

  knowledgeBaseSuggestions: AIKnowledgeBase[] = []
  providerSuggestions: AIProvider[] = []
  vectorDbSuggestions: AIKnowledgeVectorDb[] = []

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService
  ) {
    this.formGroup = new FormGroup({
      id: new FormControl(null, [Validators.maxLength(255)]),
      appId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      aiKnowledgeBase: new FormControl([]),
      provider: new FormControl([]),
      aiKnowledgeVectorDb: new FormControl([]),
      aiKnowledgeUrls: new FormControl([]),
      aiKnowledgeDbs: new FormControl([]),
      aiKnowledgeDocuments: new FormControl([])
    })
    this.formGroup.disable()

    this.viewModel$.subscribe((vm) => {
      if (!vm.editMode) {
        this.formGroup.patchValue({
          appId: vm.details?.appId,
          name: vm.details?.name,
          description: vm.details?.description,
          aiKnowledgeBase: Array.isArray(vm.details?.aIKnowledgeBase) ? vm.details?.aIKnowledgeBase[0] : null,
          provider: Array.isArray(vm.details?.provider) ? vm.details?.provider[0] : null,
          aiKnowledgeVectorDb: Array.isArray(vm.details?.aIKnowledgeVectorDb)
            ? vm.details?.aIKnowledgeVectorDb[0]
            : null,
          aiKnowledgeUrls: vm.details?.aIKnowledgeUrl || [],
          aiKnowledgeDbs: vm.details?.aIKnowledgeDbs || [],
          aiKnowledgeDocuments: vm.details?.aIKnowledgeDocuments || []
        })

        this.providers = vm.details?.provider || []
        this.knowledgeBases = vm.details?.aIKnowledgeBase || []
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

  searchKnowledgeBases(event: { query: string }) {
    const query = event.query.toLowerCase()
    this.knowledgeBaseSuggestions = this.knowledgeBases.filter((kb) =>
      (kb.name + ' ' + kb.appId).toLowerCase().includes(query)
    )
  }

  searchProviders(event: { query: string }) {
    const query = event.query.toLowerCase()
    this.providerSuggestions = this.providers.filter((p) => (p.name + ' ' + p.appId).toLowerCase().includes(query))
  }

  searchVectorDbs(event: { query: string }) {
    const query = event.query.toLowerCase()
    this.vectorDbSuggestions = this.vectorDbs.filter((vdb) =>
      (vdb.name + ' ' + (vdb.description || '')).toLowerCase().includes(query)
    )
  }

  edit() {
    this.store.dispatch(AiContextDetailsActions.editButtonClicked())
  }

  cancel() {
    this.store.dispatch(AiContextDetailsActions.cancelButtonClicked({ dirty: this.formGroup.dirty }))
  }

  save() {
    this.store.dispatch(
      AiContextDetailsActions.saveButtonClicked({
        details: this.formGroup.value
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
