import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MenuItem, Message, MessageService } from 'primeng/api';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurriculasService } from './config/service/curriculas.service';
import { ModalidadServicioService } from './config/service/modalidadServicio.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { Router } from '@angular/router';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-curriculas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './curriculas.component.html',
  styleUrl: './curriculas.component.scss',
})
export class CurriculasComponent implements OnInit {
  choose(event, callback) {
    console.log('click');
    callback();
  }

  frmCurriculas: FormGroup;
  curriculas: any = [];
  curricula: any = {};
  visible: boolean = false;
  modalidades: any = [];
  titulo: string = 'Gestión de Currículas';
  iPerfilId: number;
  bEditar: boolean = false;
  messages: Message[] | undefined;
  sidebarVisible: boolean = false;

  breadCrumbHome: MenuItem = { icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [{ label: 'Currículas' }];

  estados_vigente: any[] = [
    { label: 'SÍ', value: 1 },
    { label: 'NO', value: 0 },
  ];

  private _ConstantesService = inject(ConstantesService);
  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private fb: FormBuilder,
    public curriculasService: CurriculasService,
    public modalidadServiciosService: ModalidadServicioService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private query: GeneralService,
    private router: Router,
    private curriculaService: CurriculasService
  ) {
    this.iPerfilId = this._ConstantesService.iPerfilId;
  }

  ngOnInit() {
    try {
      this.frmCurriculas = this.fb.group({
        iCurrId: [''],
        iModalServId: ['', Validators.required],
        iCurrNotaMinima: [''],
        iCurrTotalCreditos: [''],
        iCurrNroHoras: [''],
        cCurrPerfilEgresado: [''],
        cCurrMencion: [''],
        nCurrPesoProcedimiento: [''],
        cCurrPesoConceptual: [''],
        cCurrPesoActitudinal: [''],
        bCurrEsLaVigente: [false],
        cCurrRsl: [''],
        dtCurrRsl: [''],
        cCurrDescripcion: ['', Validators.required],
      });
    } catch (error) {
      console.error(error, 'Error de formulario');
    }
    this.obtenerDatosIniciales();
  }

