import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientoIeService } from '../mantenimiento-ie/mantenimiento-ie.service';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormSedesComponent } from '../mantenimiento-ie/form-sedes/form-sedes.component';

@Component({
  selector: 'app-mantenimiento-sedes',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, FormSedesComponent],
  templateUrl: './mantenimiento-sedes.component.html',
  styleUrl: './mantenimiento-sedes.component.scss',
})
export class MantenimientoSedesComponent implements OnInit {
  iIieeId: number;
  ie: any;
  sedeSeleccionada: any;

  sedes: any[] = [];

  breadCrumbHome: MenuItem = { icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [];

  showModal: boolean = false;
  formSede: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ieService: MantenimientoIeService,
    private fb: FormBuilder
  ) {
    this.route.paramMap.subscribe(params => {
      this.iIieeId = Number(params.get('id'));
    });
  }

  ngOnInit() {
    try {
      this.formSede = this.fb.group({
        iCredEntPerfId: [],
        iCredId: [1],
      });
    } catch (error) {
      console.error(error, 'Error al inicializar el formulario');
    }
    this.verIe();
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [
      {
        label: 'Gestionar Instituciones Educativas',
        routerLink: '/administrador/mantenimiento-ie',
      },
      { label: this.ie?.cIieeCodigoModular + ' - ' + this.ie?.cIieeNombre },
      { label: 'Sedes' },
    ];
  }

  cerrarModal() {
    this.showModal = false;
    this.sedeSeleccionada = null;
  }

  verIe() {
    this.ieService
      .verInstitucionEducativa({
        iIieeId: this.iIieeId,
      })
      .subscribe((data: any) => {
        this.ie = data.data;
        this.setBreadCrumbs();
        this.listarSedes();
        this.ieService.crearInstitucionEducativa({}).subscribe((data: any) => {
          this.ieService.getServiciosEducativos(data?.servicios_educativos);
        });
      });
  }

  listarSedes() {
    this.ieService
      .listarSedes({
        iIieeId: this.iIieeId,
      })
      .subscribe({
        next: (data: any) => {
          this.sedes = data.data;
        },
        error: (error: any) => {
          console.error('Error al listar sedes:', error);
        },
      });
  }

  agregarSede() {
    this.showModal = true;
    this.sedeSeleccionada = null;
  }

  abrirEnMaps(event) {
    event.preventDefault();
    if (this.ie && this.ie?.cIieeNlat && this.ie?.cIieeNlog) {
      const url = `https://www.google.com/maps?q=${this.ie.cIieeNlat},${this.ie.cIieeNlog}`;
      window.open(url, '_blank');
    }
  }

  regresar() {
    this.router.navigate(['/administrador/mantenimiento-ie']);
  }

  accionBtnSedes({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.showModal = true;
        this.sedeSeleccionada = item;
        break;
    }
  }

  /* Datos de tabla IEs */
  columnas: IColumn[] = [
    {
      type: 'item',
      width: '10%',
      field: 'index',
      header: 'Nro',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '35%',
      field: 'cSedeNombre',
      header: 'Nombre',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '25%',
      field: 'cSedeDireccion',
      header: 'Dirección',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cSedeTelefono',
      header: 'Teléfono',
      text_header: 'center',
      text: 'center',
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
      field: '',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  acciones: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];
}
