import { LocalStoreService } from '@/app/servicios/local-store.service'
import { Injectable, OnDestroy } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class CompartirFichaService implements OnDestroy {
    constructor(private store: LocalStoreService) {}

    perfil = this.store.getItem('dremoPerfil')
    iYAcadId = this.store.getItem('dremoiYAcadId')

    lista: any[] = []

    private iPersId: string | null = null
    private iFichaDGId: string | null = null
    private iFamiliarId: string | null = null
    private activeIndex: string | null = null

    clearData() {
        this.iFichaDGId = null
        this.iFamiliarId = null
        this.activeIndex = null
        localStorage.removeItem('bienestar')
    }

    setiFichaDGId(index: string | null) {
        this.iFichaDGId = index
        localStorage.setItem('iFichaDGId', index)
    }

    getiFichaDGId(): string | null {
        if (!this.iFichaDGId) {
            this.iFichaDGId =
                localStorage.getItem('iFichaDGId') == 'null'
                    ? null
                    : localStorage.getItem('iFichaDGId')
        }
        return this.iFichaDGId
    }

    setiPersId(index: string | null) {
        this.iPersId = index
        localStorage.setItem('iPersId', index)
    }

    getiPersId(): string | null {
        if (!this.iPersId) {
            this.iPersId =
                localStorage.getItem('iPersId') == 'null'
                    ? null
                    : localStorage.getItem('iPersId')
        }
        return this.iPersId
    }

    setiFamiliarId(iFamiliarId: string) {
        this.iFamiliarId = iFamiliarId
        localStorage.setItem('iFamiliarId', iFamiliarId)
    }

    getiFamiliarId(): string | null {
        if (!this.iFamiliarId) {
            this.iFamiliarId =
                localStorage.getItem('iFamiliarId') == 'null'
                    ? null
                    : localStorage.getItem('iFamiliarId')
        }
        return this.iFamiliarId
    }

    setActiveIndex(index: string) {
        this.activeIndex = index
        localStorage.setItem('activeIndex', index)
    }

    getActiveIndex(): string | null {
        if (!this.activeIndex) {
            this.activeIndex =
                localStorage.getItem('activeIndex') == 'null'
                    ? null
                    : localStorage.getItem('activeIndex')
        }
        return this.activeIndex
    }

    ngOnDestroy(): void {
        this.clearData()
    }
}
