import {
    HashLocationStrategy,
    LocationStrategy,
    PathLocationStrategy,
    registerLocaleData,
} from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import {
    APP_INITIALIZER,
    ApplicationConfig,
    importProvidersFrom,
} from '@angular/core'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { CountryService } from './demo/service/country.service'
import { CustomerService } from './demo/service/customer.service'
import { EventService } from './demo/service/event.service'
import { IconService } from './demo/service/icon.service'
import { NodeService } from './demo/service/node.service'
import { PhotoService } from './demo/service/photo.service'
import { ProductService } from './demo/service/product.service'
import { AppLayoutModule } from './layout/app.layout.module'
import { PrimengModule } from './primeng.module'
import { ErrorInterceptor } from './shared/interceptors/error-interceptor/error-interceptor.interceptor'
import { GlobalLoaderInterceptor } from './shared/interceptors/global-loader/global-loader-interceptor/global-loader-interceptor.interceptor'
import {
    InMemoryScrollingFeature,
    InMemoryScrollingOptions,
    provideRouter,
    RouterConfigurationFeature,
    withInMemoryScrolling,
    withRouterConfig,
    withComponentInputBinding,
    withHashLocation,
} from '@angular/router'

import {
    provideIcons,
    provideNgIconsConfig,
    withExceptionLogger,
} from '@ng-icons/core'

import { routes } from './app.routes'
import { MessageInterceptor } from './shared/interceptors/message-interceptor.interceptor'

import { LOCALE_ID } from '@angular/core'
import localeEs from '@angular/common/locales/es'

import dayjs from 'dayjs'
import 'dayjs/locale/es'

registerLocaleData(localeEs)

function initializeDayjs() {
    return () => {
        dayjs.locale('es')
        return Promise.resolve()
    }
}

const scrollConfig: InMemoryScrollingOptions = {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
}

const routerConfig: RouterConfigurationFeature = withRouterConfig({
    onSameUrlNavigation: 'reload',
})

const inMemoryScrollingFeature: InMemoryScrollingFeature =
    withInMemoryScrolling(scrollConfig)

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            routes,
            inMemoryScrollingFeature,
            routerConfig,
            withComponentInputBinding(),
            withHashLocation()
        ),
        { provide: LOCALE_ID, useValue: 'es' },
        provideNgIconsConfig(
            {
                size: '1.5em',
            },
            withExceptionLogger()
        ),
        provideIcons({}),
        importProvidersFrom(AppLayoutModule, PrimengModule, ToastModule),
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        MessageService,
        ProductService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GlobalLoaderInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MessageInterceptor,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeDayjs,
            multi: true,
        },
    ],
}
