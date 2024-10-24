import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'

import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { FormsModule } from '@angular/forms'

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { FloatLabelModule } from 'primeng/floatlabel'

@Component({
    selector: 'app-year',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        CalendarModule,
        ButtonModule,
        FloatLabelModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './year.component.html',
    styleUrl: './year.component.scss',
})
export class YearComponent implements OnInit, OnChanges {
    form: FormGroup;
    minDate: Date;
    maxDate: Date;

    yearInformation = this.ticketService.getTicketInformation().stepYear

    constructor(
        public ticketService: TicketService,
        private router: Router,
        private fb: FormBuilder
    ) {}
    ngOnInit() {

        this.form = this.fb.group({
            fechaVigente: [this.yearInformation?.fechaVigente],
            fechaInicio: [this.yearInformation.fechaInicio || ''],
            fechaFin: [this.yearInformation.fechaFin || '']
          });
      

          this.form.valueChanges.subscribe(value => {
            this.ticketService.setTicketInformation(value, "stepYear")
          });
    }

    nextPage() {
        this.ticketService.registroInformation.stepYear = this.yearInformation;
        this.router.navigate([
            'configuracion/configuracion/registro/diasLaborales',
        ])
    }
    // prevPage() {
    //     this.router.navigate(['steps/year'])
    // }
    ngOnChanges() {
        // this.form.valueChanges.subscribe(value => {
        //     this.ticketService.setTicketInformation(value, "stepYear")

        //     console.log(this.ticketService.getTicketInformation().stepYear);
            
        //     this.minDate = new Date(Number(this.yearInformation.fechaVigente), 0, 1); // 0 es enero y 1 es el primer día

        //     console.log(new Date(Number(this.yearInformation.fechaVigente), 0, 1));
            
        //     this.maxDate = new Date(Number(this.yearInformation.fechaVigente), 11, 31); 
            
        //     console.log(new Date(Number(this.yearInformation.fechaVigente), 11, 31));
        // });



          // Definir el último día del año

    }
}
