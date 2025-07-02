import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HorarioComponent } from './horario.component'
import { ConfiguracionHorarioComponent } from './configuracion-horario/configuracion-horario.component'
import { ConfBlockHorarioComponent } from './conf-block-horario/conf-block-horario.component'

const routes: Routes = [
    { path: 'horario', component: HorarioComponent },
    { path: 'configurar-bloque-horario', component: ConfBlockHorarioComponent },
    { path: 'configurar-horario', component: ConfiguracionHorarioComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HorarioRoutingModule {}
