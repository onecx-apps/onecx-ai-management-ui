import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { TranslateService } from '@ngx-translate/core'
import { BreadcrumbService, PortalCoreModule, UserService } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { AIKnowledgeVectorDbDetailsComponent } from './ai-knowledge-vector-db-details.component'
import { AIKnowledgeVectorDbDetailsHarness } from './ai-knowledge-vector-db-details.harness'
import { initialState } from './ai-knowledge-vector-db-details.reducers'
import { selectAIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.selectors'
import { AIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.viewmodel'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AIKnowledgeDocumentStatusEnum } from 'src/app/shared/generated'
import { PrimeIcons } from 'primeng/api'
import { of } from 'rxjs'

describe('AIKnowledgeVectorDbDetailsComponent', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    listeners.forEach((l) =>
      l({
        data: m,
        stopImmediatePropagation: () => {},
        stopPropagation: () => {}
      })
    )
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let component: AIKnowledgeVectorDbDetailsComponent
  let fixture: ComponentFixture<AIKnowledgeVectorDbDetailsComponent>
  let store: MockStore<Store>
  let breadcrumbService: BreadcrumbService
  let AIKnowledgeVectorDbDetails: AIKnowledgeVectorDbDetailsHarness

  const mockActivatedRoute = {
    snapshot: {
      data: {}
    }
  }
  const baseAIKnowledgeVectorDbDetailsViewModel: AIKnowledgeVectorDbDetailsViewModel = {
    details: {
      id: '1',
      name: 'Test name',
      description: 'Test description',
      vdb: 'Test vdb',
      vdbCollection: 'Test vdb collection',
      aiContext: {
        id: 'string',
        appId: 'string',
        name: 'string',
        description: 'string',
        modificationCount: -2147483648,
        modificationUser: 'string',
        creationUser: 'string',
        AIKnowledgeBase: {
          modificationCount: -2147483648,
          id: 'string',
          name: 'string',
          description: 'string',
          aiContext: []
        },
        aIKnowledgeVectorDb: {
          modificationCount: -2147483648,
          id: 'string',
          name: 'string',
          description: 'string',
          vdb: 'string',
          vdbCollection: 'string',
          aiContext: {}
        },
        aIKnowledgeUrl: [
          {
            modificationCount: -2147483648,
            modificationUser: 'string',
            creationUser: 'string',
            id: 'string',
            url: 'string',
            name: 'string',
            description: 'string'
          }
        ],
        aIKnowledgeDbs: [
          {
            modificationCount: -2147483648,
            modificationUser: 'string',
            id: 'string',
            name: 'string',
            description: 'string',
            db: 'string',
            user: 'string',
            pwd: 'string',
            tables: ['string']
          }
        ],
        aIKnowledgeDocuments: [
          {
            modificationCount: -2147483648,
            id: 'string',
            name: 'string',
            documentRefId: 'string',
            status: AIKnowledgeDocumentStatusEnum.New
          }
        ],
        provider: {
          modificationCount: -2147483648,
          id: 'string',
          name: 'string',
          description: 'string',
          llmUrl: 'string',
          appId: 'string',
          modelName: 'string',
          modelVersion: 'string',
          apiKey: 'string'
        }
      }
    },
    contexts: [],
    detailsLoaded: true,
    detailsLoadingIndicator: false,
    contextsLoaded: true,
    contextsLoadingIndicator: false,
    backNavigationPossible: true,
    editMode: false,
    isSubmitting: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIKnowledgeVectorDbDetailsComponent],
      imports: [
        PortalCoreModule,
        LetDirective,
        FormsModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
          'de',
          require('./../../../../assets/i18n/de.json')
        ),
        HttpClientTestingModule
      ],
      providers: [
        provideMockStore({
          initialState: { AIKnowledgeVectorDb: { details: initialState, backNavigationPossible: true } }
        }),
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents()

    const userService = TestBed.inject(UserService)
    userService.hasPermission = () => true
    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')

    store = TestBed.inject(MockStore)
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, baseAIKnowledgeVectorDbDetailsViewModel)
    store.refreshState()

    fixture = TestBed.createComponent(AIKnowledgeVectorDbDetailsComponent)
    component = fixture.componentInstance
    breadcrumbService = TestBed.inject(BreadcrumbService)
    fixture.detectChanges()
    AIKnowledgeVectorDbDetails = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      AIKnowledgeVectorDbDetailsHarness
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display correct breadcrumbs', async () => {
    jest.spyOn(breadcrumbService, 'setItems')

    component.ngOnInit()
    fixture.detectChanges()

    expect(breadcrumbService.setItems).toHaveBeenCalledTimes(1)
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const searchBreadcrumbItem = await pageHeader.getBreadcrumbItem('Details')
    expect(await searchBreadcrumbItem!.getText()).toEqual('Details')
  })

  it('should display translated headers', async () => {
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    expect(await pageHeader.getHeaderText()).toEqual('AIKnowledgeVectorDb Details')
    expect(await pageHeader.getSubheaderText()).toEqual('Display of AIKnowledgeVectorDb Details')
  })

  it.only('should have 2 inline actions', async () => {
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const inlineActions = await pageHeader.getInlineActionButtons()
    expect(inlineActions.length).toBe(2)

    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    expect(backAction).toBeTruthy()

    const editAction = await pageHeader.getInlineActionButtonByLabel('Edit')
    expect(editAction).toBeTruthy()
  })

  it('should navigate back on back button click', async () => {
    jest.spyOn(window.history, 'back')

    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    await backAction?.click()

    expect(window.history.back).toHaveBeenCalledTimes(1)
  })

  it('should display item details in form fields', async () => {
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, baseAIKnowledgeVectorDbDetailsViewModel)
    store.refreshState()

    fixture.detectChanges()
    await fixture.whenStable()

    // Ensure formGroup is initialized and updated
    if (!component.formGroup) {
      component.ngOnInit()
      fixture.detectChanges()
      await fixture.whenStable()
    }

    const pageDetails = component.formGroup.value
    expect(pageDetails).toEqual({
      ...baseAIKnowledgeVectorDbDetailsViewModel.details,
      aiContext: component.getContextFormValue(
        baseAIKnowledgeVectorDbDetailsViewModel.details?.aiContext
          ? [baseAIKnowledgeVectorDbDetailsViewModel.details?.aiContext]
          : []
      )[0]
    })
  })

  it('should display item details in page header', async () => {
    component.headerLabels$ = of([
      {
        label: 'first',
        value: 'first value'
      },
      {
        label: 'second',
        value: 'second value'
      },
      {
        label: 'third',
        icon: PrimeIcons.PLUS
      },
      {
        label: 'fourth',
        value: 'fourth value',
        icon: PrimeIcons.QUESTION
      }
    ])

    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const objectDetails = await pageHeader.getObjectInfos()
    expect(objectDetails.length).toBe(4)

    const firstDetailItem = await pageHeader.getObjectInfoByLabel('first')
    expect(await firstDetailItem?.getLabel()).toEqual('first')
    expect(await firstDetailItem?.getValue()).toEqual('first value')
    expect(await firstDetailItem?.getIcon()).toBeUndefined()

    const secondDetailItem = await pageHeader.getObjectInfoByLabel('second')
    expect(await secondDetailItem?.getLabel()).toEqual('second')
    expect(await secondDetailItem?.getValue()).toEqual('second value')
    expect(await secondDetailItem?.getIcon()).toBeUndefined()

    const thirdDetailItem = await pageHeader.getObjectInfoByLabel('third')
    expect(await thirdDetailItem?.getLabel()).toEqual('third')
    expect(await thirdDetailItem?.getValue()).toEqual('')
    expect(await thirdDetailItem?.getIcon()).toEqual(PrimeIcons.PLUS)

    const fourthDetailItem = await pageHeader.getObjectInfoByLabel('fourth')
    expect(await fourthDetailItem?.getLabel()).toEqual('fourth')
    expect(await fourthDetailItem?.getValue()).toEqual('fourth value')
    expect(await fourthDetailItem?.getIcon()).toEqual(PrimeIcons.QUESTION)
  })
})
