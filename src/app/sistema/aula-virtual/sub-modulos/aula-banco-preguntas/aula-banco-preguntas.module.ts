import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { DialogService } from 'primeng/dynamicdialog'
import { PanelModule } from 'primeng/panel'
import { ToolbarModule } from 'primeng/toolbar'
import { AulaBancoPreguntaFormContainerComponent } from './aula-banco-preguntas/components/aula-banco-pregunta-form-container/aula-banco-pregunta-form-container.component'
import { StepsModule } from 'primeng/steps'
import { BancoPreguntasFormComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/banco-preguntas-form/banco-preguntas-form.component'

@NgModule({
    declarations: [AulaBancoPreguntaFormContainerComponent],
    imports: [
        TablePrimengComponent,
        ContainerPageComponent,
        StepsModule,
        BancoPreguntasFormComponent,
    ],
    exports: [
        CommonModule,
        TablePrimengComponent,
        DropdownModule,
        FormsModule,
        ContainerPageComponent,
        PanelModule,
        ToolbarModule,
        ButtonModule,
        AulaBancoPreguntaFormContainerComponent,
        StepsModule,
    ],
    providers: [DialogService, MessageService],
})
export class AulaBancoPreguntasModule {}
