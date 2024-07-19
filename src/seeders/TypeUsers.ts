import {TypeUserEntity} from '../api/domain/typeUser/TypeUserEntity'

    const typeUser: TypeUserEntity[] = [
        { system: ["CICHMEX", "CARWASH"], role: ["SUPER-ADMIN"] },

        { system: ["CICHMEX"], role: ["ADMIN"] },
        { system: ["CICHMEX"], role: ["SUB-ADMIN"] },
        { system: ["CICHMEX"], role: ["CUSTOMER"] },
        { system: ["CICHMEX"], role: ["SELLER"] },

        { system: ["CARWASH"], role: ["ADMIN"] },
        { system: ["CARWASH"], role: ["SUB-ADMIN"] },
        { system: ["CICHMEX","CARWASH"], role: ["CARRIER-DRIVER"] },
        { system: ["CARWASH"], role: ["PARTHNER"] },
        { system: ["CARWASH"], role: ["CUSTOMER"] },
        
      ];
  export default typeUser