import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CalendarioAcademicoComponent } from './calendario-academico/calendario-academico.component'

const routes: Routes = [
    { path: 'calendarioAcademico', component: CalendarioAcademicoComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GestionInstitucionalRoutingModule {}
