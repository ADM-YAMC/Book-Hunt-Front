import { Component } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {

}
