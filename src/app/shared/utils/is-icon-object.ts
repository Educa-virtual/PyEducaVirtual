import { IIcon } from '../icon/icon.interface'

export function isIIcon(icon: string | IIcon): icon is IIcon {
    return (icon as IIcon).name !== undefined
}
