import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitGoogleAddress',
    standalone: false
})
export class SplitGoogleAddressPipe implements PipeTransform {

  transform(val:string):string[] {
    return val.split(',', 1);
  }

}
