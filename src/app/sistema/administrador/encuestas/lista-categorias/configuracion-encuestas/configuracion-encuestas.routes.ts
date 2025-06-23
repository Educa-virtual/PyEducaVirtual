import { Routes } from '@angular/router'
// import { ConfiguracionEncuestasComponent } from './configuracion-encuestas.component'
// import { PoblacionObjetivoComponent } from './gestion-encuestas/poblacion-objetivo/poblacion-objetivo.component'
//import { InformacionAdicionalComponent } from './gestion-encuestas/informacion-adicional/informacion-adicional.component'
// import { ResumenComponent } from './gestion-encuestas/resumen/resumen.component'
// import { ListaEncuestasComponent } from './lista-encuestas/lista-encuestas.component'
import { ConfiguracionEncuestasComponent } from './configuracion-encuestas.component'

export const configuracionEncuestaRoutes: Routes = [
    /*{
        path: '',
        component: ListaEncuestasComponent,
        pathMatch: 'full',
    },
    */
    {
        path: '',
        component: ConfiguracionEncuestasComponent,
        children: [
            /*{
                path: 'informacion-general',
                component: InformacionAdicionalComponent,
            },
            */
            /*{
                path: 'poblacion-objetivo',
                component: PoblacionObjetivoComponent,
            },
            */
            /*{
                path: 'resumen',
                component: ResumenComponent,
            },
            */
        ],
    },
]
