import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { PanelModule } from 'primeng/panel'

@NgModule({
    imports: [
        CommonModule,
        TablePrimengComponent,
        DropdownModule,
        FormsModule,
        ContainerPageComponent,
        PanelModule,
    ],
    exports: [
        CommonModule,
        TablePrimengComponent,
        DropdownModule,
        FormsModule,
        ContainerPageComponent,
        PanelModule,
    ],
    declarations: [],
    providers: [],
})
export class AulaBancoPreguntasModule {}
