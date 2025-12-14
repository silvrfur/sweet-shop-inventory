import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6 border flex flex-col gap-4">
      <h2 className="flex text-xl font-semibold items-center gap-2 text-orange-700 mb-2">
        <span><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' className='inline-block w-7 h-7'><path d='M2 11a9 9 0 1116.32 5.906l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387A9 9 0 012 11zm9-7a7 7 0 100 14 7 7 0 000-14z' fill='#fc6701'/></svg></span>
        Search & Filter
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 font-medium">Search</label>
          <Input placeholder="Search by name…"
            value={filters.search}
            onChange={e => setFilters(v => ({ ...v, search: e.target.value }))}
            autoFocus
          />
        </div>
        <div>
          <label className="mb-1 font-medium">Category</label>
          <Input placeholder="e.g., Milk-based, Dry, Fried…" value={filters.category}
            onChange={e => setFilters(v => ({ ...v, category: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 font-medium">Min Price (₹)</label>
          <Input type="number" value={filters.minPrice}
            onChange={e => setFilters(v => ({ ...v, minPrice: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 font-medium">Max Price (₹)</label>
          <Input type="number" value={filters.maxPrice}
            onChange={e => setFilters(v => ({ ...v, maxPrice: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <Button variant="outline" onClick={() => setFilters({ search: "", category: "", minPrice: "", maxPrice: "" })}>Clear Filters</Button>
      </div>
    </div>
  );
}

