import { PrimengModule } from '@/app/primeng.module'
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { ActivatedRoute } from '@angular/router'
import { CompartirFichaService } from '../services/compartir-ficha.service'
import { TabMenu } from 'primeng/tabmenu'
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service'

@Component({
    selector: 'app-ficha',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha.component.html',
    styleUrl: './ficha.component.scss',
})
export class FichaComponent implements OnInit, AfterViewInit {
    items: MenuItem[] = []
    activeItem: any
    previousItem: any
    iFichaDGId: any = 0
    cPersNombreApellidos: string = ''

    @ViewChild('tabMenu', { static: false }) tabMenu: TabMenu

    private _messageService = inject(MessageService)

    constructor(
        private route: ActivatedRoute,
        private cf: ChangeDetectorRef,
        private compartirFicha: CompartirFichaService,
        private datosFichaBienestar: DatosFichaBienestarService
    ) {
        this.route.paramMap.subscribe((params: any) => {
            this.iFichaDGId = params.params.id || 0
        })
    }

    ngOnInit(): void {
        this.datosFichaBienestar
            .verFicha({
                iFichaDGId: this.iFichaDGId,
            })
            .subscribe((data: any) => {
                this.cPersNombreApellidos = data.data[0].cPersNombreApellidos
            })

        this.items = [
            {
                label: 'General',
                icon: 'pi pi-fw pi-user',
                route: `/bienestar/ficha/${this.iFichaDGId}/general`,
            },
            {
                label: 'Familia',
                icon: 'pi pi-fw pi-users',
                route: `/bienestar/ficha/${this.iFichaDGId}/familia`,
            },
            {
                label: 'Economico',
                icon: 'pi pi-fw pi-wallet',
                route: `/bienestar/ficha/${this.iFichaDGId}/economico`,
            },
            {
                label: 'Vivienda',
                icon: 'pi pi-fw pi-home',
                route: `/bienestar/ficha/${this.iFichaDGId}/vivienda`,
            },
            {
                label: 'Alimentación',
                icon: 'pi pi-fw pi-shopping-cart',
                route: `/bienestar/ficha/${this.iFichaDGId}/alimentacion`,
            },
            {
                label: 'Discapacidad',
                icon: 'pi pi-fw pi-heart-fill',
                route: `/bienestar/ficha/${this.iFichaDGId}/discapacidad`,
            },
            {
                label: 'Salud',
                icon: 'pi pi-fw pi-heart',
                route: `/bienestar/ficha/${this.iFichaDGId}/salud`,
            },
            {
                label: 'Recreación',
                icon: 'pi pi-fw pi-image',
                route: `/bienestar/ficha/${this.iFichaDGId}/recreacion`,
            },
        ]
    }

    ngAfterViewInit() {
        this.compartirFicha.getActiveIndex().subscribe((value) => {
            this.activeItem = value
            this.cf.detectChanges()
        })
    }

    /**
     * Mover scrool a la pestaña seleccionada
     * @param event
     */
    scrollToActiveTab(activeIndex: any) {
        activeIndex = activeIndex || 0
        if (this.tabMenu) {
            const navContainer =
                this.tabMenu.content.nativeElement.querySelector(
                    '.p-tabmenu-nav'
                )
            const activeTabElement = navContainer.querySelector(
                `.p-tabmenuitem:nth-child(${activeIndex + 1})`
            )
            if (activeTabElement) {
                activeTabElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                })
            }
        }
    }

    descargarFicha() {
        this.datosFichaBienestar.descargarFicha(this.iFichaDGId).subscribe({
            next: (response) => {
                const blob = new Blob([response], {
                    type: 'application/pdf',
                })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'ficha-socioeconomica.pdf'
                link.target = '_blank'
                link.click()
                window.URL.revokeObjectURL(url)
            },
            error: (error) => {
                console.log(error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                })
            },
        })
    }
}
