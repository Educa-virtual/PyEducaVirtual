import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EvaluacionesRoutingModule } from './evaluaciones-routing.module'
import { ButtonModule } from 'primeng/button'

@NgModule({
    imports: [CommonModule, EvaluacionesRoutingModule, ButtonModule],
})
export class evaluacionesModule {}
