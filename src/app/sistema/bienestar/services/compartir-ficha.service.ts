import { Injectable, OnDestroy } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class CompartirFichaService implements OnDestroy {
    constructor() {}

    lista: any[] = []

    private iPersId: string | null = null
    private iFichaDGId: string | null = null

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

    ngOnDestroy(): void {
        this.clearData()
    }
}
