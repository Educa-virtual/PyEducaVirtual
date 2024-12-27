import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HorarioComponent } from './horario.component'
import { ConfiguracionHorarioComponent } from './configuracion-horario/configuracion-horario.component'

const routes: Routes = [
    { path: 'horario', component: HorarioComponent },
    { path: 'configurar-horario', component: ConfiguracionHorarioComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HorarioRoutingModule {}
