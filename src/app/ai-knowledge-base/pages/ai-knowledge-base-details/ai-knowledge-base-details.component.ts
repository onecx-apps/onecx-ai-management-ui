import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService, ObjectDetailItem } from '@onecx/portal-integration-angular'
import { combineLatest, map, Observable } from 'rxjs'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PrimeIcons } from 'primeng/api'
import { AiKnowledgeBaseDetailsActions } from './ai-knowledge-base-details.actions'
import { selectAiKnowledgeBaseDetailsViewModel } from './ai-knowledge-base-details.selectors'
import { AiKnowledgeBaseDetailsViewModel } from './ai-knowledge-base-details.viewmodel'
import { AIContext } from 'src/app/shared/generated'

@Component({
  selector: 'app-ai-knowledge-base-details',
  templateUrl: './ai-knowledge-base-details.component.html',
  styleUrls: ['./ai-knowledge-base-details.component.scss']
})
export class AiKnowledgeBaseDetailsComponent implements OnInit {
  public formGroup: FormGroup

  viewModel$: Observable<AiKnowledgeBaseDetailsViewModel> = this.store.select(selectAiKnowledgeBaseDetailsViewModel)

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
          titleKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.BACK',
          labelKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.BACK',
          show: 'always',
          disabled: !vm.backNavigationPossible,
          icon: PrimeIcons.ARROW_LEFT,
          conditional: true,
          permission: 'AI_KNOWLEDGE_BASE#BACK',
          showCondition: !vm.editMode,

          actionCallback: () => {
            this.goBack()
          }
        },
        {
          titleKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.EDIT',
          labelKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.EDIT',
          show: 'always',
          icon: PrimeIcons.PENCIL,
          conditional: true,
          showCondition: !vm.editMode,
          actionCallback: () => {
            this.edit()
          }
        },
        {
          titleKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.CANCEL',
          labelKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.CANCEL',
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
          titleKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.SAVE',
          labelKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.SAVE',
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
          titleKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.DELETE',
          labelKey: 'AI_KNOWLEDGE_BASE_DETAILS.GENERAL.DELETE',
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
  displayContexts$: Observable<AIContext[]>

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService
  ) {
    this.displayContexts$ = this.viewModel$.pipe(
      map(({ details, contexts }) => {
        const aiContexts = Array.isArray(details?.aiContext) ? details.aiContext : []
        const missing = aiContexts.filter((ctx) => !contexts.some((c) => c.id === ctx.id))
        if (missing.length === 0) {
          return aiContexts
        }
        return [...aiContexts, ...missing]
      })
    )

    this.formGroup = new FormGroup({
      id: new FormControl('', [Validators.maxLength(255)]),
      name: new FormControl('', [Validators.maxLength(255)]),
      description: new FormControl('', [Validators.maxLength(255)]),
      aiContext: new FormControl([], [Validators.maxLength(255)])
    })
    this.formGroup.disable()

    combineLatest([this.viewModel$, this.displayContexts$]).subscribe(([vm, displayContexts]) => {
      if (!vm.editMode) {
        const chosenContexts = vm.details?.aiContext ?? []
        const matchedContexts = displayContexts.filter((context: AIContext) =>
          chosenContexts.some((chosen: AIContext) => context.id === chosen.id)
        )

        this.formGroup.patchValue({
          id: vm.details?.id,
          name: vm.details?.name,
          description: vm.details?.description,
          aiContext: matchedContexts
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
        titleKey: 'AI_KNOWLEDGE_BASE_DETAILS.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_BASE_DETAILS.BREADCRUMB',
        routerLink: '/ai-knowledge-base'
      }
    ])
  }

  edit() {
    this.store.dispatch(AiKnowledgeBaseDetailsActions.editButtonClicked())
  }

  goBack() {
    this.store.dispatch(AiKnowledgeBaseDetailsActions.navigateBackButtonClicked())
  }

  cancel() {
    this.store.dispatch(AiKnowledgeBaseDetailsActions.cancelButtonClicked({ dirty: this.formGroup.dirty }))
  }

  save() {
    this.store.dispatch(
      AiKnowledgeBaseDetailsActions.saveButtonClicked({
        details: this.formGroup.value
      })
    )
  }

  delete() {
    this.store.dispatch(AiKnowledgeBaseDetailsActions.deleteButtonClicked())
  }
}
