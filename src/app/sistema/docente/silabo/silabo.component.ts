import { PrimengModule } from '@/app/primeng.module'
import { BtnLoadingComponent } from '@/app/shared/btn-loading/btn-loading.component'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component } from '@angular/core'
import { RecursosDidacticosComponent } from '../areas-estudios/components/recursos-didacticos/recursos-didacticos.component'
import { ActividadesAprendizajeEvaluacionComponent } from '../areas-estudios/components/actividades-aprendizaje-evaluacion/actividades-aprendizaje-evaluacion.component'
import { EvaluacionComponent } from '../areas-estudios/components/evaluacion/evaluacion.component'
import { BibliografiaComponent } from '../areas-estudios/components/bibliografia/bibliografia.component'

@Component({
    selector: 'app-silabo',
    standalone: true,
    imports: [
        ContainerPageComponent,
        PrimengModule,
        BtnLoadingComponent,
        TablePrimengComponent,
        RecursosDidacticosComponent,
        ActividadesAprendizajeEvaluacionComponent,
        EvaluacionComponent,
        BibliografiaComponent,
    ],
    templateUrl: './silabo.component.html',
    styleUrl: './silabo.component.scss',
})
export class SilaboComponent {
    activeStepper: number = 0
    silabo = [
        { iSilabo: 1, cSilaboTitle: 'Información General', icon: 'pi-info' },
        { iSilabo: 2, cSilaboTitle: 'Perfil del Egreso', icon: 'pi-id-card' },
        {
            iSilabo: 3,
            cSilaboTitle: 'Unidad Didáctica, Capacidad y Metodología',
            icon: 'pi-list-check',
        },
        { iSilabo: 4, cSilaboTitle: 'Recursos Didácticos', icon: 'pi-gift' },
        {
            iSilabo: 5,
            cSilaboTitle:
                'Desarrollo de Actividades de Aprendizaje y de Evaluación',
            icon: 'pi-clipboard',
        },
        { iSilabo: 6, cSilaboTitle: 'Evaluación', icon: 'pi-check-square' },
        { iSilabo: 7, cSilaboTitle: 'Bibliografía', icon: 'pi-address-book' },
    ]
}
