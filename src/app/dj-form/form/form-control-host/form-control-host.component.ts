import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input } from '@angular/core';
import { HostDirective } from '../../directives/host.directive';
import { TextComponent } from '../../types/text/text.component';
import { FormGroup, Validators, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { SelectComponent } from '../../types/select/select.component';
import { HttpClient } from '@angular/common/http';
import { RadioComponent } from '../../types/radio/radio.component';
import { CheckboxComponent, AtLeastOneChecked, CustomFormArray } from '../../types/checkbox/checkbox.component';

@Component({
  selector: 'dj-form-control-host',
  templateUrl: './form-control-host.component.html',
  styleUrls: ['./form-control-host.component.scss']
})
export class FormControlHostComponent implements OnInit {

  @Input() controlInfo: any;
  @Input() customFormGroup: FormGroup;
  @Input() isSubmitted: Subject<boolean>;
  @ViewChild(HostDirective) host: HostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private http: HttpClient) { }

  ngOnInit() {
    switch (this.controlInfo.type) {
      case 'text':
        this.prepareTextField();
        break;
      case 'select':
        this.prepareSelectField();
        break;
      case 'radio':
        this.prepareRadioField();
        break;
      case 'checkbox':
        this.prepareCheckboxField();
        break;
    }
  }

  prepareTextField() {
    let componentRef;
    let validators: ValidatorFn[] = [];

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TextComponent);

    let viewContainerRef = this.host.viewContainerRef;

    componentRef = viewContainerRef.createComponent(componentFactory);
    //init with needed data
    (<TextComponent>componentRef.instance).name = this.controlInfo.name;
    (<TextComponent>componentRef.instance).customFormGroup = this.customFormGroup;
    (<TextComponent>componentRef.instance).isSubmitted = this.isSubmitted;

    let validations = [];

    this.controlInfo.validators.forEach(validation => {
      validations.push({ 'type': validation.type, 'errorMessage': validation.errorMessage });
      switch (validation.type) {
        case 'required':
          validators.push(Validators.required);
          break;
        case 'pattern':
          validators.push(Validators.pattern(validation.regex));
          break;
      }
    });
    (<TextComponent>componentRef.instance).validations = validations;

    //add it to the form
    this.customFormGroup.addControl(this.controlInfo.name, (<TextComponent>componentRef.instance));
    this.customFormGroup.controls[this.controlInfo.name].setValidators(validators);
  }

  prepareSelectField() {
    let componentRef;
    let validators: ValidatorFn[] = [];

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SelectComponent);

    let viewContainerRef = this.host.viewContainerRef;

    componentRef = viewContainerRef.createComponent(componentFactory);
    //init with needed data
    (<SelectComponent>componentRef.instance).name = this.controlInfo.name;
    (<SelectComponent>componentRef.instance).customFormGroup = this.customFormGroup;
    (<SelectComponent>componentRef.instance).isSubmitted = this.isSubmitted;

    if (this.controlInfo.fetch) {
      var f = new Function(this.controlInfo.mapper.arguments, this.controlInfo.mapper.body);
      this.http.get(this.controlInfo.api).subscribe(res => {
        (<SelectComponent>componentRef.instance).options = f(res);
      });
    } else {
      (<SelectComponent>componentRef.instance).options = this.controlInfo.options;
    }

    let validations = [];

    this.controlInfo.validators.forEach(validation => {
      validations.push({ 'type': validation.type, 'errorMessage': validation.errorMessage });
      switch (validation.type) {
        case 'required':
          validators.push(Validators.required);
          break;
      }
    });
    (<SelectComponent>componentRef.instance).validations = validations;

    //add it to the form
    this.customFormGroup.addControl(this.controlInfo.name, (<SelectComponent>componentRef.instance));
    this.customFormGroup.controls[this.controlInfo.name].setValidators(validators);
  }

  prepareRadioField() {
    let componentRef;
    let validators: ValidatorFn[] = [];

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(RadioComponent);

    let viewContainerRef = this.host.viewContainerRef;

    componentRef = viewContainerRef.createComponent(componentFactory);
    //init with needed data
    (<RadioComponent>componentRef.instance).name = this.controlInfo.name;
    (<RadioComponent>componentRef.instance).customFormGroup = this.customFormGroup;
    (<RadioComponent>componentRef.instance).isSubmitted = this.isSubmitted;

    if (this.controlInfo.fetch) {
      var f = new Function(this.controlInfo.mapper.arguments, this.controlInfo.mapper.body);
      this.http.get(this.controlInfo.api).subscribe(res => {
        (<RadioComponent>componentRef.instance).options = f(res);
      });
    } else {
      (<RadioComponent>componentRef.instance).options = this.controlInfo.radios;
    }

    let validations = [];

    this.controlInfo.validators.forEach(validation => {
      validations.push({ 'type': validation.type, 'errorMessage': validation.errorMessage });
      switch (validation.type) {
        case 'required':
          validators.push(Validators.required);
          break;
      }
    });
    (<RadioComponent>componentRef.instance).validations = validations;

    //add it to the form
    this.customFormGroup.addControl(this.controlInfo.name, (<RadioComponent>componentRef.instance));
    this.customFormGroup.controls[this.controlInfo.name].setValidators(validators);
  }

  prepareCheckboxField() {
    let componentRef;
    let validators: ValidatorFn[] = [];

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CheckboxComponent);

    let viewContainerRef = this.host.viewContainerRef;

    componentRef = viewContainerRef.createComponent(componentFactory);
    //init with needed data
    (<CheckboxComponent>componentRef.instance).name = this.controlInfo.name;
    (<CheckboxComponent>componentRef.instance).customFormGroup = this.customFormGroup;
    (<CheckboxComponent>componentRef.instance).isSubmitted = this.isSubmitted;

    if (this.controlInfo.fetch) {
      var f = new Function(this.controlInfo.mapper.arguments, this.controlInfo.mapper.body);
      this.http.get(this.controlInfo.api).subscribe(res => {
        (<CheckboxComponent>componentRef.instance).checkboxes = f(res);
      });
    } else {
      (<CheckboxComponent>componentRef.instance).checkboxes = this.controlInfo.checkboxes;
    }

    let validations = [];

    this.controlInfo.validators.forEach(validation => {
      validations.push({ 'type': validation.type, 'errorMessage': validation.errorMessage });
      switch (validation.type) {
        case 'atLeastOne':
          validators.push(AtLeastOneChecked());
          break;
      }
    });
    (<CheckboxComponent>componentRef.instance).validations = validations;

    //add it to the form
    this.customFormGroup.addControl(this.controlInfo.name, new CustomFormArray([]));
    this.customFormGroup.controls[this.controlInfo.name].setValidators(validators);
  }

}
