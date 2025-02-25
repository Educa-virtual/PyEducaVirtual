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
import { GestionarSilaboComponent } from './areas-estudios/components/gestionar-silabo/gestionar-silabo.component'
import { PerfilComponent } from './perfil/perfil.component'
import { ActividadesNoLectivasComponent } from './actividades-no-lectivas/actividades-no-lectivas.component'
import { MaterialEducativoComponent } from './material-educativo/material-educativo.component'
import { CalendarioComponent } from './calendario/calendario.component'
import { InformesComponent } from './informes/informes.component'
import { ComunicadosComponent } from './comunicados/comunicados.component'

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'comunicados', component: ComunicadosComponent },
            { path: 'portafolio', component: PortafolioComponent },
            { path: 'estudios', component: EstudiosComponent },
            { path: 'areas-curriculares', component: AreasEstudiosComponent },
            {
                path: 'itinerario-formativo',
                component: ItinerarioFormativoComponent,
            },
            { path: 'ficha-actividades', component: FichaActividadesComponent },
            { path: 'silabo', component: SilaboComponent },
            {
                path: 'asistencia/:iCursoId/:cCursoNombre/:iNivelGradoId/:iSeccionId/:iDocenteId/:iYAcadId/:iGradoId/:cNivelTipoNombre/:cGradoAbreviacion/:cSeccion/:cCicloRomanos/:cNivelNombreCursos/:nombrecompleto',
                component: AsistenciaComponent,
            },
            {
                path: 'detalle-asistencia',
                component: DetalleAsistenciaComponent,
            },
            { path: 'personal', component: PersonalComponent },
            {
                path: 'sesion-aprendizaje',
                component: SesionAprendizajeComponent,
            },
            {
                path: 'gestionar-programacion-curricular/:idDocCursoId/:cCursoNombre/:iAvanceSilabo',
                component: GestionarSilaboComponent,
            },
            {
                path: 'perfil',
                component: PerfilComponent,
            },
            {
                path: 'actividades-no-lectivas',
                component: ActividadesNoLectivasComponent,
            },
            {
                path: 'material-educativo/:idDocCursoId/:cCursoNombre',
                component: MaterialEducativoComponent,
            },
            {
                path: 'calendario',
                component: CalendarioComponent,
            },
            {
                path: 'informes',
                component: InformesComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DocenteRoutingModule {}
