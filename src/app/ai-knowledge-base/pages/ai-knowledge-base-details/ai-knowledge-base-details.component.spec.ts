import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { LetDirective } from '@ngrx/component'
// import { ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { TranslateService } from '@ngx-translate/core'
import { BreadcrumbService, PortalCoreModule, UserService } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PrimeIcons } from 'primeng/api'
import { of } from 'rxjs'
import { AiKnowledgeBaseDetailsActions } from './ai-knowledge-base-details.actions'
import { AiKnowledgeBaseDetailsComponent } from './ai-knowledge-base-details.component'
import { AiKnowledgeBaseDetailsHarness } from './ai-knowledge-base-details.harness'
import { initialState } from './ai-knowledge-base-details.reducers'
import { selectAiKnowledgeBaseDetailsViewModel } from './ai-knowledge-base-details.selectors'
import { AiKnowledgeBaseDetailsViewModel } from './ai-knowledge-base-details.viewmodel'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ofType } from '@ngrx/effects'

describe('AiKnowledgeBaseDetailsComponent', () => {
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  let component: AiKnowledgeBaseDetailsComponent
  let fixture: ComponentFixture<AiKnowledgeBaseDetailsComponent>
  let store: MockStore<Store>
  let breadcrumbService: BreadcrumbService
  let aiKnowledgeBaseDetails: AiKnowledgeBaseDetailsHarness

  const mockActivatedRoute = {
    snapshot: {
      data: {}
    }
  }
  const baseAiKnowledgeBaseDetailsViewModel: AiKnowledgeBaseDetailsViewModel = {
    details: undefined,
    detailsLoadingIndicator: false,
    detailsLoaded: true,
    backNavigationPossible: true,
    editMode: true,
    isSubmitting: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiKnowledgeBaseDetailsComponent],
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
          initialState: { aiKnowledgeBase: { details: initialState } }
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
    store.overrideSelector(selectAiKnowledgeBaseDetailsViewModel, baseAiKnowledgeBaseDetailsViewModel)
    store.refreshState()

    fixture = TestBed.createComponent(AiKnowledgeBaseDetailsComponent)
    component = fixture.componentInstance
    breadcrumbService = TestBed.inject(BreadcrumbService)
    fixture.detectChanges()
    aiKnowledgeBaseDetails = await TestbedHarnessEnvironment.harnessForFixture(fixture, AiKnowledgeBaseDetailsHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display correct breadcrumbs', async () => {
    jest.spyOn(breadcrumbService, 'setItems')

    component.ngOnInit()
    fixture.detectChanges()

    expect(breadcrumbService.setItems).toHaveBeenCalledTimes(1)
    const pageHeader = await aiKnowledgeBaseDetails.getHeader()
    const searchBreadcrumbItem = await pageHeader.getBreadcrumbItem('Details')
    expect(await searchBreadcrumbItem!.getText()).toEqual('Details')
  })

  it('should display translated headers', async () => {
    const pageHeader = await aiKnowledgeBaseDetails.getHeader()
    expect(await pageHeader.getHeaderText()).toEqual('AiKnowledgeBase Details')
    expect(await pageHeader.getSubheaderText()).toEqual('Display of AiKnowledgeBase Details')
  })

  it('should have 2 inline actions', async () => {
    const pageHeader = await aiKnowledgeBaseDetails.getHeader()
    const inlineActions = await pageHeader.getInlineActionButtons()
    expect(inlineActions.length).toBe(3)

    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    expect(backAction).toBeTruthy()

    // const moreAction = await pageHeader.getInlineActionButtonByIcon(PrimeIcons.ELLIPSIS_V)
    // expect(moreAction).toBeTruthy()
  })

  it('should dispatch navigateBackButtonClicked action on back button click', async () => {
    jest.spyOn(window.history, 'back')
    const doneFn = jest.fn()

    const pageHeader = await aiKnowledgeBaseDetails.getHeader()
    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    store.scannedActions$.pipe(ofType(AiKnowledgeBaseDetailsActions.navigateBackButtonClicked)).subscribe(() => {
      doneFn()
    })
    await backAction?.click()
    expect(doneFn).toHaveBeenCalledTimes(1)
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

    const pageHeader = await aiKnowledgeBaseDetails.getHeader()
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
