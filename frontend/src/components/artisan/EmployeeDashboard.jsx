"use client";
import { useState, useEffect } from "react";
import AnimatedPage from "../AnimatedPage";
import axios from "axios";
import { UploadCloud, Plus, PhoneCall } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const productUrl = `${backendUrl}/products`;

const translations = {
  en: {
    dashboardTitle: "Employee / Artisan Dashboard",
    name: "Name",
    specialization: "Your Specialization",
    phoneNumber: "Phone Number",
    action: "Action",
    edit: "Edit",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel",
    productNumber: "Product Number",
    productName: "Product Name",
    price: "Price",
    material: "Material",
    certification: "Certification",
    finish: "Finish",
    height: "Height",
    width: "Width",
    weight: "Weight",
    category: "Category",
    productDescription: "Product Description",
    addMoreProducts: "Add More Products",
    listProducts: "List Products",
    updateListing: "Update Listing",
    manageProducts: "Manage Products",
    selectSpecialization: "Select Specialization",
    notSpecified: "Not Specified",
    noContactProvided: "No contact provided",
    saveProfile: "Save Profile",
    cancelProfile: "Cancel Profile",
    uploadCloud: "Upload Cloud",
    contactNumberMustBe10Digits: "Contact number must be 10 digits",
    thisContactNumberIsAlreadyRegistered: "This contact number is already registered. Please use a different number.",
    failedToUpdateProfile: "Failed to update profile",
    profileUpdatedSuccessfully: "Your profile has been successfully updated!",
    selectCategory: "Select Category",
    enterCustomCategory: "Enter custom category",
    moreImages: "More Images",
    productSpecifications: "Product Specifications",
    confirmCancelDraft: "Do you want to cancel this draft?",
    confirmDeleteProduct: "Do you want to permanently delete this product?",
    saveFailed: "Save failed:",
    listingFailed: "Listing failed. Please try again.",
    sessionExpired: "Session expired or invalid. Please log in again.",
    failedToLoadProducts: "Failed to load products:",
    noProductsToExport: "No artisans to export",
    Ornaments: "Ornaments",
    "Idol Maker": "Idol Maker",
    Metalworking: "Metalworking",
    Utensils: "Utensils",
    "Premium Products": "Premium Products",
    "Meenakari/Mina Work": "Meenakari/Mina Work",
    "Tribal Jewelry": "Tribal Jewelry",
    "Home Decor": "Home Decor",
    "Mixed Metal": "Mixed Metal",
    "Sculpture Maker": "Sculpture Maker",
    Silver: "Silver",
    Gold: "Gold",
    "Mixed Metals": "Mixed Metals",
    Hallmark: "Hallmark",
    "No certification": "No certification",
    Polished: "Polished",
    Unpolished: "Unpolished",
    Earrings: "Earrings",
    Necklaces: "Necklaces",
    Showpieces: "Showpieces",
    Idol: "Idol",
    Bracelets: "Bracelets",
    Rings: "Rings",
    Sculptures: "Sculptures",
    Others: "Others",
    selectMaterial: "Select Material",
    selectCertification: "Select Certification",
    selectFinish: "Select Finish",
    productNameRequired: "Product name is required",
    mainImageRequired: "Main image is required",
    productPriceRequired: "Product price is required",
    phoneNumberRequiredForProduct: "Please complete your profile by adding a valid 10-digit phone number.",
    artisanIdLabel: "Artisan ID",
  },
  bn: {
    dashboardTitle: "কর্মচারী / কারিগর ড্যাশ-বোর্ড",
    name: "নাম",
    specialization: "আপনার বিশেষীকরণ",
    phoneNumber: "ফোন নম্বর",
    action: "অ্যাকশন",
    edit: "সংশোধন",
    save: "সেভ",
    delete: "ডিলিট",
    cancel: "বাতিল",
    productNumber: "পণ্য নম্বর",
    productName: "পণ্য নাম",
    price: "দাম",
    material: "উপাদান",
    certification: "সার্টিফিকেশন",
    finish: "ফিনিশ",
    height: "উচ্চতা",
    width: "প্রস্থ",
    weight: "ওজন",
    category: "শ্রেণী",
    productDescription: "পণ্য বিবরণ",
    addMoreProducts: "আরও পণ্য যুক্ত করুন",
    listProducts: "পণ্য তালিকাভুক্ত করুন",
    updateListing: "তালিকা আপডেট",
    manageProducts: "পণ্য পরিচালনা করুন",
    selectSpecialization: "বিশেষীকরণ নির্বাচন করুন",
    notSpecified: "নির্দিষ্ট করা হয়নি",
    noContactProvided: "কোনো যোগাযোগ প্রদান করা হয়নি",
    saveProfile: "প্রোফাইল সেভ করুন",
    cancelProfile: "প্রোফাইল বাতিল করুন",
    uploadCloud: "আপলোড ক্লাউড",
    contactNumberMustBe10Digits: "যোগাযোগ নম্বর 10 অঙ্কের হতে হবে",
    thisContactNumberIsAlreadyRegistered: "এই যোগাযোগ নম্বরটি ইতিমধ্যে নিবন্ধিত আছে। অনুগ্রহ করে অন্য নম্বর ব্যবহার করুন।",
    failedToUpdateProfile: "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে",
    profileUpdatedSuccessfully: "আপনার পণ্য সফলভাবে আপডেট হয়েছে!",
    selectCategory: "শ্রেণী নির্বাচন করুন",
    enterCustomCategory: "কাস্টম শ্রেণী লিখুন",
    moreImages: "আরও ছবি",
    productSpecifications: "পণ্য বিবরণী",
    confirmCancelDraft: "আপনি কি এই খসড়াটি বাতিল করতে চান?",
    confirmDeleteProduct: "আপনি কি এই পণ্যটি স্থায়ীভাবে ডিলিট করতে চান?",
    saveFailed: "সেভ ব্যর্থ হয়েছে:",
    listingFailed: "তালিকা ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
    sessionExpired: "সেশন মেয়াদ উত্তীর্ণ বা অবৈধ। দয়া করে আবার লগ ইন করুন।",
    failedToLoadProducts: "পণ্য লোড করতে ব্যর্থ হয়েছে:",
    noProductsToExport: "রপ্তানির জন্য কোনো কারিগর নেই",
    Ornaments: "অলঙ্কার",
    "Idol Maker": "প্রতিমা প্রস্তুতকারক",
    Metalworking: "ধাতুশিল্প",
    Utensils: "বাসনপত্র",
    "Premium Products": "প্রিমিয়াম পণ্য",
    "Meenakari/Mina Work": "মীনাকারি/মিনা কাজ",
    "Tribal Jewelry": "আদিবাসী গহনা",
    "Home Decor": "গৃহ সজ্জা",
    "Mixed Metal": "মিশ্র ধাতু",
    "Sculpture Maker": "ভাস্কর্য প্রস্তুতকারক",
    Silver: "রূপা",
    Gold: "সোনা",
    "Mixed Metals": "মিশ্র ধাতু",
    Hallmark: "হলমার্ক",
    "No certification": "কোনো সার্টিফিকেশন নেই",
    Polished: "পালিশ করা",
    Unpolished: "অপলিশ করা",
    Earrings: "কানের দুল",
    Necklaces: "গলার হার",
    Showpieces: "শোপিস",
    Idol: "প্রতিমা",
    Bracelets: "ব্রেসলেট",
    Rings: "আংটি",
    Sculptures: "ভাস্কর্য",
    Others: "অন্যান্য",
    selectMaterial: "উপাদান নির্বাচন করুন",
    selectCertification: "সার্টিফিকেশন নির্বাচন করুন",
    selectFinish: "ফিনিশ নির্বাচন করুন",
    productNameRequired: "পণ্যের নাম প্রয়োজন",
    mainImageRequired: "মূল ছবি প্রয়োজন",
    productPriceRequired: "পণ্যের মূল্য প্রয়োজন",
    phoneNumberRequiredForProduct: "আপনার প্রোফাইলে একটি বৈধ 10-সংখ্যার ফোন নম্বর যোগ করে সম্পূর্ণ করুন।",
    artisanIdLabel: "কারিগর আইডি",
  },
};

