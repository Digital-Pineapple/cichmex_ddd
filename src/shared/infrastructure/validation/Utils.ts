import Generator from 'generate-password';
import {v4, V4Options} from 'uuid'

export const generateRandomCode = () => Generator.generate({
    length      : 6,
    numbers     : true,
    lowercase   : false,
    uppercase   : false
})
export const generateUUID = () => v4({})