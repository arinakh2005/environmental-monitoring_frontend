import { Component } from '@angular/core';
import { EnvironmentalFacilitiesComponent } from './components/environmental-facilities/environmental-facilities.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        EnvironmentalFacilitiesComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
}
