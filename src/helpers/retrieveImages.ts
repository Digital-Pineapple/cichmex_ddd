const path = "https://cloud.cichmex.mx/"
export const retrieveAWSFiles = (images : any ) => {
    const absolutePath = `${path}${process.env.S3_ENVIRONMENT}`;
    if(images.length === 0){
        return images
    }
    const parsedImages = images.map((image : any) => {
        if(image?.url){
            return image;
        }
        return  {
            ...image,
            url : absolutePath + removeBasePath(image?.url)
        }
    })
    return parsedImages
}

export const retrieveOneFile = (image:any) => {
    const absolutePath = `${path}${process.env.S3_ENVIRONMENT}`;
    return absolutePath + image
}

function removeBasePath(url: string) {
    const basePath = `https://cichmex.s3.us-east-2.amazonaws.com/${process.env.S3_ENVIRONMENT}`;
    return url?.startsWith(basePath) ? url.replace(basePath, '') : url;
}


export function retrieveParsedImageProducts(products: any){
    try{
        return products.map((product: any) => { 
            if(product?.has_variants || product?.variants?.length > 0){                        
                product.variants = product.variants.map((variant: any) => { 
                    return {
                        ...variant,
                        images : retrieveAWSFiles(variant?.images),            
                    }
                })
            }
            return {
                ...product,
                images : retrieveAWSFiles(product?.images),
                videos: retrieveAWSFiles(product?.videos)
            }
        })  

    }catch(error){
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }

}
