import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { LocationStrategy, PathLocationStrategy } from '@angular/common'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { AppLayoutModule } from './layout/app.layout.module'
import { NotfoundComponent } from './demo/components/notfound/notfound.component'
import { ProductService } from './demo/service/product.service'
import { CountryService } from './demo/service/country.service'
import { CustomerService } from './demo/service/customer.service'
import { EventService } from './demo/service/event.service'
import { IconService } from './demo/service/icon.service'
import { NodeService } from './demo/service/node.service'
import { PhotoService } from './demo/service/photo.service'
import { PrimengModule } from './primeng.module'
import { SharedModule } from './shared/shared.module'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { GlobalLoaderInterceptor } from './shared/interceptors/global-loader/global-loader-interceptor/global-loader-interceptor.interceptor'
import { ErrorInterceptor } from './shared/interceptors/error-interceptor/error-interceptor.interceptor'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'

//////////////////

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        PrimengModule,
        SharedModule,
        ToastModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
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
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
