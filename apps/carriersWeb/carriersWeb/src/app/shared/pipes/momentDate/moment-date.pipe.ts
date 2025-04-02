import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'momentDate',
    standalone: false
})
export class MomentDatePipe implements PipeTransform {
    transform(value: Date | moment.Moment, dateFormat: string): any {
        return moment(value).format(dateFormat);
    }
}
