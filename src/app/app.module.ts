import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { newItems } from './components/newItems/newItems.component'
import { ItemsService } from './services/items.service'

@NgModule({
  imports: [BrowserModule],
  declarations: [newItems],
  providers: [ItemsService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
