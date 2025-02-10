import { ComponentHarness } from '@angular/cdk/testing'
import {
  GroupByCountDiagramHarness,
  InteractiveDataViewHarness,
  SearchHeaderHarness
} from '@onecx/angular-accelerator/testing'

export class AIKnowledgeBaseSearchHarness extends ComponentHarness {
  static hostSelector = 'app-aiknowledge-base-search'

  getHeader = this.locatorFor(SearchHeaderHarness)
  getSearchResults = this.locatorFor(InteractiveDataViewHarness)
  getDiagram = this.locatorForOptional(GroupByCountDiagramHarness)
}
