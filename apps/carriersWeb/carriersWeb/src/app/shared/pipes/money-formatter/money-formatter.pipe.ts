import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'moneyFormatter',
    standalone: false
})
export class MoneyFormatterPipe implements PipeTransform {
  transform(value: number): string {
    if (value || value === 0) {
      const formattedValue = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      return formattedValue;
    }
    return '0.00';
  }
}
