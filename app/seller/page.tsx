"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle, PackagePlus, AlertCircle } from "lucide-react";

export default function SellerDashboard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Serums",
    skinType: [] as string[],
    description: "",
    ingredients: "",
    howToUse: "",
    sellerName: "",
  });

  const categories = ["Serums", "Moisturizers", "SPF", "Cleansers", "Masks"];
  const skinTypes = ["Oily", "Dry", "Combo", "Sensitive"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleSkinType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      skinType: prev.skinType.includes(type)
        ? prev.skinType.filter((t) => t !== type)
        : [...prev.skinType, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!imageFile) {
        throw new Error("Please select a product image");
      }
      if (formData.skinType.length === 0) {
        throw new Error("Please select at least one skin type");
      }

      // 1. Upload the image
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: imageFormData,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");
      const { url: imageUrl } = await uploadRes.json();

      // 2. Save the product to the database
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: [imageUrl],
        }),
      });

      if (!productRes.ok) throw new Error("Failed to save product");

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <PackagePlus className="w-8 h-8 text-neutral-900" />
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">
              Seller Dashboard
            </h1>
          </div>

          <p className="text-neutral-600 mb-8">
            List your new skincare product on GlowDifferent&apos;s marketplace. 
            Fill out the details below to add it instantly to the catalog!
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-green-900 mb-2">Product Listed Successfully!</h2>
              <p className="text-green-700">Redirecting you to the home page to see your product...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-900">Seller / Brand Name</label>
                  <input
                    required
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="e.g. My Skincare Brand"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-900">Product Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="e.g. Hydrating Glow Serum"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-900">Price ($)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="35.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-900">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-900">Suitable For Skin Types</label>
                <div className="flex flex-wrap gap-2">
                  {skinTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleSkinType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        formData.skinType.includes(type)
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-900">Product Image</label>
                <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center hover:bg-neutral-50 transition-colors relative">
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-4" />
                      <p className="text-sm text-neutral-500">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-10 h-10 text-neutral-400 mb-3" />
                      <p className="text-neutral-600 font-medium">Click or drag image to upload</p>
                      <p className="text-neutral-400 text-sm mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-900">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-900">Key Ingredients (comma separated)</label>
                <input
                  required
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="e.g. Hyaluronic Acid, Vitamin C, Niacinamide"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-900">How to Use</label>
                <textarea
                  required
                  rows={2}
                  value={formData.howToUse}
                  onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="Instructions for use..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-neutral-900 text-white rounded-xl font-medium text-lg hover:bg-neutral-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Listing Product...
                  </>
                ) : (
                  "List Product on Marketplace"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
