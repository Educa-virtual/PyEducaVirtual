import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { ComunicadosRoutingModule } from './comunicados-routing.module'

@NgModule({
    imports: [CommonModule, ComunicadosRoutingModule, ButtonModule],
})
export class ComunicadosModule {}
