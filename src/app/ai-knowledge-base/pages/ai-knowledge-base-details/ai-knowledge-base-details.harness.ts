import { ComponentHarness } from '@angular/cdk/testing'
import { DataTableHarness, PageHeaderHarness } from '@onecx/angular-accelerator/testing'

export class AiKnowledgeBaseDetailsHarness extends ComponentHarness {
  static hostSelector = 'app-ai-knowledge-base-details'

  getHeader = this.locatorFor(PageHeaderHarness)
  getDataTable = this.locatorFor(DataTableHarness)
}
