import { useState, useEffect } from "react";
import AddressForm from "../../address/components/AddressForm";
import { userService } from "../services/userService";

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ID_ASC"); // Default sort

  // SINGLE SOURCE OF TRUTH: All users live inside this Page object
  const [usersPage, setUsersPage] = useState({ content: [], totalPages: 0, totalElements: 0 });

  // HELPER FUNCTIONS:

  const handleDeleteAddress = async (addressId) => {
    try {
      const updatedUser = await userService.deleteAddress(selectedUser.id, addressId);
      setSelectedUser(updatedUser);

      // FIX: Update the specific user inside the usersPage content array
      setUsersPage((prev) => ({
        ...prev,
        content: prev.content.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      }));
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0] || "Could not delete address";
      alert(errorMsg);
    }
  };

  const handleAddAddress = async (formData) => {
    setIsSaving(true);
    try {
      const updatedUser = await userService.addAddress(selectedUser.id, formData);
      setSelectedUser(updatedUser);

      // FIX: Update the specific user inside the usersPage content array
      setUsersPage((prev) => ({
        ...prev,
        content: prev.content.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      }));

      setIsAdding(false);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0] || "Failed to add address";
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromoteAddress = async (addressId) => {
    try {
      const updatedUser = await userService.promoteAddress(selectedUser.id, addressId);
      setSelectedUser(updatedUser);

      // FIX: Update the specific user inside the usersPage content array
      setUsersPage((prev) => ({
        ...prev,
        content: prev.content.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      }));
    } catch (err) {
      const msg = err.response?.data?.message || "Promotion failed";
      alert(msg);
    }
  };

  // THE REUSABLE FETCHER:
  const fetchUsers = async (query = "", sort = "ID_ASC") => {
    try {
      // API call to Spring Boot with search, sort, and pagination params
      const data = await userService.getAllUsers({
        search: query,
        sortBy: sort,
        page: 0,
        size: 10,
      });

      setUsersPage(data);

      // Auto-select the first user in the result set if none is selected
      if (data.content?.length > 0 && !selectedUser) {
        setSelectedUser(data.content[0]);
      }
    } catch (err) {
      console.error("[UsersPage] Error fetching user data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // THE DEBOUNCE EFFECT:
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery, sortBy);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, sortBy]);

  // RENDER (Logic part only)
  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* --- 1. ADMIN COMMAND BAR (STAYS AT THE TOP) --- */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* SEARCH & FILTERS */}
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-blue-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest outline-none focus:border-blue-500 cursor-pointer">
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
            </select>
            <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-800 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Sort: Newest
              </span>
              <svg
                className="w-3 h-3 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* GLOBAL ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Export CSV"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg active:scale-95 transition-all">
              <span>+ Create User</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. SPLIT LAYOUT (Navigator + Workspace) --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: HIGH-DENSITY USER LIST */}
        <div className="w-80 flex-shrink-0 border-r border-slate-800 overflow-y-auto bg-slate-900/20">
          <div className="p-2 space-y-1">
            {/* Map over 'usersPage.content' specifically */}
            {usersPage.content.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  selectedUser?.id === u.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <div className="flex flex-col items-start truncate">
                  <span className="text-xs font-bold truncate">
                    {u.firstName} {u.lastName}
                  </span>
                  <span
                    className={`text-[10px] truncate ${selectedUser?.id === u.id ? "text-blue-100" : "text-slate-500"}`}
                  >
                    {u.email}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    selectedUser?.id === u.id
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  ID:{u.id}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: WORKSPACE (Details & Addresses) */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-950 scroll-smooth">
          {selectedUser ? (
            <div className="max-w-[1400px] w-full space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              {/* 1. USER HEADER (Name, Email, ID) */}
              <header className="flex items-center justify-between border-b border-slate-800 pb-8">
                <div>
                  <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h1>
                  <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                    Account Member • {selectedUser.email}
                  </p>
                </div>
                <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 shadow-inner">
                  UUID: {selectedUser.id}
                </div>
              </header>

              {/* 2. NEW: THE METRICS ROW (The "Data Move") */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Addresses Metric */}
                <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-[2rem] backdrop-blur-sm">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Total Addresses
                  </p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">
                    {selectedUser.addresses.length}
                  </p>
                </div>

                {/* Primary Status Metric */}
                <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-[2rem] backdrop-blur-sm">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Default Set
                  </p>
                  <p
                    className={`text-3xl font-black italic tracking-tighter ${
                      selectedUser.addresses.some((a) => a.addressType === "PRIMARY")
                        ? "text-emerald-400"
                        : "text-amber-500"
                    }`}
                  >
                    {selectedUser.addresses.some((a) => a.addressType === "PRIMARY") ? "YES" : "NO"}
                  </p>
                </div>

                {/* Placeholder for Future Growth (e.g. Orders, Lifetime Spend) */}
                <div className="bg-slate-900/20 border border-slate-800/30 p-5 rounded-[2rem] border-dashed flex items-center justify-center">
                  <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                    Orders Module Locked
                  </p>
                </div>
                <div className="bg-slate-900/20 border border-slate-800/30 p-5 rounded-[2rem] border-dashed flex items-center justify-center">
                  <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                    Loyalty Data Locked
                  </p>
                </div>
              </div>

              {/* 2. ADDRESS SECTION */}
              <section className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Registered Addresses
                  </h3>
                  <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg active:scale-95 group"
                  >
                    <span className="text-xl font-bold leading-none mb-0.5 transition-transform group-hover:rotate-90">
                      {isAdding ? "−" : "+"}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider">
                      {isAdding ? "Close Form" : "Add Address"}
                    </span>
                  </button>
                </div>

                {isAdding && (
                  <AddressForm
                    onSave={handleAddAddress}
                    onCancel={() => setIsAdding(false)}
                    isSaving={isSaving}
                  />
                )}

                {/* 3. ADDRESS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {selectedUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="relative bg-slate-800/50 border border-slate-700 p-6 rounded-3xl hover:border-blue-500/50 transition-colors group"
                    >
                      <div className="absolute top-4 right-4 flex gap-2">
                        {addr.addressType !== "PRIMARY" && (
                          <button
                            onClick={() => handlePromoteAddress(addr.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-yellow-500/20 hover:text-yellow-500 transition-all duration-200"
                          >
                            <span className="text-lg">★</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-red-600 hover:text-white transition-all duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest ${
                            addr.addressType === "PRIMARY"
                              ? "bg-green-500/10 text-green-400"
                              : addr.addressType === "BILLING"
                                ? "bg-purple-500/10 text-purple-400"
                                : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {addr.addressType}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-white mb-1">{addr.streetAddress}</p>
                      <p className="text-slate-400 text-sm">
                        {addr.city} • {addr.postalCode} • {addr.countryCode}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <svg
                className="w-16 h-16 text-slate-800 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-lg font-medium italic">Select an account from the navigator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
