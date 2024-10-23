import { Component, Input } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { RubricaFormService } from '../rubrica-form.service'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-rubrica-form-criterios',
    templateUrl: './rubrica-form-criterios.component.html',
    styleUrl: './rubrica-form-criterios.component.scss',
})
export class RubricaFormCriteriosComponent {
    @Input() rubricaForm: FormGroup

    public criterioIndex = -1
    public accionesCriterio: MenuItem[] = [
        {
            label: 'Duplicar',
            icon: 'pi pi-copy',
            command: () => {
                this.duplicarCriterio()
            },
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => {
                this.eliminarCriterioLocal()
            },
        },
    ]

    get criterios() {
        return this.rubricaForm.get('criterios') as FormArray
    }

    constructor(private _rubricaFormService: RubricaFormService) {}

    agregarCriterio() {
        this._rubricaFormService.addCriterioToForm()
    }

    duplicarCriterio() {
        console.log(this.criterioIndex, 'index a duplicar')
    }

    eliminarCriterioLocal() {
        this._rubricaFormService.eliminarCriteriofromForm(this.criterioIndex)
    }
}