  accionBtnItem(event: any) {
    const item = event.item;
    const accion = event.accion;

    switch (accion) {
      case 'nueva_curricula':
        this.frmCurriculas.reset();
        this.bEditar = false;
        this.visible = true;
        this.titulo = 'Formulario para registrar nueva currícula';
        break;

      case 'ver_areas':
        this.curriculaService.setCurricula(item);
        this.router.navigate([`/administrador/mantenimiento-curricula/${item.iCurrId}/areas`]);
        break;

      case 'ver_competencias':
        this.curriculaService.setCurricula(item);
        this.router.navigate([
          `/administrador/mantenimiento-curricula/${item.iCurrId}/competencias`,
        ]);
        break;

      case 'editar':
        this.titulo = 'Formulario para editar currícula';
        this.visible = true;
        this.bEditar = true;
        this.frmCurriculas.patchValue({
          iCurrId: item.iCurrId,
          iModalServId: item.iModalServId,
          iCurrNotaMinima: item.iCurrNotaMinima,
          iCurrTotalCreditos: item.iCurrTotalCreditos,
          iCurrNroHoras: item.iCurrNroHoras,
          cCurrPerfilEgresado: item.cCurrPerfilEgresado,
          cCurrMencion: item.cCurrMencion,
          nCurrPesoProcedimiento: item.nCurrPesoProcedimiento,
          cCurrPesoConceptual: item.cCurrPesoConceptual,
          cCurrPesoActitudinal: item.cCurrPesoActitudinal,
          bCurrEsLaVigente: Number(item.bCurrEsLaVigente) ?? false,
          cCurrRsl: item.cCurrRsl,
          dtCurrRsl: item.dtCurrRsl ? new Date(item.dtCurrRsl) : null,
          cCurrDescripcion: item.cCurrDescripcion,
        });
        break;

      case 'eliminar_curricula':
        this._confirmService.openConfirm({
          header: 'Advertencia de currículas',
          message: '¿Desea eliminar la currícula?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.deleteCurricula(item.iCurrId);
          },
        });
        break;
    }
  }

  obtenerDatosIniciales() {
    this.modalidadServiciosService.getModalidadServicios().subscribe({
      next: (value: any) => {
        this.modalidades = value.data.map(item => ({
          name: item.cModalServNombre,
          code: item.iModalServId,
        }));
      },
      error: error => {
        let message = error?.error?.message || 'Sin conexión a la bd';
        const match = message.match(/]([^\]]+?)\./);
        if (match && match[1]) {
          message = match[1].trim() + '.';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: message,
        });
      },
      complete: () => {},
    });

    this.curriculasService.getCurriculas().subscribe({
      next: (res: any) => {
        this.curriculas = res.data;
        this.curriculas = this.curriculas.map(e => ({
          ...e,
          cCurrRslShort: e.cCurrRsl ? e.cCurrRsl.substring(0, 20) : '',
        }));
      },
    });
  }

  updCurriculas() {
    const params = {
      iCurrId: Number(this.frmCurriculas.value.iCurrId) || 0,
      iModalServId: Number(this.frmCurriculas.value.iModalServId) || 0,
      iCurrNotaMinima: Number(this.frmCurriculas.value.iCurrNotaMinima) || 0,
      iCurrTotalCreditos: Number(this.frmCurriculas.value.iCurrTotalCreditos) || 0,
      iCurrNroHoras: Number(this.frmCurriculas.value.iCurrNroHoras) || 0,
      cCurrPerfilEgresado: this.frmCurriculas.value.cCurrPerfilEgresado || '',
      cCurrMencion: this.frmCurriculas.value.cCurrMencion || '',
      nCurrPesoProcedimiento: parseFloat(
        this.frmCurriculas.value.nCurrPesoProcedimiento || 0
      ).toFixed(2),
      cCurrPesoConceptual: parseFloat(this.frmCurriculas.value.cCurrPesoConceptual || 0).toFixed(2),
      cCurrPesoActitudinal: parseFloat(this.frmCurriculas.value.cCurrPesoActitudinal || 0).toFixed(
        2
      ),
      bCurrEsLaVigente: this.frmCurriculas.value.bCurrEsLaVigente || false,
      cCurrRsl: this.frmCurriculas.value.cCurrRsl || '',
      dtCurrRsl: this.frmCurriculas.value.dtCurrRsl
        ? new Date(this.frmCurriculas.value.dtCurrRsl)
        : null,
      cCurrDescripcion: this.frmCurriculas.value.cCurrDescripcion || '',
      iSesionId: this.iPerfilId,
    };

    this.query
      .updateCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'updCurricula',
      })
      .subscribe({
        error: error => {
          let message = error?.error?.message || 'Sin conexión a la bd';
          const match = message.match(/]([^\]]+?)\./);
          if (match && match[1]) {
            message = match[1].trim() + '.';
          }
          message = decodeURIComponent(message);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se registró la currícula correctamente.',
          });
          this.visible = false;
          this.obtenerDatosIniciales();
        },
      });
  }

  deleteCurricula(id: number) {
    const params = {
      esquema: 'acad',
      tabla: 'curriculas',
      campo: 'iCurrId',
      valorId: id,
    };
    this.query.deleteAcademico(params).subscribe({
      error: error => {
        let message = error?.error?.message || 'Sin conexión a la bd';
        const match = message.match(/]([^\]]+?)\./);
        if (match && match[1]) {
          message = match[1].trim() + '.';
        }
        message = decodeURIComponent(message);
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: message,
        });
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Se eliminó la currícula correctamente.',
        });
        this.visible = false;
        this.obtenerDatosIniciales();
      },
    });
  }

  saveCurriculas() {
    const params = {
      iCurrId: Number(this.frmCurriculas.value.iCurrId) || 0,
      iModalServId: Number(this.frmCurriculas.value.iModalServId) || 0,
      iCurrNotaMinima: Number(this.frmCurriculas.value.iCurrNotaMinima) || 0,
      iCurrTotalCreditos: Number(this.frmCurriculas.value.iCurrTotalCreditos) || 0,
      iCurrNroHoras: Number(this.frmCurriculas.value.iCurrNroHoras) || 0,
      cCurrPerfilEgresado: this.frmCurriculas.value.cCurrPerfilEgresado || '',
      cCurrMencion: this.frmCurriculas.value.cCurrMencion || '',
      nCurrPesoProcedimiento: parseFloat(
        this.frmCurriculas.value.nCurrPesoProcedimiento || 0
      ).toFixed(2),
      cCurrPesoConceptual: parseFloat(this.frmCurriculas.value.cCurrPesoConceptual || 0).toFixed(2),
      cCurrPesoActitudinal: parseFloat(this.frmCurriculas.value.cCurrPesoActitudinal || 0).toFixed(
        2
      ),
      bCurrEsLaVigente: Number(this.frmCurriculas.value.bCurrEsLaVigente) || 0,
      cCurrRsl: this.frmCurriculas.value.cCurrRsl || '',
      dtCurrRsl: this.frmCurriculas.value.dtCurrRsl
        ? new Date(this.frmCurriculas.value.dtCurrRsl)
        : null,
      cCurrDescripcion: this.frmCurriculas.value.cCurrDescripcion || '',
      iSesionId: this.iPerfilId,
    };

    this.query
      .addCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'addCurricula',
      })
      .subscribe({
        error: error => {
          let message = error?.error?.message || 'Sin conexión a la bd';
          const match = message.match(/]([^\]]+?)\./);
          if (match && match[1]) {
            message = match[1].trim() + '.';
          }
          message = decodeURIComponent(message);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se registró la currícula correctamente.',
          });
          this.visible = false;
          this.obtenerDatosIniciales();
        },
      });
  }

  accionesTablaCurricula: IActionTable[] = [
    {
      labelTooltip: 'Editar currícula',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Ver áreas curriculares',
      icon: 'pi pi-book',
      accion: 'ver_areas',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
    {
      labelTooltip: 'Ver competencias',
      icon: 'pi pi-star',
      accion: 'ver_competencias',
      type: 'item',
      class: 'p-button-rounded p-button-info p-button-text',
    },
  ];

  curriculasColumns = [
    {
      type: 'item',
      width: '5%',
      field: '',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '45%',
      field: 'cCurrDescripcion',
      header: 'Nombre',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cCurrRslShort',
      header: 'Referencia',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'right',
    },
  ];
}
