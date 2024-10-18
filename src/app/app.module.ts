import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import {FolderService} from "./services/folder.service";
import { AppComponent } from './app.component';
import { FolderStructureComponent } from './components/folder-structure/folder-structure.component';
import { HeaderComponent } from './components/header/header.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    FolderStructureComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    FolderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
