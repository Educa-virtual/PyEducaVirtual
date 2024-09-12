import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortafolioComponent } from './portafolio/portafolio.component';
import { EstudiosComponent } from './estudios/estudios.component';
import { AreasEstudiosComponent } from './areas-estudios/areas-estudios.component';
import { ItinerarioFormativoComponent } from './itinerario-formativo/itinerario-formativo.component';
import { FichaActividadesComponent } from './ficha-actividades/ficha-actividades.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'portafolio', component: PortafolioComponent }, 
        { path: 'estudios', component: EstudiosComponent }, 
        { path: 'areas-estudio', component: AreasEstudiosComponent }, 
        { path: 'itinerario-formativo', component: ItinerarioFormativoComponent },        
        { path: 'ficha-actividades', component: FichaActividadesComponent },        
    ])],
    exports: [RouterModule]
})
export class DocenteRoutingModule { }
