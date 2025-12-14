import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import {
  getProducts,
  addProduct,
  restockProduct,
  deleteProduct,
} from "@/api/products";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({}); // Store image URLs locally
  const [restockId, setRestockId] = useState(null);
  const [restockQty, setRestockQty] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    image: ""
  });

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
      
      // Load stored image URLs from localStorage
      const storedImages = localStorage.getItem('productImages');
      if (storedImages) {
        setProductImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Stats
  const summary = useMemo(() => {
    const total = products.length;
    const low = products.filter((p) => p.quantity > 0 && p.quantity < 10).length;
    const oos = products.filter((p) => p.quantity === 0).length;
    return { total, low, oos };
  }, [products]);

  const handleRestock = async () => {
    if (!restockId || !restockQty || isNaN(restockQty) || restockQty < 1) return;
    setLoading(true);
    try {
      await restockProduct(restockId, Number(restockQty));
      setDialogOpen(false);
      setRestockId(null);
      setRestockQty("");
      loadProducts();
    } catch (error) {
      console.error("Restock failed:", error);
      alert("Restock failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed. Please try again.");
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity) {
      alert("Please fill in all required fields (Name, Category, Price, Quantity)");
      return;
    }
    setLoading(true);
    try {
      await addProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        description: newProduct.description || "",
        image: newProduct.image || ""
      });
      
      // Store image URL locally if provided (persist in localStorage)
      const imageUrl = newProduct.image.trim();
      if (imageUrl) {
        // Reload products to get the new product ID, then store the image
        await loadProducts();
        const updatedProducts = await getProducts();
        const newProd = updatedProducts.find(p => p.name === newProduct.name && p.category === newProduct.category);
        if (newProd) {
          const updatedImages = {
            ...productImages,
            [newProd.id]: imageUrl
          };
          setProductImages(updatedImages);
          localStorage.setItem('productImages', JSON.stringify(updatedImages));
        }
      }
      
      setAddProductDialogOpen(false);
      setNewProduct({ name: "", category: "", price: "", quantity: "", description: "", image: "" });
      await loadProducts();
    } catch (error) {
      console.error("Add product failed:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-10 pb-16 px-2 md:p-8">
        <h1 className="text-5xl font-extrabold text-orange-600 mb-2">Admin Dashboard</h1>
        <div className="text-xl text-zinc-500 mb-10">Manage your mithai inventory</div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border rounded-2xl p-6 flex flex-col gap-1 items-start shadow relative">
            <span className="text-zinc-500 font-semibold mb-1">Total Products</span>
            <span className="text-4xl font-extrabold text-zinc-900">{summary.total}</span>
            <span className="absolute top-3 right-4 text-zinc-300"><svg width="18" height="18"><rect width="18" height="18" rx="3" fill="#e0e0e0"/></svg></span>
          </div>
          <div className="bg-white border rounded-2xl p-6 flex flex-col gap-1 items-start shadow relative">
            <span className="text-zinc-500 font-semibold mb-1">Low Stock</span>
            <span className="text-4xl font-extrabold text-orange-600">{summary.low}</span>
            <span className="text-xs text-zinc-500">&lt; 10 units</span>
            <span className="absolute top-3 right-4 text-orange-400"><svg width="18" height="18"><rect width="18" height="18" rx="3" fill="#ffb36e"/></svg></span>
          </div>
          <div className="bg-white border rounded-2xl p-6 flex flex-col gap-1 items-start shadow relative">
            <span className="text-zinc-500 font-semibold mb-1">Out of Stock</span>
            <span className="text-4xl font-extrabold text-red-600">{summary.oos}</span>
            <span className="text-xs text-zinc-500">Needs restock</span>
            <span className="absolute top-3 right-4 text-red-400"><svg width="18" height="18"><rect width="18" height="18" rx="3" fill="#ff5252"/></svg></span>
          </div>
        </div>

        {/* Product Inventory Table */}
        <div className="bg-white/90 rounded-2xl shadow border">
          <div className="px-6 pt-6 pb-2 flex justify-between items-center border-b">
            <div className="text-xl font-bold">Products</div>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => setAddProductDialogOpen(true)}
            >
              <span className="text-xl font-semibold mr-1">+</span> Add Product
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[680px]">
              <thead>
                <tr className="text-zinc-500 text-sm">
                  <th className="py-3 pl-6">Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t text-zinc-800 hover:bg-orange-50 transition">
                    <td className="py-4 pl-6 flex gap-3 items-center">
                      <img 
                        src={p.image || productImages[p.id] || "/vite.svg"} 
                        alt={p.name} 
                        className="w-12 h-12 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = "/vite.svg";
                        }}
                      />
                      <span>
                        <div className="text-md font-bold leading-tight">{p.name}</div>
                        {p.description && <div className="text-sm text-zinc-400 max-w-xs truncate">{p.description}</div>}
                      </span>
                    </td>
                    <td><span className={
                      p.category.toLowerCase() === "milk-based" ? "bg-orange-200 text-orange-700 px-2 py-1 rounded text-xs font-bold" :
                      p.category.toLowerCase() === "fried" ? "bg-pink-200 text-pink-700 px-2 py-1 rounded text-xs font-bold" :
                      "bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-xs font-bold"
                    }>{p.category}</span></td>
                    <td className="font-bold">₹{p.price}</td>
                    <td>
                      {p.quantity === 0 ? (
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">0 units</span>
                      ) : (
                        <span className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded text-xs">{p.quantity} units</span>
                      )}
                    </td>
                    <td>
                      <Button variant="outline" onClick={() => { setRestockId(p.id); setRestockQty(""); setDialogOpen(true); }}>Restock</Button>
                      <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() => handleDelete(p.id)}
                        style={{ color: '#f44336', borderColor: '#f44336' }}
                      >
                        <span className="inline-flex gap-1 items-center"><svg width="16" height="16" fill="none"><rect width="16" height="16" rx="3" fill="#f44336"/><path d="M5.5 6.5l5 5M10.5 6.5l-5 5" stroke="#fff" strokeWidth="1.4"/></svg>Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-zinc-400 text-lg">No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Dialog */}
        <Dialog open={addProductDialogOpen} onOpenChange={(open) => {
          setAddProductDialogOpen(open);
          if (!open) {
            setNewProduct({ name: "", category: "", price: "", quantity: "", description: "", image: "" });
          }
        }}>
          <DialogContent className="max-w-md">
            <div className="text-xl font-bold mb-4">Add New Product</div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Product Name *</label>
                <Input
                  placeholder="e.g., Gulab Jamun"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Category *</label>
                <Input
                  placeholder="e.g., Milk-based, Dry, Fried"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Price (₹) *</label>
                  <Input
                    type="number"
                    placeholder="120"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Quantity *</label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Description</label>
                <Input
                  placeholder="Product description (optional)"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Image URL</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
                {newProduct.image && (
                  <div className="mt-3">
                    <label className="text-xs text-gray-600 mb-2 block">Preview:</label>
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <img 
                        src={newProduct.image} 
                        alt="Preview" 
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="hidden text-xs text-red-500 p-2 text-center">
                        Failed to load image. Please check the URL.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button 
                disabled={loading} 
                className="flex-1 bg-orange-600 hover:bg-orange-700" 
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setAddProductDialogOpen(false);
                  setNewProduct({ name: "", category: "", price: "", quantity: "", description: "", image: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Restock Dialog */}
        {restockId && (
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setRestockId(null);
              setRestockQty("");
            }
          }}>
            <DialogContent>
              <div className="text-xl font-bold mb-3">Restock Sweet</div>
              <div className="mb-4">Add more inventory for <b>{products.find(p => p.id === restockId)?.name}</b></div>
              <div className="mb-4">Current stock: <b>{products.find(p => p.id === restockId)?.quantity || 0} units</b></div>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                autoFocus
                min={1}
                className="mb-4"
              />
              <div className="flex gap-3">
                <Button disabled={loading} className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={handleRestock}>Restock</Button>
                <Button variant="outline" onClick={() => { setDialogOpen(false); setRestockId(null); setRestockQty(""); }}>Cancel</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
