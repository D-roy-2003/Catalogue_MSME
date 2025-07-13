"use client";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AnimatedPage from "../AnimatedPage";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function IndividualProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, relatedRes] = await Promise.all([
          axios.get(`${backendUrl}/api/public/products/${productId}`),
          axios.get(`${backendUrl}/api/public/products/${productId}/related`),
        ]);

        let artisanData = { profileImage: null, username: "", contact: "" };
        if (productRes.data.artisanId) {
          try {
            const artisanRes = await axios.get(`${backendUrl}/public/artisans/${productRes.data.artisanId}`);
            artisanData = artisanRes.data;
            console.log("Artisan Data received:", artisanData);
          } catch (artisanErr) {
            console.error("Error fetching artisan details:", artisanErr);
            // Continue without artisan data if fetching fails
          }
        }

        setProduct({
          ...productRes.data,
          images: productRes.data.images || ["/placeholder-product.jpg"],
          profileImageUrl: artisanData?.profileImage || null,
          username: artisanData?.username || "",
          PhoneNumber: artisanData?.PhoneNumber || "",
        });
        console.log("Final Product State (after assignment):", product);

        setRelatedProducts(
          relatedRes.data.map((p) => ({
            ...p,
            images: p.images || ["/placeholder-product.jpg"],
            primaryImage: p.primaryImage || "/placeholder-product.jpg",
          }))
        );
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <ErrorPage error={error} />;
  if (!product) return <NotFoundPage />;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <ProductDetails product={product} />
          <RelatedProducts products={relatedProducts} />
        </main>
      </div>
    </AnimatedPage>
  );
}

function ErrorPage({ error }) {
  return (
    <AnimatedPage>
      <div className="text-center py-20">
        <h2 className="text-red-500 text-xl mb-4">Error: {error}</h2>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Products
        </Link>
      </div>
    </AnimatedPage>
  );
}

function NotFoundPage() {
  return (
    <AnimatedPage>
      <div className="text-center py-20">
        <h2 className="text-xl mb-4">Product not found</h2>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Products
        </Link>
      </div>
    </AnimatedPage>
  );
}

function ProductDetails({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Fixed navigation handlers
  const handlePrev = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  // Fixed thumbnail click handler
  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const specifications = {
    material: product.material || "Not specified",
    weight: product.weight || "Not specified",
    height: product.height || "Not specified",
    width: product.width || "Not specified",
    certification: product.certification || "Not specified",
    finish: product.finish || "Not specified",
  };

  return (
    <section className="lg:grid lg:grid-cols-[40%_60%] lg:gap-16">
      {/* Product Images */}
      <div className="flex flex-col gap-6">
        <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg relative max-w-md mx-auto">
          {product.images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-all z-10"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-all z-10"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
          {/* Key fix: Add unique key to force re-render */}
          <ImageWithFallback
            key={`main-${selectedImage}`} // Crucial fix
            src={product.images[selectedImage]}
            alt={`Main product view ${selectedImage + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-2 max-w-md mx-auto w-full">
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-1/5 aspect-square overflow-hidden rounded-xl transition-all duration-200 ${
                selectedImage === index
                  ? "ring-3 ring-emerald-500 scale-105"
                  : "ring-1 ring-gray-300 hover:ring-emerald-300"
              }`}
            >
              <ImageWithFallback
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 lg:mt-0">
        <h1 className="text-3xl font-bold text-gray-900">
          {product.productName}
        </h1>
        <p className="text-3xl font-semibold text-emerald-600 mt-4">
          ₹{product.productPrice}
        </p>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Product Specifications
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(specifications).map(([key, value]) => (
              <SpecItem key={key} name={key} value={value} />
            ))}
          </div>
        </div>

        {product.productDescription && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600">{product.productDescription}</p>
          </div>
        )}

        <ArtisanInfo artisan={product} />
      </div>
    </section>
  );
}

function ArtisanInfo({ artisan }) {
  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-semibold text-gray-900">About the Artisan</h2>
      <div className="mt-6 flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
          {artisan.profileImageUrl ? (
            <img
              src={artisan.profileImageUrl}
              alt={artisan.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl text-gray-600 flex items-center justify-center h-full">
              {artisan.username?.[0]?.toUpperCase() || "A"}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {artisan.username}
          </h3>
          <p className="text-sm text-gray-500 mt-2">{artisan.specialization}</p>
          <p className="text-gray-600 mt-2">Contact: {artisan.PhoneNumber ? `+91${artisan.PhoneNumber}` : 'No contact provided'}</p>
        </div>
      </div>
    </div>
  );
}

function RelatedProducts({ products }) {
  const [visibleCount, setVisibleCount] = useState(4);

  return (
    <section className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        {products.length > 4 && (
          <button
            className="text-emerald-600 hover:text-emerald-700 font-medium"
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + 4, products.length))
            }
          >
            View More →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, visibleCount).map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function RelatedProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
      onMouseEnter={() => {
        if (product.images.length > 1) {
          setCurrentImageIndex(1);
        }
      }}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      <div className="aspect-square overflow-hidden relative">
        <ImageWithFallback
          src={product.images[currentImageIndex] || product.primaryImage}
          alt={product.productName}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">
          {product.productName}
        </h3>
        <p className="mt-2 text-lg font-semibold text-emerald-600">
          ₹{product.productPrice}
        </p>
      </div>
    </Link>
  );
}

function ImageWithFallback({ src, alt, className, fallback }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  const onError = () => {
    if (!errored) {
      setErrored(true);
      setImgSrc("/placeholder-product.jpg");
    }
  };

  return <img src={imgSrc} alt={alt} className={className} onError={onError} />;
}

function SpecItem({ name, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
      <dt className="text-sm font-medium text-gray-500">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </dt>
      <dd className="mt-1 text-gray-900">{value}</dd>
    </div>
  );
}

export default IndividualProduct;
