import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'

import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { FormsModule } from '@angular/forms'
import { httpService } from '../../../http/httpService'

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { FloatLabelModule } from 'primeng/floatlabel'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { FormControl } from '@angular/forms'
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
        ConfirmDialogModule,
        ToastModule,
    ],
    templateUrl: './year.component.html',
    styleUrl: './year.component.scss',
})
export class YearComponent implements OnInit, OnChanges {
    form: FormGroup
    minDate: Date
    visible: boolean = false
    fechaVigenteFetch

    maxDate: Date

    yearInformation

    constructor(
        public ticketService: TicketService,
        private router: Router,
        private httpService: httpService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {}
    ngOnInit() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({}),
                _opcion: 'getCalendarioAno',
            })
            .subscribe({
                next: (data: any) => {
                    this.fechaVigenteFetch = data.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    console.log(JSON.parse(this.fechaVigenteFetch));
    
                    this.fechaVigenteFetch = JSON.parse(this.fechaVigenteFetch);
    
                    if (!this.ticketService.registroInformation) {
                        this.ticketService.registroInformation = {};
                    }
    
                    let fechaCurrent = this.fechaVigenteFetch.map((fecha) => ({
                        idFechaVigente: fecha.iYAcadId,
                        fechaVigente: fecha.cYAcadNombre,
                        fechaInicio: new Date(fecha.dtYAcadInicio),
                        fechaFin: new Date(fecha.dYAcadFin),
                    }));
    
                    this.ticketService.setTicketInformation(fechaCurrent[0], "stepYear");
                    this.yearInformation = fechaCurrent[0];
    
                    // Configurar el formulario aquí una vez que `yearInformation` esté definido
                    
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error);
                },
                complete: () => {
                    console.log('Request completed');

                    console.log(this.yearInformation)

                    this.form.setValue({
                        fechaVigente: this.yearInformation.fechaVigente,
                        fechaInicio: this.yearInformation.fechaInicio,
                        fechaFin: this.yearInformation.fechaFin,
                    });

                    this.form.get('fechaVigente').disable()
                },
            });

            this.form = this.fb.group({
                fechaVigente: [''],
                fechaInicio: [''],
                fechaFin: [''],
            });

            // Suscribirse a los cambios del formulario después de la inicialización
            this.form.valueChanges.subscribe((value) => {
                this.yearInformation = {
                    ...this.yearInformation,
                    fechaInicio: value.fechaInicio,
                    fechaFin: value.fechaFin,
                };
            });
    }
    

    confirm() {
        this.confirmationService.confirm({
            header: 'Confirmar',
            message: 'Por favor, confirme para continuar.',
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmado',
                    detail: 'Usted ha aceptado',
                    life: 3000,
                })

                this.saveInformation()

                this.nextPage()
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rechazado',
                    detail: 'Has rechazado',
                    life: 3000,
                })
            },
        })
    }

    saveInformation() {
        let yearCurrent

        if (!this.ticketService.registroInformation) {
            this.ticketService.registroInformation = {}
        }

        // Verifica la existencia de `stepYear` y continúa con `stepTurnos`
        if ('stepYear' in this.ticketService.registroInformation) {
            yearCurrent = this.ticketService.getTicketInformation().stepYear
        }

        console.log(this.yearInformation);

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iSedeId: 3,
                    iYAcadId: this.yearInformation.idFechaVigente,
                    dtCalAcadInicio: this.yearInformation.fechaFin,
                    dtCalAcadFin: this.yearInformation.fechaFin,
                }),
                _opcion: 'addCalAcademico',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error);
                },
                complete: () => {
                    console.log('Request completed');
                },
            });

        // this.httpService
        //     .postData('acad/calendarioAcademico/addCalAcademico', {
        //         json: JSON.stringify({
        //             jmod: 'grl',
        //             jtable: 'dias',
        //         }),
        //         _opcion: 'getConsulta',
        //     })
        //     .subscribe({
        //         next: (data: any) => {
        //             this.dias = data.data

        //             console.log(this.dias)
        //         },
        //         error: (error) => {
        //             console.error('Error fetching dias:', error)
        //         },
        //         complete: () => {
        //             console.log('Request completed')
        //         },
        //     })
    }

    nextPage() {
        this.ticketService.registroInformation.stepYear = this.yearInformation
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
