import { Routes } from '@angular/router'
import { AiKnowledgeBaseDetailsComponent } from './pages/ai-knowledge-base-details/ai-knowledge-base-details.component'
import { AiKnowledgeBaseSearchComponent } from './pages/ai-knowledge-base-search/ai-knowledge-base-search.component'

export const routes: Routes = [
  { path: 'details/:id', component: AiKnowledgeBaseDetailsComponent, pathMatch: 'full' },
  { path: '', component: AiKnowledgeBaseSearchComponent, pathMatch: 'full' }
]
