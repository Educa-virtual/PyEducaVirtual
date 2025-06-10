import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-ficha-declaracion',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-declaracion.component.html',
    styleUrl: './ficha-declaracion.component.scss',
})
export class FichaDeclaracionComponent implements OnInit {
    iPersId: number = 0
    iFichaDGId: number = 0
    ficha: any = null
    verDeclaracion: boolean = false

    private _messageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private compartirFichaService: CompartirFichaService,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private route: ActivatedRoute,
        private router: Router,
        private cdRef: ChangeDetectorRef
    ) {
        this.iPersId = this.route.snapshot.params['id'] || 0
    }

    ngOnInit() {
        this.ficha = this.datosFichaBienestarService
            .searchFicha({
                iPersId: this.iPersId,
                iYAcadId: this.compartirFichaService.iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    this.iFichaDGId = data.data[0].iFichaDGId || 0
                    if (this.iFichaDGId) {
                        this.router.navigate([
                            `/bienestar/ficha/${this.iFichaDGId}/general`,
                        ])
                    }
                },
                error: (error) => {
                    console.error('Error cargando ficha:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
            })
        if (!this.ficha) {
            this.verDeclaracion = true
            this.cdRef.detectChanges()
        }
    }

    aceptarDeclaracion() {
        this._confirmService.openConfirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message:
                '¿Está seguro de aceptar la declaración de consentimiento?',
            accept: () => {
                this.datosFichaBienestarService.crearFicha({
                    iYAcadId: this.compartirFichaService.iYAcadId,
                    iPersId: this.iPersId,
                })
            },
        })
    }

    salir() {
        this.router.navigate(['/bienestar/gestion-fichas-apoderado'])
    }
}
