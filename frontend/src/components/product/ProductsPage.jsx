"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import AnimatedPage from "../AnimatedPage";

function Sidebar({
  activeFilters,
  setActiveFilters,
  priceRange,
  setPriceRange,
}) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Define categories with additional options
  const allCategories = [
    "Earrings",
    "Necklaces",
    "Showpieces",
    "Idol",
    "Ornaments",
    "Utensils",
    "Bracelets",
    "Rings",
    "Sculptures",
    "Home Decor",
    "Others",
  ];
  const displayedCategories = showAllCategories
    ? allCategories
    : allCategories.slice(0, 3);

  const handlePriceChange = (e) => setPriceRange(parseInt(e.target.value));

  const toggleCategory = (category) => {
    setActiveFilters((prev) => {
      const categories = [...prev.categories];
      if (categories.includes(category)) {
        return {
          ...prev,
          categories: categories.filter((c) => c !== category),
        };
      } else {
        return { ...prev, categories: [...categories, category] };
      }
    });
  };

  const toggleMaterial = (material) => {
    setActiveFilters((prev) => {
      const materials = [...prev.materials];
      if (materials.includes(material)) {
        return { ...prev, materials: materials.filter((m) => m !== material) };
      } else {
        return { ...prev, materials: [...materials, material] };
      }
    });
  };

  const resetFilters = () => {
    setActiveFilters({ categories: [], materials: [] });
    setPriceRange(100000);
  };

  const activeFiltersCount =
    activeFilters.categories.length +
    activeFilters.materials.length +
    (priceRange < 100000 ? 1 : 0);

  // Material mapping for display vs value
  const materials = [
    { display: "Silver", value: "Silver" },
    { display: "Mixed Metals", value: "Mixed Metals" },
    { display: "Gold", value: "Gold" },
    { display: "Other", value: "Others" },
  ];

  return (
    <aside className="w-full lg:max-w-xs px-4 py-6 bg-white rounded-xl shadow-md text-gray-800 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 flex items-center"
            >
              Clear All
              <span className="ml-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {isExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`space-y-8 transition-all duration-300 ${
          isExpanded
            ? "opacity-100"
            : "opacity-0 lg:opacity-100 h-0 lg:h-auto overflow-hidden"
        }`}
      >
        {/* Category Filter */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </span>
            Category
          </h3>
          <div className="space-y-3">
            {displayedCategories.map((item) => (
              <label
                key={item}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 
                  ${hoveredCategory === item ? "bg-indigo-50" : ""}
                  ${
                    activeFilters.categories.includes(item)
                      ? "bg-indigo-100"
                      : ""
                  }`}
                onMouseEnter={() => setHoveredCategory(item)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-md checked:border-indigo-500 transition-colors duration-200"
                    checked={activeFilters.categories.includes(item)}
                    onChange={() => toggleCategory(item)}
                  />
                  {activeFilters.categories.includes(item) && (
                    <svg
                      className="absolute top-0 left-0 h-5 w-5 text-indigo-500 pointer-events-none"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{item}</span>
              </label>
            ))}
            {allCategories.length > 3 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-sm text-indigo-600 hover:text-indigo-800 pl-8 flex items-center"
              >
                {showAllCategories ? "Show less" : "Show more"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transition-transform ${
                    showAllCategories ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </section>

        {/* Material Filter - FIXED */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Material
          </h3>
          <div className="space-y-3">
            {materials.map((material) => (
              <label
                key={material.display}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200
                  ${
                    activeFilters.materials.includes(material.value)
                      ? "bg-indigo-100"
                      : ""
                  }`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-md checked:border-indigo-500 transition-colors duration-200"
                    checked={activeFilters.materials.includes(material.value)}
                    onChange={() => toggleMaterial(material.value)}
                  />
                  {activeFilters.materials.includes(material.value) && (
                    <svg
                      className="absolute top-0 left-0 h-5 w-5 text-indigo-500 pointer-events-none"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{material.display}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Price Range
          </h3>
          <div className="px-1">
            <div className="relative pt-1">
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={priceRange}
                onChange={handlePriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
                    (priceRange / 100000) * 100
                  }%, #e5e7eb ${(priceRange / 100000) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-sm font-medium text-gray-600 mt-4">
                <span>₹0</span>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md">
                  ₹{priceRange.toLocaleString()}
                </span>
                <span>₹1,00,000</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}

// ArtisanSection
function ArtisanSection({ artisan, index }) {
  const username = artisan?.username || "Artisan";
  const products = artisan?.products || [];
  const initial = username[0]?.toUpperCase() || "A";
  const color = `hsl(${index * 60}, 70%, 30%)`;
  const profileImageUrl = artisan.profileImage || null;
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm mb-8 transition-all duration-300 hover:shadow-md" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex items-center gap-4 mb-6">
        {profileImageUrl ? (
          <img src={profileImageUrl} alt={username} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: color }} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2" style={{ borderColor: color }}>
            <span className="text-xl font-bold" style={{ color }}>{initial}</span>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{username}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Listed Products:</span>
            <span className="px-2 py-1 rounded-full" style={{ backgroundColor: `${color}20`, color }}>{products.length} items</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product?.id || Math.random()} product={product} color={color} />
        ))}
      </div>
    </section>
  );
}

// ProductCard
function ProductCard({ product, color = "#4f46e5" }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ transform: isHovered ? "translateY(-4px)" : "none", borderTop: `3px solid ${color}` }}>
      <div className="relative h-64 overflow-hidden">
        <img src={product.image1} alt={product.productName} className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`} />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0 }}>
          <Link to={`/products/${product.id}`} className="px-4 py-2 bg-white rounded-md shadow-md flex items-center gap-2" style={{ color }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
            View Details
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.productName}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{product.productDescription}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold" style={{ color }}>₹{Number(product.productPrice).toLocaleString("en-IN")}</span>
          <div className="flex flex-col items-end gap-2">
            {product.listed_at && (<span className="text-xs text-gray-500">Listed: {new Date(product.listed_at).toLocaleDateString()}</span>)}
            {product.category && (<span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// FilteredProductsGrid
function FilteredProductsGrid({ products, resetFilters }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-600">No products match your filters</h3>
        <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">Clear Filters</button>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (<ProductCard key={product.id} product={product} />))}
      </div>
    </div>
  );
}

// ProductGrid
function ProductGrid({ refreshTrigger, filters, resetFilters }) {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const artisansRes = await axios.get(`${backendUrl}/public/artisans`);
        const realArtisans = artisansRes.data.filter((artisan) => ![1, 2].includes(artisan.artisanId));
        const artisanPromises = realArtisans.map(async (artisan) => {
          try {
            const productsRes = await axios.get(`${backendUrl}/public/artisans/${artisan.artisanId}/products`);
            const realProducts = productsRes.data.filter((product) => ![1, 2].includes(product.artisanId));
            return { ...artisan, profileImage: artisan.profileImage, products: realProducts };
          } catch (error) {
            console.error(`Error fetching products for ${artisan.artisanId}:`, error);
            return null;
          }
        });
        const artisansWithProducts = (await Promise.all(artisanPromises)).filter((artisan) => artisan !== null && artisan.products.length > 0);
        const allProducts = artisansWithProducts.flatMap((artisan) => artisan.products.map((product) => ({ ...product, artisanName: artisan.username, artisanId: artisan.artisanId })));
        setArtisans(artisansWithProducts);
        setAllProducts(allProducts);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);
  useEffect(() => {
    const areFiltersActive = filters.categories.length > 0 || filters.materials.length > 0 || filters.priceRange < 100000 || (filters.searchQuery && filters.searchQuery.trim() !== "");
    if (!areFiltersActive) {
      setIsFiltered(false);
      return;
    }
    setIsFiltered(true);
    const filtered = allProducts.filter((product) => {
      if (filters.categories.length > 0) {
        if (filters.categories.includes("Others")) {
          let categoryMatches = false;
          if (product.category === "Others") categoryMatches = true;
          const otherSelectedCategories = filters.categories.filter((c) => c !== "Others");
          if (otherSelectedCategories.length > 0 && otherSelectedCategories.includes(product.category)) categoryMatches = true;
          if (!categoryMatches) return false;
        } else {
          if (!filters.categories.includes(product.category)) return false;
        }
      }
      if (filters.materials.length > 0) {
        const standardBackendMaterials = ["Silver", "Gold", "Mixed Metals"];
        if (filters.materials.includes("Others")) {
          let materialMatches = false;
          if (!standardBackendMaterials.includes(product.material)) materialMatches = true;
          const otherSelectedMaterials = filters.materials.filter((m) => m !== "Others");
          if (otherSelectedMaterials.length > 0 && otherSelectedMaterials.includes(product.material)) materialMatches = true;
          if (!materialMatches) return false;
        } else {
          if (!filters.materials.includes(product.material)) return false;
        }
      }
      if (filters.priceRange < 100000 && product.productPrice > filters.priceRange) return false;
      if (filters.searchQuery) {
        const lowerQuery = filters.searchQuery.toLowerCase();
        if (!product.productName.toLowerCase().includes(lowerQuery) && !product.productDescription.toLowerCase().includes(lowerQuery) && !product.artisanName.toLowerCase().includes(lowerQuery)) return false;
      }
      return true;
    });
    setFilteredProducts(filtered);
  }, [filters, allProducts]);
  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (isFiltered) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Filtered Products ({filteredProducts.length})</h2>
          <button onClick={resetFilters} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            Clear Filters
          </button>
        </div>
        <FilteredProductsGrid products={filteredProducts} resetFilters={resetFilters} />
      </div>
    );
  }
  return (
    <div className="space-y-12">
      {artisans.map((artisan, index) => (
        <ArtisanSection key={artisan.artisanId} artisan={artisan} index={index} />
      ))}
      {!loading && artisans.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No artisans have listed their products yet</h3>
        </div>
      )}
    </div>
  );
}

function ProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State for filters
  const [filters, setFilters] = useState({
    categories: [],
    materials: [],
    priceRange: 100000, // Set to max by default
    searchQuery: "",
  });

  // Calculate active filters count for mobile badge
  const activeFiltersCount =
    filters.categories.length +
    filters.materials.length +
    (filters.priceRange < 100000 ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      categories: [],
      materials: [],
      priceRange: 100000, // Reset to max
      searchQuery: "",
    });
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  return (
    <AnimatedPage>
      <div className="bg-gray-50 min-h-screen">
        {/* Main Container */}
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header - Updated layout */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
              <p className="mt-2 text-gray-600">
                Discover our curated collection of quality items
              </p>
            </div>
            {/* Search Form - Moved to top right */}
            <div className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products or artisans..."
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {/* Mobile-only Filters toggle */}
              <div className="md:hidden mt-3">
                <button
                  type="button"
                  onClick={() => setFilterOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm active:shadow outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 01.8 1.6l-4.2 6.3V16a1 1 0 01-1.447.894l-3-1.5A1 1 0 017 14.5v-2.6L3.2 6.6A1 1 0 013 5z" clipRule="evenodd" />
                  </svg>
                  {filterOpen ? "Hide Filters" : "Show Filters"}
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center text-xs font-medium w-5 h-5 rounded-full bg-indigo-600 text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Products Layout */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Mobile */}
            <div
              className={`${filterOpen ? "block" : "hidden"} md:hidden w-full bg-white p-4 rounded-lg shadow-sm mb-4`}
            >
              <Sidebar
                activeFilters={filters}
                setActiveFilters={setFilters}
                priceRange={filters.priceRange}
                setPriceRange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))}
              />
            </div>
            {/* Sidebar - Desktop */}
            <div className="hidden md:block w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Sidebar
                    activeFilters={filters}
                    setActiveFilters={setFilters}
                    priceRange={filters.priceRange}
                    setPriceRange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))}
                  />
                </div>
              </div>
            </div>
            {/* Product Grid */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ProductGrid
                  refreshTrigger={refreshTrigger}
                  filters={filters}
                  resetFilters={resetFilters}
                />
              </div>
            </div>
          </div>
          {/* Promotional Banner */}
          <div className="mt-16 mb-8">
            <div className="bg-gradient-to-r from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-8 md:p-12 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Special Collection
                </h2>
                <p className="text-lg mb-6 max-w-lg">
                  Discover our newest arrivals with exclusive discounts for
                  limited time.
                </p>
                <button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-2 px-6 rounded-lg transition-colors duration-300 cursor-pointer">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default ProductsPage;
