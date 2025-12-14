import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
// Assume getProducts and purchaseProduct support filters in backend; else filter here
import { getProducts, purchaseProduct } from "@/api/products";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({}); // Store image URLs locally
  const [filters, setFilters] = useState({ search: "", category: "", minPrice: "", maxPrice: "" });
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // For demo, filter in UI
  const filtered = products.filter(p => {
    const search = filters.search.trim().toLowerCase();
    const cat = filters.category.trim().toLowerCase();
    const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
    const max = filters.maxPrice ? parseFloat(filters.maxPrice) : 1000000;
    return (
      ((!search) || p.name.toLowerCase().includes(search)) &&
      ((!cat) || p.category.toLowerCase().includes(cat)) &&
      (p.price >= min && p.price <= max)
    );
  });

  const handlePurchase = async (id) => {
    try {
      await purchaseProduct(id, 1);
      loadProducts();
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-10 pb-16 px-2 md:p-8">
        <h1 className="text-5xl font-extrabold text-orange-600 mb-2">Shop Traditional Sweets</h1>
        <div className="text-lg text-zinc-500 mb-8">Authentic Indian mithai made with love and tradition</div>
        <div>
          <SearchBar filters={filters} setFilters={setFilters} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-zinc-400 py-16 text-xl">No sweets found.</div>
          )}
          {filtered.map((p) => (
            <div key={p.id} className="rounded-2xl border bg-white/80 shadow overflow-hidden flex flex-col">
              <img
                src={p.image || productImages[p.id] || "/vite.svg"}
                alt={p.name}
                className="h-64 w-full object-cover"
                onError={(e) => {
                  e.target.src = "/vite.svg";
                }}
              />
              <div className="flex-1 flex flex-col p-6 gap-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-semibold flex-1">{p.name}</h2>
                    <span className="bg-orange-200 text-orange-700 px-2 py-0.5 rounded text-sm font-semibold block">{p.category}</span>
                  </div>
                  {p.description && <div className="text-zinc-600 mb-2 text-sm">{p.description}</div>}
                  <div className="flex items-center gap-6 mb-2">
                    <div className="text-orange-600 font-bold text-2xl">₹{p.price}</div>
                    {p.quantity === 0 ? (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">Out of stock</span>
                    ) : (
                      <span className="text-zinc-500 font-semibold text-sm">{p.quantity} in stock</span>
                    )}
                  </div>
                </div>
                <Button
                  disabled={p.quantity === 0}
                  onClick={() => handlePurchase(p.id)}
                  className={p.quantity === 0 ? "opacity-70 bg-orange-100 hover:bg-orange-100" : ""}
                >
                  <span className="inline-flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M6 6h15l-1.5 9h-13z" stroke="#fff" strokeWidth="2"/><circle cx="9" cy="21" r="1" fill="#fff"/><circle cx="18" cy="21" r="1" fill="#fff"/></svg>
                    Purchase
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
