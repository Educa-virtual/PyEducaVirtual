import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICurso } from '../interfaces/curso.interface';
import { IEstudiante } from '@/app/sistema/aula-virtual/interfaces/estudiantes.interface';
import { TabContenidoComponent } from './tabs/tab-contenido/tab-contenido.component';
import { TabResultadosComponent } from './tabs/tab-resultados/tab-resultados.component';
import { TabInicioComponent } from './tabs/tab-inicio/tab-inicio.component';
import { PrimengModule } from '@/app/primeng.module';
import { ToolbarPrimengComponent } from '../../../../../shared/toolbar-primeng/toolbar-primeng.component';
import { TabsPrimengComponent } from '../../../../../shared/tabs-primeng/tabs-primeng.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { ContenidoSemanasService } from '@/app/servicios/acad/contenido-semanas.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';

@Component({
  selector: 'app-curso-detalle',
  standalone: true,
  imports: [
    TabContenidoComponent,
    TabResultadosComponent,
    TabInicioComponent,
    PrimengModule,
    ToolbarPrimengComponent,
    TabsPrimengComponent,
  ],
  templateUrl: './curso-detalle.component.html',
  styleUrl: './curso-detalle.component.scss',
})
export class CursoDetalleComponent
  extends MostrarErrorComponent
  implements OnInit, AfterViewChecked
{
  @Input() iSilaboId: string;
  private _ActivatedRoute = inject(ActivatedRoute);
  private _ChangeDetectorRef = inject(ChangeDetectorRef);
  private _ConstantesService = inject(ConstantesService);
  private _ContenidoSemanasService = inject(ContenidoSemanasService);
  private _Router = inject(Router);

  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;

  curso: ICurso | undefined;
  selectTab: number = 0;
  iPerfilId: number;

  tabContenidoLoaded = false;
  tabResultadosLoaded = false;

  tabs = [
    {
      title: 'Inicio',
      icon: 'pi pi-home',
      tab: 'inicio',
    },
    {
      title: 'Contenido',
      icon: 'pi pi-book',
      tab: 'contenido',
    },
    {
      title: 'Resultado',
      icon: 'pi pi-users',
      tab: 'resultados',
    },
  ];

  public estudiantes: IEstudiante[] = [];
  public contenidoSemanas = [];

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (params['tab'] !== undefined) {
        this.selectTab = Number(params['tab']);
      }
    });
    this.listenParams();
    this.iPerfilId = Number(this._ConstantesService.iPerfilId);
    this.obtenerContenidoSemanasxidDocCursoIdxiYAcadId(true);
  }

  // obtiene el parametro y actualiza el tab
  listenParams() {
    const cCursoNombre = this._ActivatedRoute.snapshot.queryParams['cCursoNombre'];
    const cNivelNombreCursos = this._ActivatedRoute.snapshot.queryParams['cNivelNombreCursos'];
    const cNivelTipoNombre = this._ActivatedRoute.snapshot.queryParams['cNivelTipoNombre'];
    const cGradoAbreviacion = this._ActivatedRoute.snapshot.queryParams['cGradoAbreviacion'];
    const cSeccionNombre = this._ActivatedRoute.snapshot.queryParams['cSeccionNombre'];
    const cCicloRomanos = this._ActivatedRoute.snapshot.queryParams['cCicloRomanos'];
    const idDocCursoId = this._ActivatedRoute.snapshot.queryParams['idDocCursoId'];
    const iCursoId = this._ActivatedRoute.snapshot.queryParams['iCursoId'];
    const iNivelCicloId = this._ActivatedRoute.snapshot.queryParams['iNivelCicloId'];
    const iIeCursoId = this._ActivatedRoute.snapshot.queryParams['iIeCursoId'];
    const iSeccionId = this._ActivatedRoute.snapshot.queryParams['iSeccionId'];
    const iNivelGradoId = this._ActivatedRoute.snapshot.queryParams['iNivelGradoId'];
    const cantidad = this._ActivatedRoute.snapshot.queryParams['cantidad'];
    const iCapacitacionId = this._ActivatedRoute.snapshot.queryParams['iCapacitacionId'];

    this.curso = {
      cCursoNombre,
      iCursoId,
      iSilaboId: this.iSilaboId,
      cNivelNombreCursos,
      cNivelTipoNombre,
      cGradoAbreviacion,
      cSeccionNombre,
      cCicloRomanos,
      idDocCursoId,
      iNivelCicloId,
      iIeCursoId,
      iSeccionId,
      iNivelGradoId,
      cantidad,
      iCapacitacionId,
    };
  }
  //función para recorrer el tabs para que filtre segun el perfil
  updateTab(tab): void {
    this._Router.navigate([], {
      queryParams: { tab: tab },
      queryParamsHandling: 'merge',
    });

    // this.selectTab = tab
    // localStorage.setItem('selectedTab', tab.toString()) // mostrar la misma pagina al recargar
  }

  ngAfterViewChecked() {
    this._ChangeDetectorRef.detectChanges();
  }

  obtenerContenidoSemanasxidDocCursoIdxiYAcadId(recargar: boolean) {
    const iYAcadId = this._ConstantesService.iYAcadId;

    if (
      !iYAcadId ||
      (!this.curso.idDocCursoId && !this.curso.iCapacitacionId) ||
      (this.curso.idDocCursoId && this.curso.iCapacitacionId)
    ) {
      return;
    }
    const params = { iCredId: this._ConstantesService.iCredId };
    if (this.curso.idDocCursoId) {
      this._ContenidoSemanasService
        .obtenerContenidoSemanasxidDocCursoIdxiYAcadId(
          this.curso.idDocCursoId,
          iYAcadId,
          params,
          recargar
        )
        .subscribe({
          next: resp => {
            if (resp.validated) {
              this.contenidoSemanas = resp.data || [];
            }
          },
          error: error => this.mostrarErrores(error),
        });
    }

    if (this.curso.iCapacitacionId) {
      this._ContenidoSemanasService
        .obtenerContenidoSemanasxiCapacitacionIdxiYAcadId(
          this.curso.iCapacitacionId,
          iYAcadId,
          params,
          recargar
        )
        .subscribe({
          next: resp => {
            if (resp.validated) {
              this.contenidoSemanas = resp.data || [];
            }
          },
          error: error => this.mostrarErrores(error),
        });
    }
  }
}
