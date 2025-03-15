// src/helpers/propertyHelper.ts
export const getProperties = (props: any): string => {
    const array = Object.entries(props) || [];
    const properties = array
        .filter(
            ([key, value]) =>
                value !== null &&
                value !== "false" &&
                value !== false &&
                value !== "N/A" &&
                key !== "_id" &&
                key !== "createdAt" &&
                key !== "updatedAt"
        )
        .map(([_, value]) => value);
    return properties.join(" ");
};


export const parseProductsToMercadoPago = (products: Array<Object>) => {
    const items = products.map((item: any) => {
        const variant = item?.variant ?? null;
        const product = item.item;
        const quantity = item.quantity;
        const isVariant = Boolean(variant);
        const variantPrice = variant?.porcentDiscount ? variant?.discountPrice : variant?.price;
        const productPrice = product?.porcentDiscount ? product?.discountPrice : product?.price; 
        const newItem = {
          id:  product._id,
          title: product.name + (isVariant ? getProperties(variant?.attributes) : ""),
          unit_price: isVariant ? variantPrice : productPrice,
          picture_url:  isVariant ? variant.images[0]?.url : product.images[0]?.url,
          quantity: quantity
        };
        return  newItem           
    });       
    return items;
}
