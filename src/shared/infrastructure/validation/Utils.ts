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