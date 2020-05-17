import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { ItemsService } from './services/items.service'

@NgModule({
  imports: [BrowserModule],
  declarations: [],
  providers: [ItemsService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
