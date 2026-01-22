import * as L from 'leaflet';

declare module 'leaflet' {
    namespace Routing {
        function control(options: any): Control;

        interface Control extends L.Control {
            getPlan(): any;
            setWaypoints(waypoints: L.LatLng[]): void;
            remove(): void;
        }
    }
}
