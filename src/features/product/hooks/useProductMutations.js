import { productService } from "../services/productService";

export function useProductMutations({ refetchProducts, refetchStats, showSuccess }) {

    const createProduct = async (formData) => {
        const cleanData = {
            ...formData,
            sku: formData.sku.toUpperCase().trim(),
            price: formData.price ? parseFloat(formData.price) : null,
            costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
            quantityInStock:
                formData.quantityInStock !== "" ? parseInt(formData.quantityInStock) : null,
            lowStockThreshold:
                formData.lowStockThreshold !== "" ? parseInt(formData.lowStockThreshold) : null,
            currencyCode: "USD",
            createdBy: "admin",
        };

        await productService.createProduct(cleanData);

        refetchProducts();
        refetchStats?.();

        showSuccess(`${cleanData.name.toUpperCase()} CREATED`);
    };

    const updateProduct = async (formData) => {
        const { id, sku, ...dataToSync } = formData;

        const cleanData = {
            ...dataToSync,
            price: dataToSync.price ? parseFloat(dataToSync.price) : null,
            costPrice: dataToSync.costPrice ? parseFloat(dataToSync.costPrice) : null,
            quantityInStock:
                dataToSync.quantityInStock !== "" ? parseInt(dataToSync.quantityInStock) : null,
            lowStockThreshold:
                dataToSync.lowStockThreshold !== "" ? parseInt(dataToSync.lowStockThreshold) : null,
            updatedBy: "admin",
            version: dataToSync.version,
        };

        await productService.updateProduct(id, cleanData);

        refetchProducts();
        refetchStats?.();

        showSuccess(`${cleanData.name.toUpperCase()} UPDATED`);
    };

    const deleteProduct = async (product) => {
        if (!product) return;

        await productService.deleteProduct(product.id);

        const name = product?.name || "PRODUCT";

        refetchProducts();
        refetchStats?.();

        showSuccess(`${name.toUpperCase()} PERMANENTLY REMOVED`);
    };

    return {
        createProduct,
        updateProduct,
        deleteProduct,
    };
}