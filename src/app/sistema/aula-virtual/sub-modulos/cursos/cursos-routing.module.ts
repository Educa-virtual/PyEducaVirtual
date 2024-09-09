import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
    },
    {
        path: '/:id',
        children: [
            {
                path: 'tarea',
            },
            {
                path: 'tarea/:id',
            },
        ],
    },
]

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CursosRoutingModule {}
