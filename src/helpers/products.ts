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

