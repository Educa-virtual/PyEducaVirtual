import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FichaSocioeconomicaComponent } from './ficha-socioeconomica/ficha-socioeconomica.component'
import { FichasocgeneralComponent } from './fichasocgeneral/fichasocgeneral.component'
import { FichavistapoderadoComponent } from './fichavistapoderado/fichavistapoderado.component'

const routes: Routes = [
    { path: 'ficha-socioeconomica', component: FichaSocioeconomicaComponent },
    { path: 'fichasocgeneral', component: FichasocgeneralComponent },
    { path: 'fichavistapoderado', component: FichavistapoderadoComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SocioeconomicaRoutingModule {}
