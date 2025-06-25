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

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService
  ) {
    this.formGroup = new FormGroup({
      id: new FormControl(null, [Validators.maxLength(255)]),
      appId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      aiKnowledgeBase: new FormControl(null),
      provider: new FormControl(null),
      aiKnowledgeVectorDb: new FormControl(null),
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
          aiKnowledgeBase: vm.details?.aIKnowledgeBase,
          provider: vm.details?.provider,
          aiKnowledgeVectorDb: vm.details?.aIKnowledgeVectorDb,
          aiKnowledgeUrls: vm.details?.aIKnowledgeUrl || [],
          aiKnowledgeDbs: vm.details?.aIKnowledgeDbs || [],
          aiKnowledgeDocuments: vm.details?.aIKnowledgeDocuments || []
        })

        this.knowledgeUrls = vm.details?.aIKnowledgeUrl || []
        this.knowledgeDbs = vm.details?.aIKnowledgeDbs || []
        this.documents = vm.details?.aIKnowledgeDocuments || []
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

  knowledgeBases: AIKnowledgeBase[] = []
  providers: AIProvider[] = []
  vectorDbs: AIKnowledgeVectorDb[] = []
  knowledgeUrls: AIKnowledgeUrl[] = []
  knowledgeDbs: AIKnowledgeDatabase[] = []
  documents: AIKnowledgeDocument[] = []

  selectedKnowledgeUrls: AIKnowledgeUrl[] = []
  selectedKnowledgeDbs: AIKnowledgeDatabase[] = []
  selectedDocuments: AIKnowledgeDocument[] = []

  onKnowledgeUrlsSelection(event: { value: AIKnowledgeUrl[] }) {
    this.selectedKnowledgeUrls = event.value
    this.formGroup.patchValue({ aiKnowledgeUrls: this.selectedKnowledgeUrls })
  }

  onKnowledgeDbsSelection(event: { value: AIKnowledgeDatabase[] }) {
    this.selectedKnowledgeDbs = event.value
    this.formGroup.patchValue({ aiKnowledgeDbs: this.selectedKnowledgeDbs })
  }

  onDocumentsSelection(event: { value: AIKnowledgeDocument[] }) {
    this.selectedDocuments = event.value
    this.formGroup.patchValue({ aiKnowledgeDocuments: this.selectedDocuments })
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
