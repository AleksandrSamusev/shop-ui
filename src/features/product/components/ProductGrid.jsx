import ProductCard from "./ProductCard";
import GridEmptyState from "../../../shared/components/ui/GridEmptyState";

export default function ProductGrid({
  products = [],
  isAdmin = false,
  onEdit,
  onDelete,
  openMenuId,
  setOpenMenuId,
  onViewSpecs,
  onEmptyAction,
}) {
  if (!products || products.length === 0) {
    return (
      <GridEmptyState
        isAdmin={isAdmin}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onViewSpecs={() => onViewSpecs?.(product)}
        />
      ))}
    </div>
  );
}
