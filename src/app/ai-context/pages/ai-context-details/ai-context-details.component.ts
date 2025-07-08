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

  providers$: Observable<AIProvider[]> = this.viewModel$.pipe(map((vm) => vm.details?.provider || []))
  providerSuggestions: AIProvider[] = []

  knowledgeBases$: Observable<AIKnowledgeBase[]> = this.viewModel$.pipe(map((vm) => vm.details?.AIKnowledgeBase || []))
  knowledgeBaseSuggestions: AIKnowledgeBase[] = []

  vectorDbs$: Observable<AIKnowledgeVectorDb[]> = this.viewModel$.pipe(
    map((vm) => vm.details?.aIKnowledgeVectorDb || [])
  )
  vectorDbSuggestions: AIKnowledgeVectorDb[] = []

  knowledgeUrlOptions$: Observable<AIKnowledgeUrl[]> = this.viewModel$.pipe(
    map((vm) => vm.details?.aIKnowledgeUrl || [])
  )
  knowledgeDbOptions$: Observable<AIKnowledgeDatabase[]> = this.viewModel$.pipe(
    map((vm) => vm.details?.aIKnowledgeDbs || [])
  )
  documentOptions$: Observable<AIKnowledgeDocument[]> = this.viewModel$.pipe(
    map((vm) => vm.details?.aIKnowledgeDocuments || [])
  )

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService
  ) {
    this.formGroup = new FormGroup({
      id: new FormControl('', [Validators.maxLength(255)]),
      appId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      AIKnowledgeBase: new FormControl(null),
      provider: new FormControl(null),
      aIKnowledgeVectorDb: new FormControl(null),
      aIKnowledgeUrl: new FormControl([]),
      aIKnowledgeDbs: new FormControl([]),
      aIKnowledgeDocuments: new FormControl([])
    })
    this.formGroup.disable()

    this.viewModel$.subscribe((vm) => {
      if (!vm.editMode) {
        this.formGroup.patchValue({
          appId: vm.details?.appId,
          name: vm.details?.name,
          description: vm.details?.description,
          AIKnowledgeBase: vm.details?.AIKnowledgeBase ? vm.details?.AIKnowledgeBase[0] : null,
          provider: vm.details?.provider ? vm.details?.provider[0] : null,
          aIKnowledgeVectorDb: vm.details?.aIKnowledgeVectorDb ? vm.details?.aIKnowledgeVectorDb[0] : null,
          aIKnowledgeUrl: vm.details?.aIKnowledgeUrl || [],
          aIKnowledgeDbs: vm.details?.aIKnowledgeDbs || [],
          aIKnowledgeDocuments: vm.details?.aIKnowledgeDocuments || []
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

  searchKnowledgeBases(event: { query: string }) {
    const query = event.query.toLowerCase()
    this.knowledgeBases$
      .subscribe((bases) => {
        this.knowledgeBaseSuggestions = bases.filter((kb) => (kb.name + ' ' + kb.appId).toLowerCase().includes(query))
      })
      .unsubscribe()
  }

  searchProviders(event: { query: string }) {
    const query = event.query.toLowerCase()
    this.providers$
      .subscribe((providers) => {
        this.providerSuggestions = providers.filter((p) => (p.name + ' ' + p.appId).toLowerCase().includes(query))
      })
      .unsubscribe()
  }

  searchVectorDbs(event: { query: string }) {
    const query = event.query.toLowerCase()
    this.vectorDbs$
      .subscribe((vectorDbs) => {
        this.vectorDbSuggestions = vectorDbs.filter((vdb) =>
          (vdb.name + ' ' + (vdb.description || '')).toLowerCase().includes(query)
        )
      })
      .unsubscribe()
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
      ...formValue,
      AIKnowledgeBase: formValue.AIKnowledgeBase ? [formValue.AIKnowledgeBase] : [],
      provider: formValue.provider ? [formValue.provider] : [],
      aIKnowledgeVectorDb: formValue.aIKnowledgeVectorDb ? [formValue.aIKnowledgeVectorDb] : []
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
