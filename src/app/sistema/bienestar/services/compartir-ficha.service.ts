import { LocalStoreService } from '@/app/servicios/local-store.service'
import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

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
    private activeIndex = new BehaviorSubject<number | null>(null)

    clearData() {
        this.iPersId = null
        localStorage.removeItem('iPersId')
        localStorage.removeItem('iFichaDGId')
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

    setActiveIndex(index: number) {
        this.activeIndex.next(index)
    }

    getActiveIndex(): Observable<any> {
        return this.activeIndex.asObservable()
    }

    ngOnDestroy(): void {
        this.clearData()
    }
}
