import { useState, useEffect } from "react";

export function useProductForm({ product, isOpen, onSave }) {
    const [formData, setFormData] = useState({
        sku: "",
        name: "",
        category: "",
        manufacturer: "",
        price: "",
        costPrice: "",
        quantityInStock: "",
        lowStockThreshold: 10,
        imageUrl: "",
    });

    const [errors, setErrors] = useState({});
    const [attributeRows, setAttributeRows] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        if (product) {
            setFormData({
                ...product,
                price: product.price?.toString() ?? "",
                costPrice: product.costPrice?.toString() ?? "",
                quantityInStock: product.quantityInStock?.toString() ?? "",
                lowStockThreshold: product.lowStockThreshold?.toString() ?? "10",
            });

            if (product.attributes) {
                setAttributeRows(
                    Object.entries(product.attributes).map(([key, value]) => ({
                        id: crypto.randomUUID(),
                        key,
                        value: String(value),
                    }))
                );
            }
        } else {
            resetForm();
        }

        setErrors({});
    }, [isOpen, product]);

    const resetForm = () => {
        setFormData({
            sku: "",
            name: "",
            category: "",
            manufacturer: "",
            price: "",
            costPrice: "",
            quantityInStock: "",
            lowStockThreshold: 10,
            imageUrl: "",
        });
        setAttributeRows([]);
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "PRODUCT NAME IS REQUIRED";
        if (!formData.sku.trim()) newErrors.sku = "SKU IDENTIFIER IS REQUIRED";
        if (!formData.category) newErrors.category = "CATEGORY REQUIRED";

        if (!formData.price || parseFloat(formData.price) <= 0)
            newErrors.price = "VALID PRICE REQUIRED";

        if (!formData.costPrice || parseFloat(formData.costPrice) <= 0)
            newErrors.costPrice = "VALID COST PRICE REQUIRED";

        if (formData.quantityInStock === "")
            newErrors.quantityInStock = "STOCK REQUIRED";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length) return;

        const attributes = attributeRows.reduce((acc, row) => {
            if (row.key.trim()) acc[row.key] = row.value;
            return acc;
        }, {});

        try {
            await onSave({ ...formData, attributes });
        } catch (err) {
            console.error(err);
        }
    };

    return {
        formData,
        errors,
        attributeRows,
        setAttributeRows,
        updateField,
        handleSubmit,
    };
}