import Moment from 'moment-timezone';

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
}