function AdditionalImages({ productNumber, images, onImageChange, disabled, t }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-normal leading-tight text-black mb-2">
        {t("moreImages")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3].map((index) => (
          <label
            key={index}
            className={`flex flex-col items-center justify-center w-10 h-10 bg-zinc-300
              transition-all duration-200 hover:bg-zinc-400 active:bg-zinc-500
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400
              ${
                disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
              }`}
            aria-label={`Add additional image ${
              index + 1
            } for product ${productNumber}`}
          >
            <input
              type="file"
              className="hidden"
              onChange={(e) => onImageChange(index, e)}
              disabled={disabled}
            />
            {images[index]?.preview ? (
              <img
                src={images[index].preview}
                alt={`Extra ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transition-transform duration-200 hover:scale-110"
              >
                <path d="M8 0V16" stroke="#888888" strokeWidth="2" />
                <path d="M0 8H16" stroke="#888888" strokeWidth="2" />
              </svg>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function ProductSpecifications({
  productNumber,
  specs,
  onChange,
  category,
  onCategoryChange,
  customCategory,
  onCustomCategoryChange,
  isOtherCategory,
  onOtherToggle,
  disabled,
  t,
}) {
  const materialOptions = [
    { value: "Silver", label: t("Silver") },
    { value: "Gold", label: t("Gold") },
    { value: "Mixed Metals", label: t("Mixed Metals") },
    { value: "Others", label: t("Others") },
  ];

  const certificationOptions = [
    { value: "Hallmark", label: t("Hallmark") },
    { value: "No certification", label: t("No certification") },
  ];

  const finishOptions = [
    { value: "Polished", label: t("Polished") },
    { value: "Unpolished", label: t("Unpolished") },
    { value: "Others", label: t("Others") },
  ];

  const categoryOptions = [
    { value: "Earrings", label: t("Earrings") },
    { value: "Necklaces", label: t("Necklaces") },
    { value: "Showpieces", label: t("Showpieces") },
    { value: "Idol", label: t("Idol") },
    { value: "Ornaments", label: t("Ornaments") },
    { value: "Utensils", label: t("Utensils") },
    { value: "Bracelets", label: t("Bracelets") },
    { value: "Rings", label: t("Rings") },
    { value: "Sculptures", label: t("Sculptures") },
    { value: "Home Decor", label: t("Home Decor") },
    { value: "Others", label: t("Others") },
  ];

  return (
    <div className="w-full mb-4">
      <h3 className="text-sm font-semibold text-black mb-3">{t("productSpecifications")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label
            htmlFor={`material-${productNumber}`}
            className="block text-sm mb-1"
          >
            {t("material")}
          </label>
          <select
            id={`material-${productNumber}`}
            value={specs.material || ""}
            onChange={(e) => onChange("material", e.target.value)}
            className={`w-full h-10 px-3 rounded border border-black shadow-sm
              transition-shadow duration-200 focus:shadow-md focus:outline-none
              focus:ring-1 focus:ring-gray-400 ${
                disabled ? "bg-gray-100" : ""
              }`}
            disabled={disabled}
          >
            <option value="">{t("selectMaterial")}</option>
            {materialOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`certification-${productNumber}`}
            className="block text-sm mb-1"
          >
            {t("certification")}
          </label>
          <select
            id={`certification-${productNumber}`}
            value={specs.certification || ""}
            onChange={(e) => onChange("certification", e.target.value)}
            className={`w-full h-10 px-3 rounded border border-black shadow-sm
              transition-shadow duration-200 focus:shadow-md focus:outline-none
              focus:ring-1 focus:ring-gray-400 ${
                disabled ? "bg-gray-100" : ""
              }`}
            disabled={disabled}
          >
            <option value="">{t("selectCertification")}</option>
            {certificationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`finish-${productNumber}`}
            className="block text-sm mb-1"
          >
            {t("finish")}
          </label>
          <select
            id={`finish-${productNumber}`}
            value={specs.finish || ""}
            onChange={(e) => onChange("finish", e.target.value)}
            className={`w-full h-10 px-3 rounded border border-black shadow-sm
              transition-shadow duration-200 focus:shadow-md focus:outline-none
              focus:ring-1 focus:ring-gray-400 ${
                disabled ? "bg-gray-100" : ""
              }`}
            disabled={disabled}
          >
            <option value="">{t("selectFinish")}</option>
            {finishOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {["height", "width"].map((field) => (
          <div key={field}>
            <label
              htmlFor={`${field}-${productNumber}`}
              className="block text-sm mb-1"
            >
              {t(field)}
            </label>
            <input
              id={`${field}-${productNumber}`}
              type="text"
              value={specs[field] || ""}
              onChange={(e) => onChange(field, e.target.value)}
              className={`w-full h-10 px-3 rounded border border-black shadow-sm
                transition-shadow duration-200 focus:shadow-md focus:outline-none
                focus:ring-1 focus:ring-gray-400 ${
                  disabled ? "bg-gray-100" : ""
                }`}
              disabled={disabled}
            />
          </div>
        ))}

        <div>
          <label
            htmlFor={`weight-${productNumber}`}
            className="block text-sm mb-1"
          >
            {t("weight")}
          </label>
          <input
            id={`weight-${productNumber}`}
            type="text"
            value={specs.weight || ""}
            onChange={(e) => onChange("weight", e.target.value)}
            className={`w-full h-10 px-3 rounded border border-black shadow-sm
              transition-shadow duration-200 focus:shadow-md focus:outline-none
              focus:ring-1 focus:ring-gray-400 ${
                disabled ? "bg-gray-100" : ""
              }`}
            disabled={disabled}
          />
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor={`category-${productNumber}`}
            className="block text-sm mb-1"
          >
            {t("category")}
          </label>
          {!isOtherCategory ? (
            <select
              id={`category-${productNumber}`}
              value={category}
              onChange={(e) => {
                const val = e.target.value;
                onCategoryChange(val);
                if (val === "Others") {
                  onOtherToggle(true);
                }
              }}
              className={`w-full h-10 px-3 rounded border border-black shadow-sm
                transition-shadow duration-200 focus:shadow-md focus:outline-none
                focus:ring-1 focus:ring-gray-400 ${
                  disabled ? "bg-gray-100" : ""
                }`}
              disabled={disabled}
            >
              <option value="">{t("selectCategory")}</option>
              {categoryOptions.map((option) => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                );
              })}
            </select>
          ) : (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => onCustomCategoryChange(e.target.value)}
              placeholder={t("enterCustomCategory")}
              className={`w-full h-10 px-3 rounded border border-black shadow-sm
                transition-shadow duration-200 focus:shadow-md focus:outline-none
                focus:ring-1 focus:ring-gray-400 ${
                  disabled ? "bg-gray-100" : ""
                }`}
              disabled={disabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductForm({
  productNumber,
  product,
  onDelete,
  maxProducts,
  isNewSlot,
  fetchProducts,
  t,
  language,
}) {
  const [isEditing, setIsEditing] = useState(isNewSlot);
  const [category, setCategory] = useState(product?.category || "");
  const [customCategory, setCustomCategory] = useState("");
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  // New useEffect for category state management
  useEffect(() => {
    const cat = product?.category || "";
    setCategory(cat);
    setIsOtherCategory(
      ![
        "Earrings", "Necklaces", "Showpieces", "Idol", "Ornaments",
        "Utensils", "Bracelets", "Rings", "Sculptures", "Home Decor",
      ].includes(cat) && cat !== ""
    );
    setCustomCategory(
      ![
        "Earrings", "Necklaces", "Showpieces", "Idol", "Ornaments",
        "Utensils", "Bracelets", "Rings", "Sculptures", "Home Decor",
      ].includes(cat)
        ? cat
        : ""
    );
  }, [product?.category, language]);

  const [formData, setFormData] = useState({
    productName: product?.productName || "",
    productPrice: product?.productPrice || "",
    specs: {
      material: product?.material || "",
      height: product?.height || "",
      width: product?.width || "",
      weight: product?.weight || "",
      certification: product?.certification || "",
      finish: product?.finish || "",
    },
    description: product?.productDescription || "",
    mainImage: product?.image1
      ? { preview: product.image1 }
      : null,
    extraImages: [2, 3, 4, 5].map((i) =>
      product?.[`image${i}`]
        ? { preview: product[`image${i}`] }
        : null
    ),
  });

  useEffect(() => {
    if (product?.id) {
      setFormData({
        productName: product.productName,
        productPrice: product.productPrice,
        specs: {
          material: product.material,
          height: product.height,
          width: product.width,
          weight: product.weight,
          certification: product.certification || "",
          finish: product.finish || "",
        },
        description: product.productDescription,
        mainImage: product.image1
          ? {
              preview: product.image1,
            }
          : null,
        extraImages: [2, 3, 4, 5].map((i) =>
          product[`image${i}`]
            ? {
                preview: product[`image${i}`],
              }
            : null
        ),
      });
    } else {
      setFormData({
        productName: "",
        productPrice: "",
        specs: {
          material: "",
          height: "",
          width: "",
          weight: "",
          certification: "",
          finish: "",
        },
        description: "",
        mainImage: null,
        extraImages: [null, null, null, null],
      });
    }
  }, [product, isNewSlot, t]);

  const handleSpecChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [field]: value },
    }));
  };

  const handleMainImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        mainImage: { file, preview: URL.createObjectURL(file) },
      }));
    }
  };

  const handleExtraImage = (index, e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => {
        const newExtras = [...prev.extraImages];
        newExtras[index] = { file, preview: URL.createObjectURL(file) };
        return { ...prev, extraImages: newExtras };
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.productName.trim()) {
        alert(t("productNameRequired"));
        return;
      }
      if (!formData.mainImage) {
        alert(t("mainImageRequired"));
        return;
      }
      if (!formData.productPrice) {
        alert(t("productPriceRequired"));
        return;
      }
      const artisanPhoneNumber = localStorage.getItem("phoneNumber");
      if (!artisanPhoneNumber || artisanPhoneNumber.length !== 10) {
        alert(t("phoneNumberRequiredForProduct"));
        return;
      }

      const token = localStorage.getItem("token");
      const formPayload = new FormData();
      const isUpdate = !!product?.id && !isNaN(product.id);

      const method = isUpdate ? "put" : "post";
      const url = isUpdate ? `${productUrl}/${product.id}` : productUrl;

      formPayload.append("productName", formData.productName);
      formPayload.append("productPrice", formData.productPrice);
      formPayload.append("material", formData.specs.material);
      formPayload.append("height", formData.specs.height);
      formPayload.append("width", formData.specs.width);
      formPayload.append("weight", formData.specs.weight);
      formPayload.append("certification", formData.specs.certification);
      formPayload.append("finish", formData.specs.finish);
      formPayload.append("productDescription", formData.description);

      const getEnglishCategory = (cat) => {
        if (!cat) return "";
        // Check English translations first
        for (const key in translations.en) {
          if (translations.en[key] === cat) {
            return key; // Found English key from English value
          }
        }
        // If not found in English, check Bengali translations
        for (const key in translations.bn) {
          if (translations.bn[key] === cat) {
            return key; // Found English key from Bengali value
          }
        }
        return cat; // Return as is if not found in translations (e.g., custom category not in map)
      };

      const categoryToSend = isOtherCategory
        ? customCategory === t("Others") ? "Others" : getEnglishCategory(customCategory)
        : category === t("Others") ? "Others" : getEnglishCategory(category);
      
      formPayload.append("category", categoryToSend);

      if (formData.mainImage?.file) {
        formPayload.append("image1", formData.mainImage.file);
      } else if (product?.image1) {
        formPayload.append("image1", product.image1);
      }
      if (isUpdate && !isNaN(product.id)) {
        formPayload.append("id", product.id);
      }

      formData.extraImages.forEach((img, index) => {
        const fieldName = `image${index + 2}`;
        if (img?.file) {
          formPayload.append(fieldName, img.file);
        } else if (product?.[fieldName]) {
          formPayload.append(
            fieldName,
            product[fieldName]
          );
        }
      });

      const response = await axios[method](url, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditing(false);
      if (typeof fetchProducts === "function") {
        fetchProducts();
      }
      alert(
        response.data.message ||
          t("profileUpdatedSuccessfully")
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      alert(`${t("saveFailed")}: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    const confirmMsg = isNewSlot
      ? t("confirmCancelDraft")
      : t("confirmDeleteProduct");
    if (window.confirm(confirmMsg)) {
      try {
        if (!isNewSlot) {
          const token = localStorage.getItem("token");
          await axios.delete(`${productUrl}/${product.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        onDelete(isNewSlot ? product.id : String(product.id));
      } catch (error) {
        alert(
          `${t("deleteFailed")}: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };

  const saveDisabled = isNewSlot && maxProducts >= 3;

  return (
    <section className="w-full mb-8 relative bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-normal text-black">
          {t("productNumber")}: {productNumber}
        </h2>
        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded hover:bg-gray-800"
              disabled={saveDisabled}
            >
              {t("edit")}
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              {t("save")}
            </button>
          )}
          {(product?.id || isEditing) && (
            <button
              onClick={product?.id ? handleDelete : () => setIsEditing(false)}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
            >
              {product?.id ? t("delete") : t("cancel")}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <label
            htmlFor={`main-image-${productNumber}`}
            className={`block w-full ${isEditing ? "cursor-pointer" : ""}`}
          >
            <input
              type="file"
              id={`main-image-${productNumber}`}
              className="hidden"
              onChange={handleMainImage}
              disabled={!isEditing}
            />
            {formData.mainImage?.preview || product?.image1 ? (
              <img
                src={
                  formData.mainImage?.preview ||
                  product.image1
                }
                alt="Main preview"
                className="w-full aspect-square object-cover rounded bg-gray-100"
              />
            ) : (
              <div className="aspect-square bg-zinc-300 rounded flex items-center justify-center">
                <UploadCloud size={24} className="text-gray-500" />
              </div>
            )}
          </label>
          <AdditionalImages
            productNumber={productNumber}
            images={formData.extraImages}
            onImageChange={handleExtraImage}
            disabled={!isEditing}
            t={t}
          />
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-grow">
              <input
                value={formData.productName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    productName: e.target.value,
                  }))
                }
                placeholder={t("productName")}
                className={`w-full h-10 px-3 rounded border border-black shadow-sm ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
                disabled={!isEditing}
              />
            </div>
            <div className="relative">
              <div className="flex items-center">
                <span className="absolute left-3">₹</span>
                <input
                  value={formData.productPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productPrice: e.target.value,
                    }))
                  }
                  placeholder={t("price")}
                  className={`w-full h-10 pl-6 pr-3 rounded border border-black shadow-sm ${
                    !isEditing ? "bg-gray-100" : ""
                  }`}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <hr className="border-t border-black" />
          <ProductSpecifications
            productNumber={productNumber}
            specs={formData.specs}
            onChange={handleSpecChange}
            category={category}
            onCategoryChange={setCategory}
            customCategory={customCategory}
            onCustomCategoryChange={setCustomCategory}
            isOtherCategory={isOtherCategory}
            onOtherToggle={setIsOtherCategory}
            disabled={!isEditing}
            t={t}
          />

          <hr className="border-t border-black" />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder={t("productDescription")}
            rows={3}
            className={`w-full p-2 rounded border border-black shadow-sm ${(
              !isEditing ? "bg-gray-100" : ""
            )}`}
            disabled={!isEditing}
          />
        </div>
      </div>
    </section>
  );
}

function EmployeeTable({ t, language, artisanProfile, onProfileUpdate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profile, setProfile] = useState(() => {
    // Initialize from prop or localStorage if prop is null
    if (artisanProfile) {
      let initialSpecializations = [];
      if (artisanProfile.specialization) {
        initialSpecializations = artisanProfile.specialization
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "" && s !== "Not Specified");
      }
      return {
        name: artisanProfile.name || "",
        specialization: initialSpecializations,
        contact: artisanProfile.contact || "",
        artisanId: artisanProfile.artisanId || "",
        profileImage: artisanProfile.profileImage || null,
        isEditing: false,
      };
    } else {
      // Fallback to localStorage if prop not yet available (e.g., initial render)
    const storedSpecialization = localStorage.getItem("specialization");
    let initialSpecializations = [];
    if (storedSpecialization) {
      initialSpecializations = storedSpecialization
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "" && s !== "Not Specified");
    }
    return {
      name: localStorage.getItem("username") || "",
      specialization: initialSpecializations,
      contact: localStorage.getItem("phoneNumber") || "",
      artisanId: localStorage.getItem("ArtisanId") || "",
      profileImage: localStorage.getItem("profileImage") || null,
      isEditing: false,
    };
    }
  });

  // useEffect to sync local profile state with artisanProfile prop
  useEffect(() => {
    if (artisanProfile) {
      let processedSpecializations = [];
      if (artisanProfile.specialization) {
        processedSpecializations = artisanProfile.specialization
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "" && s !== "Not Specified");
      }
      setProfile({
        name: artisanProfile.name || "",
        specialization: processedSpecializations,
        contact: artisanProfile.contact || "",
        artisanId: artisanProfile.artisanId || "",
        profileImage: artisanProfile.profileImage || null,
        isEditing: false,
      });
    }
  }, [artisanProfile]);

  const specializationOptions = [
    { value: "Ornaments", label: t("Ornaments") },
    { value: "Idol Maker", label: t("Idol Maker") },
    { value: "Metalworking", label: t("Metalworking") },
    { value: "Utensils", label: t("Utensils") },
    { value: "Premium Products", label: t("Premium Products") },
    { value: "Meenakari/Mina Work", label: t("Meenakari/Mina Work") },
    { value: "Tribal Jewelry", label: t("Tribal Jewelry") },
    { value: "Home Decor", label: t("Home Decor") },
    { value: "Mixed Metal", label: t("Mixed Metal") },
    { value: "Sculpture Maker", label: t("Sculpture Maker") },
    { value: "Others", label: t("Others") },
  ];

  const handleEditToggle = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProfile((prev) => ({ ...prev, isEditing: !prev.isEditing }));
  };

  const handleSpecializationAdd = (value) => {
    setProfile((prev) => {
      const currentSpecializations = prev.specialization || [];
      if (
        currentSpecializations.length < 3 &&
        !currentSpecializations.includes(value)
      ) {
        return {
          ...prev,
          specialization: [...currentSpecializations, value],
        };
      }
      return prev;
    });
  };

  const handleSpecializationRemove = (valueToRemove) => {
    setProfile((prev) => ({
      ...prev,
      specialization: prev.specialization.filter(
        (spec) => spec !== valueToRemove
      ),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (profile.contact.length !== 10) {
        alert(t("contactNumberMustBe10Digits"));
        return;
      }

      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Add existing data to formData
      formData.append(
        "specialization",
        profile.specialization.join(", ") || ""
      );
      formData.append("PhoneNumber", profile.contact);

      // Add profile image if selected
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await axios.put(`${backendUrl}/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile((prev) => {
        const newSpecialization = response.data.profile.specialization;
        let processedSpecializations = [];
        if (newSpecialization) {
          processedSpecializations = newSpecialization
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "" && s !== "Not Specified");
        }

        return {
          ...prev,
          isEditing: false,
          specialization: processedSpecializations,
          profileImage: response.data.profile.profileImage || null,
        };
      });

      // Update local storage
      localStorage.setItem(
        "specialization",
        response.data.profile.specialization || ""
      );
      localStorage.setItem("phoneNumber", response.data.profile.contact || ""); // Ensure phone number is also updated
      // Store profile image in localStorage if available
      if (response.data.profile.profileImage) {
        localStorage.setItem(
          "profileImage",
          response.data.profile.profileImage
        );
      } else {
        localStorage.removeItem("profileImage");
      }

      alert(t("profileUpdatedSuccessfully"));
      if (onProfileUpdate) {
        onProfileUpdate(); // Callback to parent to re-fetch/update profile data
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage?.includes("already exists")) {
        alert(t("thisContactNumberIsAlreadyRegistered"));
      } else {
        alert(errorMessage || t("failedToUpdateProfile"));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <section className="w-full mb-6 bg-white border border-solid border-neutral-200 rounded-lg">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 py-3 px-4 md:px-6 text-sm font-medium text-neutral-700 bg-neutral-50 border-b border-neutral-200 rounded-t-lg">
        <div className="col-span-2">{t("name")}</div>
        <div className="col-span-4">{t("specialization")}</div>
        <div className="col-span-3">{t("artisanIdLabel")}</div>
        <div className="col-span-2">{t("phoneNumber")}</div>
        <div className="col-span-1 text-center">{t("action")}</div>
      </div>

      {/* Profile Row */}
      <div className="grid grid-cols-12 gap-2 py-3 px-4 md:px-6 text-sm items-center">
        <div className="col-span-2 flex items-center gap-3">
          <div className="relative">
            {profile.isEditing ? (
              <label className="cursor-pointer">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-zinc-300 rounded-full flex items-center justify-center">
                    {profile.name?.[0]?.toUpperCase() || "A"}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {previewUrl && (
                  <div
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </label>
            ) : profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-zinc-300 rounded-full flex items-center justify-center">
                {profile.name?.[0]?.toUpperCase() || "A"}
              </div>
            )}
          </div>

          {/* Name field */}
          {profile.isEditing ? (
            <input
              value={profile.name}
              disabled
              className="border rounded px-2 py-1 w-32 bg-gray-100"
            />
          ) : (
            <div className="font-normal text-neutral-800">
              {profile.name || t("artisanProfile")}
            </div>
          )}
        </div>

        <div className="col-span-4 flex items-center font-normal text-neutral-600">
          {profile.isEditing ? (
            <div className="flex flex-col w-full">
              <select
                value={profile.specialization.length < 3 ? "" : ""} // Controlled by adding to the array, not direct select value
                onChange={(e) => handleSpecializationAdd(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                disabled={profile.specialization.length >= 3}
              >
                <option value="" disabled>
                  {t("selectSpecialization")}
                </option>
                {specializationOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={profile.specialization.includes(option.value)}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 items-center">
                {profile.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-green-800 bg-green-100 text-sm font-medium"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleSpecializationRemove(spec)}
                      className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.specialization.length > 0
                ? profile.specialization.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 rounded-full text-green-800 bg-green-100 text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))
                : t("notSpecified")}
            </div>
          )}
        </div>

        <div className="col-span-3 flex items-center gap-2">
          <span className="text-neutral-600 font-bold">ID:</span>
          <span className="text-neutral-600">{profile.artisanId || "N/A"}</span>
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <PhoneCall size={16} stroke="black" fill="none" />
          {profile.isEditing ? (
            <input
              value={profile.contact}
              maxLength={10}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ""); // Only numbers
                setProfile((p) => ({ ...p, contact: val.slice(0, 10) }));
              }}
              className="border rounded px-2 py-1 w-full"
              placeholder={t("phoneNumber")}
            />
          ) : (
            <span className="text-neutral-600">
              {profile.contact || t("noContactProvided")}
            </span>
          )}
        </div>

        <div className="col-span-1 flex justify-center items-center gap-2">
          {profile.isEditing ? (
            <>
              <button
                onClick={handleSaveProfile}
                className="p-1 text-green-600 hover:text-green-800"
                title={t("saveProfile")}
              >
                <span style={{ fontSize: "20px" }}>✅</span>
              </button>
              <button
                onClick={handleEditToggle}
                className="p-1 text-gray-600 hover:text-gray-800"
                title={t("cancelProfile")}
              >
                ❌
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="p-1 text-blue-600 hover:text-blue-800"
              title={t("edit")}
            >
              {t("edit")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function EmployeeDashboard() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState([{ id: "initial-draft" }]);
  const [language, setLanguage] = useState("bn"); // Default to Bengali
  const [artisanProfile, setArtisanProfile] = useState(null); // New state for artisan profile

  const t = (key) => translations[language][key] || key; // Translation function

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = decoded.exp * 1000;
      if (Date.now() > expirationTime) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    fetchProducts();
    fetchArtisanProfile(); // Fetch artisan profile on mount/token change
  }, [localStorage.getItem("token")]); // Depend on token to re-fetch on user change

  const fetchArtisanProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedProfile = response.data.profile;
      // Update localStorage with fetched profile details
      localStorage.setItem("username", fetchedProfile.name);
      localStorage.setItem("phoneNumber", fetchedProfile.contact);
      localStorage.setItem("specialization", fetchedProfile.specialization || "");
      if (fetchedProfile.profileImage) {
        localStorage.setItem("profileImage", fetchedProfile.profileImage);
      } else {
        localStorage.removeItem("profileImage");
      }
      setArtisanProfile(fetchedProfile); // Set the new artisan profile state
    } catch (error) {
      console.error("Profile fetch error:", error);
      // Handle error, e.g., redirect to login if token is invalid
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        alert(t("sessionExpired"));
        window.location.href = "/login";
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const res = await axios.get(`${productUrl}/${decoded.artisanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setDrafts((prev) =>
        res.data.length === 0 ? [{ id: "initial-draft" }] : []
      );
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401 || error.message === "Network Error") {
        localStorage.removeItem("token");
        alert(t("sessionExpired"));
        window.location.href = "/login";
      } else {
        alert(
          `${t("failedToLoadProducts")} ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const handleAddSlot = () => {
    if (products.length + drafts.length < 3) {
      setDrafts((prev) => [...prev, { id: `draft-${Date.now()}` }]);
    }
  };

  const handleDelete = (deletedId) => {
    const idString = String(deletedId);

    if (idString.startsWith("draft-")) {
      setDrafts((prev) => prev.filter((d) => d.id !== idString));
    } else {
      setProducts((prev) => prev.filter((p) => String(p.id) !== idString));
    }
    fetchProducts();
  };

  const handleListAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendUrl}/products/list-products`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message || t("listingFailed")
      );
    }
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mt-4 mb-6">
            <h1 className="text-2xl md:text-3xl text-black font-normal">
              {t("dashboardTitle")}
          </h1>
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>
          </div>

          {artisanProfile && (
            <EmployeeTable
              key={artisanProfile.artisanId || "no-artisan"}
              t={t}
              language={language}
              artisanProfile={artisanProfile}
              onProfileUpdate={fetchArtisanProfile}
            />
          )}

          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleListAll}
              disabled={products.length === 0}
              className={`flex items-center gap-2 
                ${
                  products.length > 0
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white px-5 py-2 rounded-md`}
            >
              <UploadCloud size={16} />
              {products[0]?.is_listed
                ? t("updateListing")
                : `${t("listProducts")} ${products.length} Product${
                    products.length > 1 ? "s" : ""
                  }`
              }
            </button>
          </div>

          <div className="mt-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-black">
                {t("manageProducts")}
              </h2>
              {products.length + drafts.length < 3 && (
                <button
                  onClick={handleAddSlot}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Plus size={16} /> {t("addMoreProducts")}
                </button>
              )}
            </div>

            <div className="space-y-8">
              {products.map((product, index) => (
                <ProductForm
                  key={product.id}
                  productNumber={index + 1}
                  product={product}
                  onDelete={() => handleDelete(product.id)}
                  fetchProducts={fetchProducts}
                  t={t}
                  language={language}
                />
              ))}

              {drafts.map((draft, index) => (
                <ProductForm
                  key={draft.id}
                  productNumber={products.length + index + 1}
                  product={{ ...draft, id: draft.id }}
                  onDelete={handleDelete}
                  isNewSlot={true}
                  fetchProducts={fetchProducts}
                  t={t}
                  language={language}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  );
}