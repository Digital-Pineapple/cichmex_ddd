import Moment from 'moment-timezone';
import {Client, DistanceMatrixResponseData} from '@googlemaps/google-maps-services-js'
import { config } from '../../../../config';

const googleMapsClient = new Client({})
const API_MAP_GOOGLE = config.GOOGLE_MAP_KEY
export class RegionsService {
    isPointInPolygon(lat: number, lng: number, polygon: Array<{ lat: number, lng: number }>): boolean {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const xi = polygon[i].lat, yi = polygon[i].lng;
          const xj = polygon[j].lat, yj = polygon[j].lng;
    
          const intersect = ((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
      }

      groupOrdersByRegion(orders: any[], regions: any[]): Record<string, any[]> {
        const groupedOrders: any = [];
        
    
        orders.forEach(order => {
          const location = order.deliveryLocation || (order.branch?.location);
          if (!location || !location.lat || !location.lgt) return;
          
          const lat = location.lat;
          const lng = location.lgt;
    
          regions.forEach(region => {
            let isInRegion = false;
    
            if (region.type === 'polygon') {
              isInRegion = this.isPointInPolygon(lat, lng, region.path);
  
            }
    
            if (isInRegion) {
              // if (!groupedOrders[region.name]) {
              //   groupedOrders[region.name] = [];
              // }
              groupedOrders.push(order);
            }
          });
        });
    
        return groupedOrders;
      }

   
      

      getDistanceMatrix = async (points: any): Promise<DistanceMatrixResponseData | null> => {
        const maxWaypoints = 25;
        const origins = points.map((point: any) => `${point.lat},${point.lgt}`);
      
        if (origins.length > maxWaypoints) {
          console.error('Error: Exceeded maximum number of waypoints (25).');
          return null;
        }
      
        try {
          const response = await googleMapsClient.distancematrix({
            params: {
              origins,
              destinations: origins,
              key: API_MAP_GOOGLE,
            },
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching distance matrix:', error);
          return null;  // Manejo de errores más claro
        }
      };
      
      calculateDistance = (route: number[], distanceMatrix: DistanceMatrixResponseData): number => {
        let totalDistance = 0;
        for (let i = 0; i < route.length - 1; i++) {
          const from = route[i];
          const to = route[i + 1];
      
          // Verificar si hay datos válidos en la matriz de distancias
          if (
            distanceMatrix.rows[from] && 
            distanceMatrix.rows[from].elements[to] && 
            distanceMatrix.rows[from].elements[to].distance
          ) {
            totalDistance += distanceMatrix.rows[from].elements[to].distance.value;
          } else {
            console.error(`No valid distance found between ${from} and ${to}`);
          }
        }
        return totalDistance;
      };
      
      simulatedAnnealingTSP = (distanceMatrix: any): number[] => {
        const n = distanceMatrix.rows.length;
        let currentRoute = [...Array(n).keys()];
        let bestRoute = [...currentRoute];
        let currentDistance = this.calculateDistance(currentRoute, distanceMatrix);
        let bestDistance = currentDistance;
      
        const initialTemp = 10000;
        const coolingRate = 0.003;
        let temp = initialTemp;
      
        while (temp > 1) {
          const newRoute = [...currentRoute];
          const i = Math.floor(Math.random() * n);
          const j = (i + Math.floor(Math.random() * (n - 1))) % n;
          [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
      
          const newDistance = this.calculateDistance(newRoute, distanceMatrix);
      
          if (newDistance < currentDistance || Math.random() < Math.exp((currentDistance - newDistance) / temp)) {
            currentRoute = [...newRoute];
            currentDistance = newDistance;
      
            if (newDistance < bestDistance) {
              bestRoute = [...newRoute];
              bestDistance = newDistance;
            }
          }
      
          temp *= 1 - coolingRate;
        }
      
        return bestRoute;
      };

      getOptimizedRoute = async (points: any, route: any): Promise<any> => {
        if (!route || route.length < 2) {
          console.error('Invalid route');
          return null;
        }
        
        // Construir los waypoints como un array de hasta 25 puntos
        const waypoints: any = route.slice(1, -1).map((index: any) => `${points[index].lat},${points[index].lgt}`);
      
        // Validación de límite de waypoints
        if (waypoints.length > 25) {
          console.error('Error: Exceeded maximum number of waypoints (25).');
          return null;
        }
      
        try {
          const response = await googleMapsClient.directions({
            params: {
              origin: `${points[route[0]].lat},${points[route[0]].lgt}`,  // Origen
              destination: `${points[route[0]].lat},${points[route[0]].lgt}`,  // Destino
              waypoints: waypoints,  // Enviar los waypoints como un array
              key: API_MAP_GOOGLE,
              optimize: true,  // Solicitar la optimización de la ruta
            },
          });
          const totalDistance = response.data.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0)
          const TDis = `${ ((totalDistance / 1000).toFixed(2))} Kms`;

          const  totalDuration = response.data.routes[0].legs.reduce((acc, leg) => acc + leg.duration.value, 0);

          const hours = Math.floor(totalDuration / 3600);
          const minutes = Math.floor((totalDuration % 3600) / 60);
          const Duration = (`${hours} h ${minutes} min`);
          
          return {info:response.data, waypoints: points, totalDistance: TDis, totalDuration: Duration };
        } catch (error) {
          console.error('Error fetching directions:', error);
          return null;  // Manejo de errores más claro
        }
      };
      
      


}