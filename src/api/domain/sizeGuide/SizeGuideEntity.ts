import { ObjectId } from "mongoose";

export interface SizeGuideEntity {
    _id : ObjectId;
    name: string;
    dimensions : DimensionEntity[]
    user_id : string; 
    region?: string;             // Región del sistema de tallas (ej. US, EU, UK)
    unit?: 'cm' | 'inches';      // Unidad de medida utilizada (cm o pulgadas)
    typePackage ?: 'Granel'| 'Envasado' //Tipo de envsado
    status : boolean;
    type: string
  
  }
   export interface DimensionEntity {
      label: string;              // Talla o etiqueta del tamaño (ej. S, M, L, 7 US)
      equivalence ?:string        // Equivalencia internacional
      bust?: number;              // Medida del busto (ropa)
      waist?: number;             // Medida de la cintura
      hips?: number;              // Medida de las caderas
      inseam?: number;            // Largo del interior de la pierna (pantalones)
      shoulder?: number;          // Ancho de los hombros
      sleeveLength?: number;      // Largo de las mangas
      footLength?: number;        // Longitud del pie (zapatos)
      footWidth?: number;         // Ancho del pie (zapatos)
      neckCircumference?: number; // Contorno del cuello (camisas)
      height?: number;            // Altura recomendada
      thigh?: number;             // Medida del muslo
      calf?: number;              // Medida de la pantorrilla
      cupSize?: string;           // Tamaño de la copa (ropa interior)
      bandSize?: number;          // Tamaño de la banda (ropa interior)
      headCircumference?: number; // Circunferencia de la cabeza (sombreros)
      beltLength?: number;        // Longitud del cinturón
      usaSize?: number;            // Talla en la región EU (zapatos)
      ukSize?: number;            // Talla en la región UK (zapatos)
      euroSize?: number;            // Talla en la región Euro (zapatos)
      cmSize?: number;            // Talla en centimetros,
      weight ?: number;           //Peso del envasado,
      units ?: number ;           // Unidades de producto por envase
      flavor ?: string ;          //Sabor del producto
      typeContainer ?: string;    //Contenedor del producto (Ej. Bolsa,Caja,Etc)
      
    }