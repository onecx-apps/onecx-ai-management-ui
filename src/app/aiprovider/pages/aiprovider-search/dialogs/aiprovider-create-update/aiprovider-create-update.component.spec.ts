 
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { BreadcrumbService, PortalCoreModule } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { AIProviderCreateUpdateComponent } from './aiprovider-create-update.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

describe('AIProviderCreateUpdateComponent', () => {
  let component: AIProviderCreateUpdateComponent
  let fixture: ComponentFixture<AIProviderCreateUpdateComponent>

  const mockActivatedRoute = {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIProviderCreateUpdateComponent],
      imports: [
        PortalCoreModule,
        FormsModule,
        ReactiveFormsModule,
        LetDirective,
        TranslateTestingModule.withTranslations(
          'en',
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('./../../../../../../assets/i18n/en.json')
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ).withTranslations('de', require('./../../../../../../assets/i18n/de.json'))
      ],
      providers: [BreadcrumbService, { provide: ActivatedRoute, useValue: mockActivatedRoute }, 
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()]
    }).compileComponents()

    fixture = TestBed.createComponent(AIProviderCreateUpdateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
