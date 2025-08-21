import { PrimengModule } from '@/app/primeng.module';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompartirFichaService } from '../../services/compartir-ficha.service';
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-ficha-declaracion',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './ficha-declaracion.component.html',
  styleUrl: './ficha-declaracion.component.scss',
})
export class FichaDeclaracionComponent implements OnInit {
  iPersId: number = 0;
  iFichaDGId: number = 0;
  ficha: any = null;
  verDeclaracion: boolean = false;
  perfil: any;

  private _messageService = inject(MessageService); // dialog Mensaje simple
  private _confirmService = inject(ConfirmationModalService); // componente de dialog mensaje

  constructor(
    private compartirFichaService: CompartirFichaService,
    private datosFichaBienestarService: DatosFichaBienestarService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private store: LocalStoreService
  ) {
    this.iPersId = this.route.snapshot.params['id'] || 0;
    this.perfil = this.store.getItem('dremoPerfil');
    if (Number(this.iPersId) == 0 && Number(this.perfil.iPerfilId) == 80) {
      this.iPersId = Number(this.perfil.iPersId);
      this.router.navigate([`/bienestar/ficha-declaracion/${this.iPersId}`]);
    }
  }

  async ngOnInit() {
    try {
      const data: any = await this.datosFichaBienestarService
        .verFicha({
          iPersId: this.iPersId,
          iYAcadId: this.compartirFichaService.iYAcadId,
          iCredEntPerfId: this.perfil.iCredEntPerfId,
        })
        .toPromise();

      if (!data.data || data.data.length == 0) {
        this.verDeclaracion = true;
        this.cdRef.detectChanges();
        return;
      }
      this.ficha = data.data[0];
      this.iFichaDGId = this.ficha?.iFichaDGId || 0;
      if (this.iFichaDGId) {
        this.router.navigate([`/bienestar/ficha/${this.iFichaDGId}/general`]);
      }
    } catch (error) {
      console.error('Error cargando ficha:', error);
      this.router.navigate(['/']);
    }
  }

  aceptarDeclaracion() {
    this._confirmService.openConfirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro de aceptar la declaración de consentimiento?',
      accept: () => {
        this.datosFichaBienestarService
          .crearFicha({
            iYAcadId: this.compartirFichaService.iYAcadId,
            iPersId: this.iPersId,
            iCredEntPerfId: this.perfil.iCredEntPerfId,
          })
          .subscribe({
            next: (data: any) => {
              if (data.data.length == 0) return;
              this.iFichaDGId = data.data[0].iFichaDGId || 0;
              this.router.navigate([`/bienestar/ficha/${this.iFichaDGId}`]);
            },
            error: error => {
              console.error('Error al guardar:', error);
              this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error,
              });
            },
          });
      },
    });
  }

  salir() {
    this.router.navigate(['/bienestar/gestion-fichas-apoderado']);
  }
}
