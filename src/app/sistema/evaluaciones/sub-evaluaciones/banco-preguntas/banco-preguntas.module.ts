import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { provideIcons } from '@ng-icons/core'
import { matGroupWork } from '@ng-icons/material-icons/baseline'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { DialogService } from 'primeng/dynamicdialog'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
import { BancoPreguntaPreviewComponent } from './components/banco-pregunta-preview/banco-pregunta-preview.component'
import { BancoPreguntaListaComponent } from './components/banco-pregunta-lista/banco-pregunta-lista.component'

@NgModule({
    imports: [
        CommonInputComponent,
        InputTextModule,
        MultiSelectModule,
        FormsModule,
        DropdownModule,
        ContainerPageComponent,
        ButtonModule,
        TablePrimengComponent,
        FloatLabelModule,
        BancoPreguntaPreviewComponent,
        BancoPreguntaListaComponent,
    ],
    exports: [
        CommonInputComponent,
        InputTextModule,
        MultiSelectModule,
        FormsModule,
        DropdownModule,
        ContainerPageComponent,
        ButtonModule,
        TablePrimengComponent,
        FloatLabelModule,
        BancoPreguntaPreviewComponent,
        BancoPreguntaListaComponent,
    ],
    declarations: [],
    providers: [provideIcons({ matGroupWork }), DialogService, MessageService],
})
export class BancoPreguntasModule {}
