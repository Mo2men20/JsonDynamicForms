import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-prompt-component',
  templateUrl: './prompt-component.component.html',
  styleUrls: ['./prompt-component.component.scss']
})
export class PromptComponentComponent{

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { mobileType: 'ios' | 'android', promptEvent?: any },
    private bottomSheetRef: MatBottomSheetRef<PromptComponentComponent>
  ) {}

  public installPwa(): void {
    this.data.promptEvent.prompt();
    this.close();
  }

  public close() {
    this.bottomSheetRef.dismiss();
  }
}
