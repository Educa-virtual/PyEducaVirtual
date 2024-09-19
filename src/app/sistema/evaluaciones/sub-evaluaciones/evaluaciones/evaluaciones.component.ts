import { Component } from '@angular/core'

/*import { Customer } from '@domain/customer';
/*import { CustomerService } from '@service/customerservice';*/
/*GRILLA */
import { Customer } from 'src/app/demo/api/customer'
import { CustomerService } from 'src/app/demo/service/customer.service'

import { TableModule } from 'primeng/table'
import { CommonModule } from '@angular/common'

/*BOTONES */
import { ButtonModule } from 'primeng/button'

/*MODAL */
import { DialogModule } from 'primeng/dialog'

/*INPUT TEXT */
import { InputTextModule } from 'primeng/inputtext'

@Component({
    selector: 'app-evaluaciones',
    standalone: true,
    imports: [
        TableModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
    ],
    templateUrl: './evaluaciones.component.html',
    styleUrl: './evaluaciones.component.scss',
})
export class EvaluacionesComponent {
    customers!: Customer[]
    visible: boolean = false

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService
            .getCustomersLarge()
            .then((customers) => (this.customers = customers))
    }
    showDialog() {
        this.visible = true
    }
    click() {}
}
