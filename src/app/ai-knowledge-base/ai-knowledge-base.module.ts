import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import {
  addInitializeModuleGuard,
  PortalCoreModule,
  providePortalDialogService
} from '@onecx/portal-integration-angular'
import { CalendarModule } from 'primeng/calendar'
import { SharedModule } from '../shared/shared.module'
import { aiKnowledgeBaseFeature } from './ai-knowledge-base.reducers'
import { routes } from './ai-knowledge-base.routes'
import { AiKnowledgeBaseSearchComponent } from './pages/ai-knowledge-base-search/ai-knowledge-base-search.component'
import { AiKnowledgeBaseSearchEffects } from './pages/ai-knowledge-base-search/ai-knowledge-base-search.effects'
import { AiKnowledgeBaseDetailsComponent } from './pages/ai-knowledge-base-details/ai-knowledge-base-details.component'
import { AiKnowledgeBaseDetailsEffects } from './pages/ai-knowledge-base-details/ai-knowledge-base-details.effects'

@NgModule({
  providers: [providePortalDialogService()],
  declarations: [AiKnowledgeBaseDetailsComponent, AiKnowledgeBaseSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    StoreModule.forFeature(aiKnowledgeBaseFeature),
    EffectsModule.forFeature([AiKnowledgeBaseDetailsEffects, AiKnowledgeBaseSearchEffects]),
    TranslateModule
  ]
})
export class AiKnowledgeBaseModule {}
