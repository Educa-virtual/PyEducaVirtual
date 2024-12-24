import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BienestarRoutingModule } from './bienestar-routing.module'
import { ButtonModule } from 'primeng/button'

@NgModule({
    imports: [CommonModule, BienestarRoutingModule, ButtonModule],
})
export class BienestarModule {}
