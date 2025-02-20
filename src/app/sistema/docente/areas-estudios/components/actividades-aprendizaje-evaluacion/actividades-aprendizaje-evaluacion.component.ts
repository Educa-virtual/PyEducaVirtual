import { Component, Input, OnChanges } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ActividadesComponent } from '../actividades/actividades.component'
import { IndicadorActividadesComponent } from '../indicador-actividades/indicador-actividades.component'
import { ContenidoSemanasComponent } from '../contenido-semanas/contenido-semanas.component'

@Component({
    selector: 'app-actividades-aprendizaje-evaluacion',
    standalone: true,
    imports: [
        PrimengModule,
        ActividadesComponent,
        IndicadorActividadesComponent,
        ContenidoSemanasComponent,
    ],
    templateUrl: './actividades-aprendizaje-evaluacion.component.html',
    styleUrl: './actividades-aprendizaje-evaluacion.component.scss',
})
export class ActividadesAprendizajeEvaluacionComponent implements OnChanges {
    @Input() iSilaboId: string

    ngOnChanges(changes) {
        if (changes.iSilaboId?.currentValue) {
            this.iSilaboId = changes.iSilaboId.currentValue
        }
    }
}
