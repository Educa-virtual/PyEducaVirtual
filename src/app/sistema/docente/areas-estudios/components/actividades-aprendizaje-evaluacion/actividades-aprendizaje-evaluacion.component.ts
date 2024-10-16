import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, Input, OnChanges } from '@angular/core'
import { FormActividadesAprendizajeEvaluacionComponent } from '../form-actividades-aprendizaje-evaluacion/form-actividades-aprendizaje-evaluacion.component'
import { PrimengModule } from '@/app/primeng.module'
import { ActividadesComponent } from '../actividades/actividades.component'
import { IndicadorActividadesComponent } from '../indicador-actividades/indicador-actividades.component'
import { ContenidoSemanasComponent } from '../contenido-semanas/contenido-semanas.component'

@Component({
    selector: 'app-actividades-aprendizaje-evaluacion',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        FormActividadesAprendizajeEvaluacionComponent,
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
