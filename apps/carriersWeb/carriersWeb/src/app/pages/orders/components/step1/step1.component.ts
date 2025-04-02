import { Component, OnInit, Output, EventEmitter, SimpleChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BegoRfcInputInfo, BegoRfcInputInfoOutput } from '@begomx/ui-components';
import { TranslateService } from '@ngx-translate/core';
import { start } from 'repl';

import { GoogleLocation } from 'src/app/shared/interfaces/google-location';
import { GoogleMapsService } from 'src/app/shared/services/google-maps/google-maps.service';

const MAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const PHONE_REGEX = /^([0-9]{2}\s?){5}$/;

@Component({
    selector: 'app-step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.scss'],
    standalone: false
})
export class Step1Component implements OnInit {
  public phoneFlag = 'mx';
  public phoneCode = '+52';
  public phoneNumber = '';

  @Input() public cardIsOpen = false;
  @Input() public locations: GoogleLocation = {
    pickup: '',
    dropoff: '',
    pickupLat: '',
    pickupLng: '',
    dropoffLat: '',
    dropoffLng: '',
    pickupPostalCode: 0,
    dropoffPostalCode: 0,
  };
  @Input() public datePickup: number;
  @Input() public draftData: any;
  @Input() public orderWithCP: boolean;
  @Output() public step1FormData: EventEmitter<any> = new EventEmitter();
  @Output() public validFormStep1: EventEmitter<boolean> = new EventEmitter();

  public step1Form: FormGroup;
  public phoneValidator;
  public emailValidator;
  public isDraft: boolean = false;

  public rfcComponentValues: Partial<BegoRfcInputInfo>;

  constructor(
    private formBuilder: FormBuilder,
    private googleService: GoogleMapsService,
    private translateService: TranslateService,
  ) {
    this.step1Form = this.formBuilder.group({
      fullname: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(MAIL_REGEX)]],
      phoneCode: [this.phoneCode],
      phonenumber: [this.phoneNumber, [Validators.required, Validators.pattern(PHONE_REGEX)]],
      reference: [null, Validators.required],
      country_code: [this.phoneFlag],
      orderWithCP: [false],
      rfc: [null],
      registration_number: [null],
      country_of_residence: [null],
      company_name: [null],
      start_date: [null],
    });

    this.phoneValidator = {
      _firstCheck: true,
      errorMsg: this.translateService.instant('orders.invalid-phone'),
      isValid(value: string) {
        if (this._firstCheck) {
          this._firstCheck = false;
          return true;
        }

        return PHONE_REGEX.test(value);
      },
    };

    this.emailValidator = {
      _firstCheck: true,
      errorMsg: this.translateService.instant('orders.invalid-email'),
      isValid(value: string) {
        if (this._firstCheck) {
          this._firstCheck = false;
          return true;
        }

        return MAIL_REGEX.test(value);
      },
    };
  }

  public ngOnInit(): void {
    this.step1Form.get('orderWithCP').valueChanges.subscribe((value) => {
      const rfc = this.step1Form.get('rfc');
      if (this.orderWithCP) {
        rfc.setValidators(
          Validators.compose([
            Validators.minLength(12),
            Validators.pattern(
              /^([A-Z&]{3,4})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z&\d]{2}(?:[A&\d]))?$/,
            ),
          ]),
        );
      } else {
        rfc.clearValidators();
      }
      rfc.updateValueAndValidity();
    });

    this.step1Form.statusChanges.subscribe((val) => {
      if (val === 'VALID') {
        this.validFormStep1.emit(true);
      } else {
        this.validFormStep1.emit(false);
      }
    });

    this.step1Form.valueChanges.subscribe(() => {
      this.step1FormData.emit(this.step1Form.value);
      const date = this.datePickup;
      this.step1FormData.emit({ ...this.step1Form.value, start_date: date, end_date: date });
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    this.step1Form.get('orderWithCP').setValue(this.orderWithCP);
    if (changes.draftData && changes.draftData.currentValue) {
      this.isDraft = true;
      const draft = changes.draftData.currentValue;
      const [pickup] = draft.destinations;

      if (pickup?.contact_info?.telephone) {
        let [telephoneCode, ...telephone] = pickup.contact_info.telephone.split(' ');
        telephone = telephone.join(' ');
        this.phoneCode = telephoneCode;
        this.phoneFlag = pickup.contact_info.country_code;
        this.phoneNumber = telephone;
        this.step1Form.get('phonenumber')!.setValue(telephone);
        this.step1Form.get('phoneCode')!.setValue(telephoneCode);
      }

      this.step1Form.get('fullname')!.setValue(pickup?.contact_info?.name || '');
      this.step1Form.get('email')!.setValue(pickup?.contact_info?.email || '');
      this.step1Form.get('reference')!.setValue(changes.draftData.currentValue?.reference_number || '');

      const countryCode = pickup?.contact_info?.country_code || '';
      if (countryCode) this.step1Form.get('country_code')!.setValue(countryCode);

      this.validFormStep1.emit(this.step1Form.valid);
      this.datePickup = pickup.start_date;

      if (!pickup?.start_date) {
        const validators = [Validators.required];
        const start_date = this.step1Form.get('start_date')!;
        start_date.setValidators(validators);
      }

      if (this.draftData['stamp']) {
        if (pickup.tax_information) {
          this.rfcComponentValues = pickup.tax_information;
          this.step1Form.get('company_name').setValue(pickup.tax_information.company_name || '');
        }

        this.step1Form.get('rfc').setValue(pickup?.contact_info?.rfc || '');
      }
    }
  }

  public phoneCodeChanged(data: any) {
    this.phoneFlag = data.code;
    this.phoneCode = data.dial_code;

    this.step1Form.patchValue({
      country_code: data.code,
      phoneCode: data.dial_code,
    });
  }

  public phoneNumberChangeValue(data: any) {
    this.phoneNumber = data.value;
    this.step1Form.get('phonenumber')!.setValue(data.value);
  }

  public updateFormGroup(data: any) {
    this.step1Form.get(data.key)!.setValue(data.value);
  }

  public updateRFC(data: BegoRfcInputInfoOutput) {
    const { isInternationalRFC, values } = data;

    this.step1Form.patchValue({
      rfc: values.rfc,
      registration_number: isInternationalRFC ? values.registration_number : '',
      country_of_residence: isInternationalRFC ? values.country_of_residence : '',
    });
  }

  public changeLocation(type: string) {
    this.googleService.hidePreviewMap(type);
  }

  public getPickupDate(date: any) {
    this.datePickup = date;
    this.step1Form.patchValue({
      start_date: date,
    });
  }
}
