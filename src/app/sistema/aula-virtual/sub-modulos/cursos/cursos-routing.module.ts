import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { CursosComponent } from './cursos/cursos.component'
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CursosComponent,
    },
    {
        path: ':id',
        component: CursoDetalleComponent,
    },
]

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CursosRoutingModule {}
