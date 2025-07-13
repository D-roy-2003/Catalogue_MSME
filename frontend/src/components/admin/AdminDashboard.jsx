//ADMIN DASHBOARD:
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from 'bcryptjs';
import { ProductGridForAdmin } from "./ProductGridForAdmin";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showProductsFor, setShowProductsFor] = useState(null);
  const [adminData, setAdminData] = useState({
    name: "",
    phoneNumber: "",
    emailId: "",
    adminId: "",
    adminPassword: "",
    adminPassKey: "",
    address: "",
    profileImage: null,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All Specializations");
  const [currentPage, setCurrentPage] = useState(1);
  const [artisans, setArtisans] = useState([]);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('main');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const artisansPerPage = 4;
  // Add the missing state variables that are referenced in the code
  const [editingArtisan, setEditingArtisan] = useState(null);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editSpecialization, setEditSpecialization] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [contactError, setContactError] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [passwordResetRequests, setPasswordResetRequests] = useState([]);
  const [hasUnresolvedNotifications, setHasUnresolvedNotifications] = useState(false);

  const specializations = [
    "All Specializations",
    "Ornaments",
    "Idol Maker",
    "Metalworking",
    "Utensils",
    "Premium Products",
  ];

  useEffect(() => {
    fetchAdminData();
    fetchArtisans();
    fetchPasswordResetRequests(); // Add this line to fetch notifications on component mount
  }, []);
  
  // In fetchAdminData, ensure backend returns all fields
const fetchAdminData = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/admin/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.data.success) {
      setAdminData({
        ...response.data,
        phoneNumber: response.data.phoneNumber,
        emailId: response.data.emailId,
        profileImage: response.data.profileImage 
          ? response.data.profileImage 
          : null
      });
    }
  } catch (error) {
    console.error("Error fetching admin data:", error);
    alert(error.response?.data?.message || "Failed to load admin profile");
  }
};

  
  const fetchArtisans = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/artisans`);
      
      if (response.data.success) {
        setArtisans(response.data.data);
      } else {
        setError("Failed to fetch artisans");
      }
    } catch (err) {
      console.error("Error fetching artisans:", err);
      setError(err.response?.data?.message || "Failed to fetch artisans");
    } finally {
      setLoading(false);
    }
  };
  
// In AdminDashboard's fetchArtisanProducts function
const fetchArtisanProducts = async (artisanId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/public/artisans/${artisanId}/products`);
    const products = response.data || [];
    console.log('Fetched products from backend:', products); // DEBUG
    // Map fields to what ProductGridForAdmin expects
    const mappedProducts = products.map(p => ({
      ...p,
      image1: p.image1 
        ? p.image1 
        : (p.image ? `${backendUrl}${p.image}` : "/placeholder-image.jpg"),
      productName: p.productName || p.name || "Untitled Product",
      productDescription: p.productDescription || p.description || "No description available",
      productPrice: p.productPrice ,
        // ? Number(p.productPrice) 
        // : (p.price !== undefined ? Number(p.price) : 0),
      id: p.id || p.productId // ensure there's an id for key and delete
    }));
    setArtisanProducts(mappedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    setArtisanProducts([]);
  }
};
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === "phoneNumber") {
      // Only allow digits and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setAdminData((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }));
      return;
    }

    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdminData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };
  
  const handleSaveProfile = async () => {
  try {
    const formData = new FormData();
    formData.append("name", adminData.name);
    formData.append("phoneNumber", adminData.phoneNumber);
    formData.append("emailId", adminData.emailId);
    formData.append("address", adminData.address);
    
    if (adminData.profileImage instanceof File) {
      formData.append("profileImage", adminData.profileImage);
    }

    const response = await axios.put(
      `${backendUrl}/api/admin/profile`,
      formData,
      {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.success) {
      setAdminData(prev => ({
        ...prev,
        ...response.data,
        profileImage: response.data.profileImage 
          ? response.data.profileImage 
          : prev.profileImage
      }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    }
  } catch (error) {
    console.error("Update error:", error);
    alert(error.response?.data?.message || "Profile update failed");
  }
};

// Update the delete handler
const handleDeleteArtisan = async (artisanId) => {
  if (window.confirm("Are you sure you want to delete this artisan?")) {
    try {
      await axios.delete(`${backendUrl}/api/users/artisans/${artisanId}`);
      fetchArtisans();
      alert("Artisan deleted successfully!");
    } catch (error) {
      console.error("Error deleting artisan:", error);
      alert("Failed to delete artisan.");
    }
  }
};
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/admin/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (response.data.success) {
          fetchArtisanProducts(showProductsFor); // Refresh list
          alert("Product deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(error.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  // Add these new handler functions
const handleUpdatePassword = async () => {
  try {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const response = await axios.put(
      `${backendUrl}/api/admin/update-password`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.success) {
      alert("Password updated successfully!");
      setNewPassword('');
      setConfirmPassword('');
    }
  } catch (error) {
    alert(error.response?.data?.message || "Password update failed");
  }
};

const handleUpdatePasskey = async () => {
  try {
    if (newPasskey !== confirmPasskey) {
      alert("Passkeys don't match!");
      return;
    }

    const response = await axios.put(
      `${backendUrl}/api/admin/update-passkey`,
      { newPasskey },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.success) {
      alert("Passkey updated successfully!");
      setNewPasskey('');
      setConfirmPasskey('');
      fetchAdminData(); // Refresh admin data
    }
  } catch (error) {
    alert(error.response?.data?.message || "Passkey update failed");
  }
};
  
  const showArtisanProducts = (artisanId) => {
    setShowProductsFor(artisanId);
    fetchArtisanProducts(artisanId);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload(); // Ensure complete cleanup
  };

  
  // const handleEditArtisan = (artisanId) => {
  //   navigate(`/profile/${artisanId}`);
  // };
  // Update the handleEditArtisan function
  const handleEditArtisan = (artisan) => {
    setEditingArtisan(artisan);
    setEditName(artisan.name);
    setEditContact(artisan.contact);
    setEditSpecialization(artisan.specialization);
    setEditPassword(artisan.password);
  };

  // Add this update handler
const handleUpdateArtisan = async () => {
  try {
    // Validate contact number
    if (!validateContact(editContact)) {
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(editPassword)) {
      alert("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit");
      return;
    }

    // Hash the password before sending
    const hashedPassword = await bcrypt.hash(editPassword, 10);

    const response = await axios.put(
      `${backendUrl}/api/users/artisans/${editingArtisan.artisanId}`,
      {
        name: editName,
        contact: editContact,
        specialization: editSpecialization,
        password: hashedPassword
      }
    );

    if (response.data.success) {
      fetchArtisans();
      setEditingArtisan(null);
      alert("Artisan updated successfully!");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Failed to update artisan");
  }
};
  
  const exportToExcel = () => {
    if (filteredArtisans.length === 0) {
      alert("No artisans to export");
      return;
    }

    const dataToExport = filteredArtisans.map((artisan) => ({
      ID: artisan.id,
      Name: artisan.name,
      ArtisanID: artisan.artisanId,
      Specialization: artisan.specialization,
      Contact: artisan.contact,
      Password: artisan.password
    }));

    const headers = Object.keys(dataToExport[0]).join(",");
    const rows = dataToExport.map((row) => Object.values(row).join(","));
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `artisans_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Filter artisans based on search term and specialization
  const filteredArtisans = artisans.filter((artisan) => {
    const matchesSearch =
      artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artisan.specialization && artisan.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      artisan.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.artisanId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      specializationFilter === "All Specializations" ||
      (artisan.specialization && artisan.specialization === specializationFilter);

    return matchesSearch && matchesSpecialization;
  });
  
  // Pagination logic for artisans
  const indexOfLastArtisan = currentPage * artisansPerPage;
  const indexOfFirstArtisan = indexOfLastArtisan - artisansPerPage;
  const currentArtisans = filteredArtisans.slice(indexOfFirstArtisan, indexOfLastArtisan);
  const totalPages = Math.ceil(filteredArtisans.length / artisansPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const fetchPasswordResetRequests = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/password-reset-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setPasswordResetRequests(response.data.data);
        // Check if there are any unresolved notifications
        setHasUnresolvedNotifications(response.data.data.length > 0);
      }
    } catch (error) {
      console.error("Error fetching password reset requests:", error);
      alert(error.response?.data?.message || "Failed to fetch password reset requests");
    }
  };

  const handleMarkAsResolved = async (artisanId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/admin/resolve-password-reset/${artisanId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data.success) {
        alert("Password reset request marked as resolved!");
        // Update the notifications list
        setPasswordResetRequests(prev => prev.filter(req => req.artisanId !== artisanId));
        // Update the unresolved notifications state
        setHasUnresolvedNotifications(prev => prev && passwordResetRequests.length > 1);
      }
    } catch (error) {
      console.error("Error marking as resolved:", error);
      alert(error.response?.data?.message || "Failed to mark as resolved");
    }
  };
  
  const validateContact = (contact) => {
    if (contact.length !== 10) {
      setContactError("Contact number must be exactly 10 digits");
      return false;
    }
    setContactError("");
    return true;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }
  
  // Find the selected artisan
  const selectedArtisan = artisans.find((artisan) => artisan.artisanId === showProductsFor);
  // Add this right after the selectedArtisan declaration
  const selectedArtisanIndex = artisans.findIndex(
    a => a.artisanId === showProductsFor
  );
return (
  <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
    {/* Sidebar */}
    <div className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4">
        <button 
          className="w-full bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
          onClick={() => navigate("/")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Home
        </button>
      </div>
      <div className="flex-1">
        <div 
          className="py-3 px-4 border-b border-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-800"
          onClick={() => setActiveView('main')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          <span>Dashboard</span>
        </div>
        <div 
          className="py-3 px-4 border-b border-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-800"
          onClick={() => {
            setActiveView('notifications');
            fetchPasswordResetRequests();
          }}
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            {hasUnresolvedNotifications && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </div>
          <span>Notifications</span>
        </div>
        <div 
          className="py-3 px-4 border-b border-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-800"
          onClick={() => setActiveView('settings')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>Reset Password</span>
        </div>
      </div>
      <div className="p-4 border-t border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
          {adminData.profileImage ? (
            <img 
              src={adminData.profileImage} 
              alt="Admin" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{adminData.name ? adminData.name.charAt(0) : "A"}</span>
          )}
        </div>
        <div className="truncate">{adminData.name || "Admin"}</div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">
            <span className="hover:underline cursor-pointer" onClick={() => navigate("/")}>Home</span> &gt; Admin Dashboard
          </div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <button 
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {activeView === 'settings' ? (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
            {/* Password Reset Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reset Password</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdatePassword}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Password
              </button>
            </div>

            {/* Passkey Reset Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reset Admin Pass Key</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Pass Key</label>
                  <input
                    type="text"
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Pass Key</label>
                  <input
                    type="text"
                    value={confirmPasskey}
                    onChange={(e) => setConfirmPasskey(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdatePasskey}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Pass Key
              </button>
            </div>
          </div>
        ) : activeView === 'notifications' ? (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Password Reset Requests</h2>
            {passwordResetRequests.length > 0 ? (
              <div className="space-y-3">
                {passwordResetRequests.map((request) => (
                  <div key={request.artisanId} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold">
                        {request.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{request.name}</div>
                        <div className="text-sm text-gray-600">Requested Password Reset</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleMarkAsResolved(request.artisanId)}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Mark as Resolved"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No new password reset requests.
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Admin Profile Section - Fixed image upload and mobile layout */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Admin Profile</h2>
                  <div className="mt-2 md:mt-0">
                    {!isEditing ? (
                      <button 
                        className="bg-gray-900 hover:bg-gray-800 text-white py-1 px-4 rounded transition-colors"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded transition-colors"
                          onClick={handleSaveProfile}
                        >
                          Save
                        </button>
                        <button 
                          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded transition-colors"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 relative">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {adminData.profileImage ? (
                        <img 
                          src={adminData.profileImage} 
                          alt="Admin" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {isEditing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full text-white text-center p-2">
                          <input 
                            type="file" 
                            onChange={handleProfileImageChange} 
                            className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs">Click to upload</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Non-editable admin credentials */}
                      <div className="md:col-span-2 lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
                            <input
                              type="text"
                              value={adminData.adminId || ""}
                              readOnly
                              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                            <input
                              type="password"
                              value={adminData.adminPassword || ""}
                              readOnly
                              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Admin Pass Key
                            </label>
                            <input
                              type="text"
                              value={adminData.adminPassKey || ""}
                              readOnly
                              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Editable fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={adminData.name || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={adminData.phoneNumber || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          maxLength={10}
                          pattern="[0-9]{10}"
                          placeholder="Enter 10 digit number"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                        {adminData.phoneNumber && adminData.phoneNumber.length !== 10 && (
                          <p className="text-red-500 text-xs mt-1">Phone number must be 10 digits</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                        <input
                          type="email"
                          name="emailId"
                          value={adminData.emailId || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          name="address"
                          value={adminData.address || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows="3"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artisan Database Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold">Artisan Database</h2>
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    disabled={filteredArtisans.length === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export
                  </button>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by name, specialization, contact or artisan ID..."
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    value={specializationFilter}
                    onChange={(e) => {
                      setSpecializationFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Artisan ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specialization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Password
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentArtisans.length > 0 ? (
                        currentArtisans.map((artisan) => (
                          <tr key={artisan.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {artisan.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {artisan.artisanId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {artisan.specialization || "Not specified"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {artisan.contact}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {artisan.password || "********"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                              <button 
                                onClick={() => handleEditArtisan(artisan)}
                                className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                title="Edit Artisan"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteArtisan(artisan.artisanId)}
                                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                title="Delete Artisan"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => showArtisanProducts(artisan.artisanId)}
                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                              >
                                Products
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No artisans found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredArtisans.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 rounded-b-lg">
                    <div className="text-sm text-gray-500">
                      Showing {indexOfFirstArtisan + 1} to{" "}
                      {Math.min(indexOfLastArtisan, filteredArtisans.length)} of{" "}
                      {filteredArtisans.length} artisans
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageNum
                                ? "bg-gray-900 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${
                          currentPage === totalPages
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Artisan Products Modal */}
              {showProductsFor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          Products from {selectedArtisan?.name || "Artisan"}
                        </h3>
                        <button
                          onClick={() => setShowProductsFor(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {artisanProducts.length > 0 ? (
                        <ProductGridForAdmin 
                          products={artisanProducts}
                          onDeleteProduct={handleDeleteProduct}
                          color={`hsl(${selectedArtisanIndex * 60}, 70%, 30%)`}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-500 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <p className="text-gray-500">No products found for this artisan</p>
                          <div className="mt-4 text-sm text-gray-400">
                            Artisan ID: {showProductsFor} | 
                            API Status: {artisanProducts.length === 0 ? "No products found" : "Data Received"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Edit Artisan Modal */}
            {editingArtisan && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Edit Artisan</h3>
                      <button
                        onClick={() => setEditingArtisan(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact</label>
                      <input
                        type="text"
                        value={editContact}
                        onChange={(e) => {
                          // Only allow numbers and limit to 10 digits
                          const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setEditContact(numericValue);
                          if (contactError) setContactError("");
                        }}
                        onBlur={() => validateContact(editContact)}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter 10-digit contact number"
                      />
                      {contactError && <p className="mt-1 text-sm text-red-600">{contactError}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialization</label>
                      <input
                        type="text"
                        value={editSpecialization}
                        onChange={(e) => setEditSpecialization(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter specialization"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        Password must contain:
                        <ul className="list-disc pl-5">
                          <li className={editPassword?.length >= 6 ? "text-green-500" : ""}>
                            At least 6 characters
                          </li>
                          <li className={editPassword && /[A-Z]/.test(editPassword) ? "text-green-500" : ""}>
                            At least one uppercase letter
                          </li>
                          <li className={editPassword && /[a-z]/.test(editPassword) ? "text-green-500" : ""}>
                            At least one lowercase letter
                          </li>
                          <li className={editPassword && /\d/.test(editPassword) ? "text-green-500" : ""}>
                            At least one digit
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button 
                        onClick={handleUpdateArtisan}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => setEditingArtisan(null)}
                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
  );
};

export default AdminDashboard;
