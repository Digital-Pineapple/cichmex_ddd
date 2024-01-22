import Generator from 'generate-password';

export const generateRandomCode = () => Generator.generate({
    length      : 6,
    numbers     : true,
    lowercase   : false,
    uppercase   : false
})