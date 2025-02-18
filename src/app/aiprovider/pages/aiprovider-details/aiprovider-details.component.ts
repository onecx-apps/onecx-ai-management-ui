import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService, UserService } from '@onecx/portal-integration-angular'
import { map, Observable } from 'rxjs'

import { PrimeIcons } from 'primeng/api'
import { AIProviderDetailsSelectors, selectAIProviderDetailsViewModel } from './aiprovider-details.selectors'
import { AIProviderDetailsViewModel } from './aiprovider-details.viewmodel'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AIProviderSearchActions } from '../aiprovider-search/aiprovider-search.actions'
import { AIProviderDetailsActions } from './aiprovider-details.actions'

@Component({
  selector: 'app-aiprovider-details',
  templateUrl: './aiprovider-details.component.html',
  styleUrls: ['./aiprovider-details.component.scss']
})
export class AIProviderDetailsComponent implements OnInit {
  viewModel$!: Observable<AIProviderDetailsViewModel> 
  headerActions$!: Observable<Action[]>
  public AIProviderFormGroup!: FormGroup
  public formGroup: FormGroup
  isApiKeyHidden$!: Observable<boolean>

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService,
    private user: UserService
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.maxLength(255)]),
      description: new FormControl(null, [Validators.maxLength(255)]),
      llmUrl: new FormControl(null, [Validators.maxLength(255)]),
      appId: new FormControl(null, [Validators.maxLength(255)]),
      modelName: new FormControl(null, [Validators.maxLength(255)]),
      modelVersion: new FormControl(null, [Validators.maxLength(255)]),
      apiKey: new FormControl(null, [Validators.maxLength(255)])
    })
  }

  ngOnInit(): void {
    this.viewModel$ = this.store.select(selectAIProviderDetailsViewModel)
    this.isApiKeyHidden$ = this.store.select(AIProviderDetailsSelectors.selectIsApiKeyHidden)
    
    this.headerActions$ = this.viewModel$.pipe(
      map((vm) => {
        const actions: Action[] = [
          {
            titleKey: 'AI_PROVIDER_DETAILS.GENERAL.BACK',
            labelKey: 'AI_PROVIDER_DETAILS.GENERAL.BACK',
            show: 'always',
            icon: PrimeIcons.ARROW_LEFT,
            conditional: true,
            showCondition: !vm.editMode,
            actionCallback: () => {
              window.history.back()
            }
          },
          {
            titleKey: 'AI_PROVIDER_DETAILS.GENERAL.EDIT',
            labelKey: 'AI_PROVIDER_DETAILS.GENERAL.EDIT',
            show: 'always',
            icon: PrimeIcons.PENCIL,
            conditional: true,
            showCondition: !vm.editMode,
            actionCallback: () => {
              this.toggleEditMode(true)
            }
          },
          {
            titleKey: 'AI_PROVIDER_DETAILS.GENERAL.DELETE',
            labelKey: 'AI_PROVIDER_DETAILS.GENERAL.DELETE',
            icon: PrimeIcons.TRASH,
            show: 'asOverflow',
            btnClass: '',
            conditional: true,
            showCondition: !vm.editMode,
            actionCallback: () => {
              this.delete(vm.details?.id ?? '')
            },
          },
          {
            titleKey: 'AI_PROVIDER_DETAILS.GENERAL.CANCEL',
            labelKey: 'AI_PROVIDER_DETAILS.GENERAL.CANCEL',
            show: 'always',
            icon: PrimeIcons.TIMES,
            conditional: true,
            showCondition: vm.editMode,
            actionCallback: () => {
              this.toggleEditMode(false)
            }
          },
          {
            titleKey: 'AI_PROVIDER_DETAILS.GENERAL.SAVE',
            labelKey: 'AI_PROVIDER_DETAILS.GENERAL.SAVE',
            show: 'always',
            icon: PrimeIcons.SAVE,
            conditional: true,
            showCondition: vm.editMode,
            actionCallback: () => {
              this.edit(vm.details?.id ?? '')
              this.toggleEditMode(false)
            }
          }   
        ]
        return actions
      })
    )

    this.viewModel$.subscribe((AIProvider) => {
      this.formGroup.patchValue({
        name: AIProvider.details?.name ?? '',
        description: AIProvider.details?.description,
        llmUrl: AIProvider.details?.llmUrl,
        appId: AIProvider.details?.appId,
        modelName: AIProvider.details?.modelName,
        modelVersion: AIProvider.details?.modelVersion,
        apiKey: AIProvider.details?.apiKey
      })
    })
    this.formGroup.disable()

    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_PROVIDER_DETAILS.BREADCRUMB',
        labelKey: 'AI_PROVIDER_DETAILS.BREADCRUMB',
        routerLink: '/aiprovider'
      }
    ])
  }

  edit(id : string ) {
      this.store.dispatch(AIProviderSearchActions.editAiproviderDetailsButtonClicked({ id }))
    }
  
  delete(id : string ) {
      this.store.dispatch(AIProviderSearchActions.deleteAiproviderButtonClicked({ id }))
  }

  toggleEditMode(value: boolean) {
    this.store.dispatch(AIProviderDetailsActions.aiproviderDetailsEditModeSet({editMode: value}))
    if (!value) {
      this.formGroup.disable()
    } else {
      this.formGroup.enable()
    }
    if(!this.user.hasPermission('AI_PROVIDER#CHANGE_API_KEY')) {
      this.formGroup.get('apiKey')?.disable()
    }
  }

  toggleApiKeyVisibility() {
    this.store.dispatch(AIProviderDetailsActions.apiKeyVisibilityToggled())
  }
}
