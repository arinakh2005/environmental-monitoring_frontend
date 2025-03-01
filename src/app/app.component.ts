import { Component } from '@angular/core';
import { EnvironmentalMapComponent } from './components/environmental-map/environmental-map.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        EnvironmentalMapComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
}
