import {
    Injectable,
    ComponentRef,
    EnvironmentInjector,
    ApplicationRef,
    Injector,
    createComponent,
} from '@angular/core'
import { Toast } from 'primeng/toast'

@Injectable({
    providedIn: 'root',
})
export class DynamicToastService {
    private toastComponentRef: ComponentRef<Toast> | null = null

    constructor(
        private appRef: ApplicationRef,
        private injector: Injector,
        private environmentInjector: EnvironmentInjector
    ) {}

    createToast() {
        if (this.toastComponentRef) {
            return // Evita múltiples instancias
        }

        // Crear el componente dinámicamente
        this.toastComponentRef = createComponent(Toast, {
            environmentInjector: this.environmentInjector,
        })

        // Adjuntar el componente al DOM
        this.appRef.attachView(this.toastComponentRef.hostView)
        const domElement = (this.toastComponentRef.hostView as any)
            .rootNodes[0] as HTMLElement
        document.body.appendChild(domElement)
    }

    destroyToast() {
        if (this.toastComponentRef) {
            this.appRef.detachView(this.toastComponentRef.hostView)
            this.toastComponentRef.destroy()
            this.toastComponentRef = null
        }
    }
}
