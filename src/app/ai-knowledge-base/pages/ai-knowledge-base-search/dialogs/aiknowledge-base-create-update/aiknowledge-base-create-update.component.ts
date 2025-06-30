import { Component, EventEmitter, Input, OnInit } from '@angular/core'
import { DialogButtonClicked, DialogPrimaryButtonDisabled, DialogResult } from '@onecx/portal-integration-angular'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { map } from 'rxjs'
import { AIKnowledgeBase, AIKnowledgeDocumentStatusEnum } from 'src/app/shared/generated'
import { AIKnowledgeBaseCreateUpdateViewModel } from './aiknowledge-base-create-update.viewmodel'

@Component({
  selector: 'app-aiknowledge-base-create-update',
  templateUrl: './aiknowledge-base-create-update.component.html',
  styleUrls: ['./aiknowledge-base-create-update.component.scss']
})
export class AIKnowledgeBaseCreateUpdateComponent
  implements
    DialogPrimaryButtonDisabled,
    DialogResult<AIKnowledgeBase | undefined>,
    DialogButtonClicked<AIKnowledgeBaseCreateUpdateComponent>,
    OnInit
{
  @Input() public vm: AIKnowledgeBaseCreateUpdateViewModel = {
    itemToEdit: undefined
  }

  public formGroup: FormGroup

  primaryButtonEnabled = new EventEmitter<boolean>()
  dialogResult: AIKnowledgeBase | undefined = undefined
  statusValues = Object.values(AIKnowledgeDocumentStatusEnum)

  constructor() {
    this.formGroup = new FormGroup({
      id: new FormControl(null, [Validators.maxLength(255), Validators.required]),
      name: new FormControl(null, [Validators.maxLength(255), Validators.required]),
      description: new FormControl(null, [Validators.maxLength(255), Validators.required])
    })
    this.formGroup.statusChanges
      .pipe(
        map((status) => {
          return status === 'VALID'
        })
      )
      .subscribe(this.primaryButtonEnabled)
  }

  ocxDialogButtonClicked() {
    this.dialogResult = {
      ...this.vm.itemToEdit,
      ...this.formGroup.value
    }
  }

  ngOnInit() {
    if (this.vm.itemToEdit) {
      this.formGroup.patchValue({
        ...this.vm.itemToEdit
      })
    }
  }
}
