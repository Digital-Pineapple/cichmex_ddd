import Generator from 'generate-password';
import {v4, V4Options} from 'uuid'

export const generateRandomCode = () => Generator.generate({
    length      : 6,
    numbers     : true,
    lowercase   : false,
    uppercase   : false
})
export const generateUUID = () => v4({})


export const RandomCodeId = (prefix:string) => {
    
let code = Generator.generate({
    length: 6,
    numbers:true,
    lowercase:false,
    uppercase:true,
    excludeSimilarCharacters:true
})
let data = prefix + '-' + code
return data.toString()

}
export const RandomCodeShipping = () => Generator.generate({
    length      : 4,
    numbers     : true,
    lowercase   : true,
    uppercase   : true
})

export const createSlug = (slug: string): string => {
    let processedSlug = slug
      .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ') // Caracteres especiales
      .toLowerCase() // Minúsculas
      .trim() // Espacios al principio y al final
      .replace(/\s+/g, '_'); // Reemplazo de espacios con guiones bajos
    return processedSlug;
};
