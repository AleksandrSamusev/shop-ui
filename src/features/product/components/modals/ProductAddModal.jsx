import { useState, useEffect } from "react";
import { CATEGORIES } from "../../../../shared/constants/categories";
import Dropdown from "../../../../shared/components/ui/Dropdown";
import FormField from "../../../../shared/components/ui/form/FormField";
import Textarea from "../../../../shared/components/ui/form/Textarea";
import Input from "../../../../shared/components/ui/form/Input";

const DEFAULT_CATEGORY = CATEGORIES[0];

export default function AddProductModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  product = null,
}) {
  const isEditMode = !!product;

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: DEFAULT_CATEGORY,
    manufacturer: "Veloce Forge",
    price: "",
    costPrice: "",
    quantityInStock: "",
    lowStockThreshold: 10,
    imageUrl: "",
    attributes: {},
  });

  const [errors, setErrors] = useState({});
  const [attributeRows, setAttributeRows] = useState([]);

  // ✅ unified field updater
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

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
      setFormData({
        sku: "",
        name: "",
        category: DEFAULT_CATEGORY,
        manufacturer: "Veloce Forge",
        price: "",
        costPrice: "",
        quantityInStock: "",
        lowStockThreshold: 10,
        imageUrl: "",
        attributes: {},
      });

      setAttributeRows([]);
    }

    setErrors({});
  }, [isOpen, product]);

  const handleAddAttribute = () => {
    setAttributeRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: "", value: "" },
    ]);
  };

  const updateAttributeRow = (index, field, val) => {
    setAttributeRows((prev) => {
      const updated = [...prev];
      updated[index][field] = val;
      return updated;
    });
  };

  const removeAttributeRow = (index) => {
    setAttributeRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT TRIGGERED");

    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "PRODUCT NAME IS REQUIRED";
    if (!formData.sku.trim()) newErrors.sku = "SKU IDENTIFIER IS REQUIRED";
    if (!formData.category) newErrors.category = "CATEGORY REQUIRED";

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0)
      newErrors.price = "VALID PRICE REQUIRED";

    if (isNaN(parseFloat(formData.costPrice)) || parseFloat(formData.costPrice) <= 0)
      newErrors.costPrice = "VALID COST PRICE REQUIRED";

    if (formData.quantityInStock === "")
      newErrors.quantityInStock = "STOCK REQUIRED";

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      console.log("VALIDATION FAILED:", newErrors);
      return;
    }

    const attributes = attributeRows.reduce((acc, row) => {
      if (row.key.trim()) acc[row.key] = row.value.trim();
      return acc;
    }, {});

    console.log("SENDING:", { ...formData, attributes });

    if (!onSave) {
      console.warn("onSave not provided");
      return;
    }

    try {
      await onSave({ ...formData, attributes });
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">

        {/* HEADER */}
        <header className="p-8 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-3xl font-black text-white italic uppercase">
            {isEditMode ? "Update Product" : "Add New Product"}
          </h2>

          <button onClick={onClose} className="text-slate-500 hover:text-white">
            ✕
          </button>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col">

          <div className="max-h-[70vh] overflow-y-auto p-8 pb-12 flex flex-col gap-10 custom-scrollbar">

            {/* ROW 1 */}
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
              <FormField label="Product Name" error={errors.name}>
                <Input
                  placeholder="e.g. Falcon Navigation Unit"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  error={errors.name}
                />
              </FormField>

              <FormField label="Price" error={errors.price}>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  error={errors.price}
                />
              </FormField>

              <FormField label="Cost" error={errors.costPrice}>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChange={(e) => updateField("costPrice", e.target.value)}
                  error={errors.costPrice}
                />
              </FormField>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-4 gap-6">
              <FormField label="SKU" error={errors.sku}>
                <Input
                  placeholder="e.g. VEL-001-A"
                  value={formData.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  error={errors.sku}
                />
              </FormField>

              <FormField label="Category">
                <div className="h-[48px]">
                  <Dropdown
                    value={formData.category}
                    onChange={(value) => updateField("category", value)}
                    options={CATEGORIES.map((c) => ({
                      label: c,
                      value: c,
                    }))}
                  />
                </div>
              </FormField>

              <FormField label="Stock" error={errors.quantityInStock}>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.quantityInStock}
                  onChange={(e) =>
                    updateField("quantityInStock", e.target.value)
                  }
                  error={errors.quantityInStock}
                />
              </FormField>

              <FormField label="Threshold">
                <Input
                  type="number"
                  placeholder="10"
                  value={formData.lowStockThreshold}
                  onChange={(e) =>
                    updateField("lowStockThreshold", e.target.value)
                  }
                />
              </FormField>
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-800/50 items-start">

              {/* IMAGE */}
              <FormField label="Image Base64">
                <Textarea
                  placeholder="data:image/webp;base64,..."
                  value={formData.imageUrl}
                  onChange={(e) =>
                    updateField("imageUrl", e.target.value)
                  }
                />
              </FormField>

              {/* SPECS */}
              <div className="space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Technical Specifications
                  </span>

                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="text-[10px] font-black text-blue-400 hover:text-white uppercase tracking-widest"
                  >
                    + Add Spec
                  </button>
                </div>

                <div className="max-h-[180px] overflow-y-auto pr-2 custom-scrollbar specs-scroll">
                  {attributeRows.length === 0 ? (
                    <div className="h-[180px] flex items-center justify-center text-center">
                      <span className="text-slate-600 text-[11px] font-semibold uppercase tracking-widest opacity-70">
                        No Specs Selected
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attributeRows.map((row, index) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-[1fr_1.5fr_auto] gap-4 items-center"
                        >
                          <Input
                            placeholder="Key (e.g. Weight)"
                            value={row.key}
                            onChange={(e) =>
                              updateAttributeRow(index, "key", e.target.value)
                            }
                            className="h-[40px] text-[10px] text-slate-400"
                          />

                          <Input
                            placeholder="Value (e.g. 1.2kg)"
                            value={row.value}
                            onChange={(e) =>
                              updateAttributeRow(index, "value", e.target.value)
                            }
                            className="h-[40px] text-[10px]"
                          />

                          <button
                            type="button"
                            onClick={() => removeAttributeRow(index)}
                            className="h-[40px] w-[40px] text-slate-600 hover:text-red-500"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end items-center gap-4 px-8 py-6 border-t border-slate-800/40">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-[44px] text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-[160px] h-[44px] bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em]"
            >
              {isSaving ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}