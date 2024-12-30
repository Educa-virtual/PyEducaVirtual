import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnChanges } from '@angular/core'

@Component({
    selector: 'app-no-data',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './no-data.component.html',
    styleUrl: './no-data.component.scss',
})
export class NoDataComponent implements OnChanges {
    @Input() showIcon: 'NO-DATA' | 'ERROR' = 'ERROR'
    @Input() mensaje: string =
        '¡Ups...! Algo salió mal o no encontramos datos en estos momentos'

    ngOnChanges(changes) {
        if (changes.showIcon?.currentValue) {
            this.showIcon = changes.showIcon.currentValue
        }
        if (changes.mensaje?.currentValue) {
            this.mensaje = changes.mensaje.currentValue
        }
    }

    recargar() {
        window.location.reload()
    }
}
