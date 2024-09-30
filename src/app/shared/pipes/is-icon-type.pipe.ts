import { Pipe, type PipeTransform } from '@angular/core'
import { IIcon } from '../icon/icon.interface'
import { isIIcon } from '../utils/is-icon-object'

@Pipe({
    name: 'isIconType',
    standalone: true,
})
export class IsIconTypePipe implements PipeTransform {
    transform(value: IIcon | string): value is IIcon {
        return isIIcon(value)
    }
}
