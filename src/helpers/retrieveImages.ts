

export const retrieveAWSImages = (images : any ) => {
    const absolutePath = `https://cichmex.s3.us-east-2.amazonaws.com/${process.env.S3_ENVIRONMENT}`;
    const parsedImages = images.map((image : any) => {
        return  {
            ...image,
            url : absolutePath + image?.url
        }
    })
    return parsedImages
}

export const retrieveOneImage = (image:any) => {
    const absolutePath = `https://cichmex.s3.us-east-2.amazonaws.com/${process.env.S3_ENVIRONMENT}`;
    return absolutePath + image
}