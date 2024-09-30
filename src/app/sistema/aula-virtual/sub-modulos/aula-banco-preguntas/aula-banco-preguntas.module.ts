import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { PanelModule } from 'primeng/panel'
import { ToolbarModule } from 'primeng/toolbar'

@NgModule({
    imports: [TablePrimengComponent, ContainerPageComponent],
    exports: [
        CommonModule,
        TablePrimengComponent,
        DropdownModule,
        FormsModule,
        ContainerPageComponent,
        PanelModule,
        ToolbarModule,
        ButtonModule,
    ],
    declarations: [],
    providers: [],
})
export class AulaBancoPreguntasModule {}
