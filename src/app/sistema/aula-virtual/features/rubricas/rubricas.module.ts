import { NgModule } from '@angular/core'
import { RubricaFormHeaderComponent } from './components/rubrica-form/rubrica-form-header/rubrica-form-header.component'
import { RubricaFormNivelesComponent } from './components/rubrica-form/rubrica-form-niveles/rubrica-form-niveles.component'
import { RubricaFormCriteriosComponent } from './components/rubrica-form/rubrica-form-criterios/rubrica-form-criterios.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { RubricaFormComponent } from './components/rubrica-form/rubrica-form.component'
import { PrimengModule } from '@/app/primeng.module'
import { DialogService } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

const COMPONENTS = [
    RubricaFormHeaderComponent,
    RubricaFormNivelesComponent,
    RubricaFormCriteriosComponent,
    RubricaFormComponent,
]

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        TablePrimengComponent,
        PrimengModule,
        CommonInputComponent,
        AutoCompleteModule,
        EmptySectionComponent,
    ],
    exports: [
        TablePrimengComponent,
        PrimengModule,
        EmptySectionComponent,
        AutoCompleteModule,
        InputGroupModule,
        InputGroupAddonModule,
        CalendarModule,
        FormsModule,
        ReactiveFormsModule,
        ...COMPONENTS,
    ],
    providers: [DialogService, MessageService],
})
export class RubricasModule {}
