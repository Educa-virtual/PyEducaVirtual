import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
    },
    {
        path: 'cursos',
        loadChildren: () =>
            import('./sub-modulos/cursos/cursos.module').then(
                (m) => m.CursosModule
            ),
    },
]

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes), CommonModule],
})
export class AulaVirtualRoutingModule {}
