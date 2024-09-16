import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PortafolioComponent } from './portafolio/portafolio.component'
import { EstudiosComponent } from './estudios/estudios.component'
import { AreasEstudiosComponent } from './areas-estudios/areas-estudios.component'
import { ItinerarioFormativoComponent } from './itinerario-formativo/itinerario-formativo.component'
import { FichaActividadesComponent } from './ficha-actividades/ficha-actividades.component'
import { SilaboComponent } from './silabo/silabo.component'
import { AsistenciaComponent } from './asistencia/asistencia.component'
import { DetalleAsistenciaComponent } from './asistencia/detalle-asistencia/detalle-asistencia.component'
import { PersonalComponent } from './personal/personal.component'
import { SesionAprendizajeComponent } from './sesion-aprendizaje/sesion-aprendizaje.component'

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'portafolio', component: PortafolioComponent },
            { path: 'estudios', component: EstudiosComponent },
            { path: 'areas-estudio', component: AreasEstudiosComponent },
            {
                path: 'itinerario-formativo',
                component: ItinerarioFormativoComponent,
            },
            { path: 'ficha-actividades', component: FichaActividadesComponent },
            { path: 'silabo', component: SilaboComponent },
            { path: 'asistencia', component: AsistenciaComponent },
            {
                path: 'detalle-asistencia',
                component: DetalleAsistenciaComponent,
            },
            { path: 'personal', component: PersonalComponent },
            {
                path: 'sesion-aprendizaje',
                component: SesionAprendizajeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DocenteRoutingModule {}
