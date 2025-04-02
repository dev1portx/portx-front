import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitGoogleAddressSecond',
    standalone: false
})
export class SplitGoogleAddressSecondPipe implements PipeTransform {

  transform(val:string):string {
    return val.substring(val.indexOf(',')+1)
  }

}
