import { useState, useEffect } from "react";
import AddressForm from "../../address/components/AddressForm";
import { userService } from "../services/userService";
import Dropdown from "../../../shared/components/ui/Dropdown";

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ID_ASC");

  const [usersPage, setUsersPage] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });

  // ✅ Dropdown options (NEW)
  const sortOptions = [
    { label: "ID ↑", value: "ID_ASC" },
    { label: "ID ↓", value: "ID_DESC" },
  ];

  // ---------------- FETCH ----------------
  const fetchUsers = async (query = "", sort = "ID_ASC") => {
    try {
      const data = await userService.getAllUsers({
        search: query,
        sortBy: sort,
        page: 0,
        size: 10,
      });

      setUsersPage(data);

      if (data.content?.length > 0 && !selectedUser) {
        setSelectedUser(data.content[0]);
      }
    } catch (err) {
      console.error("[UsersPage]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery, sortBy);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading users...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* TOP BAR */}
      <div className="border-b border-slate-800 p-4 flex justify-between items-center">
        <div className="flex gap-3 w-full max-w-md">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search users..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* ✅ FIXED SORT DROPDOWN */}
          <div className="w-[140px]">
            <Dropdown
              value={sortBy}
              options={sortOptions}
              onChange={(value) => setSortBy(value)}
            />
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold">
          + Create User
        </button>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-72 border-r border-slate-800 overflow-y-auto">
          <div className="p-2 space-y-1">
            {usersPage.content.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`w-full text-left p-3 rounded-xl transition ${selectedUser?.id === u.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800"
                  }`}
              >
                <div className="text-sm font-semibold truncate">
                  {u.firstName} {u.lastName}
                </div>
                <div className="text-xs opacity-70 truncate">
                  {u.email}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedUser ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* LEFT MAIN */}
              <div className="xl:col-span-2 space-y-6">
                {/* HEADER */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
                    {selectedUser.firstName[0]}
                    {selectedUser.lastName[0]}
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h1>
                    <p className="text-sm text-slate-400">
                      {selectedUser.email}
                    </p>

                    <div className="mt-2">
                      <Badge>ID #{selectedUser.id}</Badge>
                    </div>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-4">
                  <Card
                    label="Addresses"
                    value={selectedUser.addresses.length}
                  />
                  <Card
                    label="Primary"
                    value={
                      selectedUser.addresses.some(
                        (a) => a.addressType === "PRIMARY"
                      )
                        ? "YES"
                        : "NO"
                    }
                  />
                  <Card label="User ID" value={`#${selectedUser.id}`} />
                </div>

                {/* ADDRESSES */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-400">
                      Addresses
                    </h3>

                    <button
                      onClick={() => setIsAdding(!isAdding)}
                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg"
                    >
                      {isAdding ? "Cancel" : "+ Add"}
                    </button>
                  </div>

                  {isAdding && (
                    <AddressForm
                      onSave={async (formData) => {
                        setIsSaving(true);
                        try {
                          const updated = await userService.addAddress(
                            selectedUser.id,
                            formData
                          );
                          setSelectedUser(updated);
                          setUsersPage((prev) => ({
                            ...prev,
                            content: prev.content.map((u) =>
                              u.id === updated.id ? updated : u
                            ),
                          }));
                          setIsAdding(false);
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      onCancel={() => setIsAdding(false)}
                      isSaving={isSaving}
                    />
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedUser.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-blue-500/40 transition"
                      >
                        <Badge variant={getAddressVariant(addr.addressType)}>
                          {addr.addressType}
                        </Badge>

                        <div className="text-white font-semibold">
                          {addr.streetAddress}
                        </div>

                        <div className="text-sm text-slate-400">
                          {addr.city}, {addr.countryCode}
                        </div>

                        <div className="pt-2">
                          <Badge>ID #{addr.id}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <h3 className="text-xs text-slate-400 mb-3">
                    Quick Actions
                  </h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => setIsAdding(true)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs"
                    >
                      Add Address
                    </button>

                    <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-xs">
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Select a user
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* BADGE */
function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-slate-800 text-slate-300",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-emerald-500/10 text-emerald-400",
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

/* ADDRESS TYPE COLOR */
function getAddressVariant(type) {
  switch (type) {
    case "PRIMARY":
      return "green";
    case "BILLING":
      return "purple";
    case "SHIPPING":
      return "blue";
    default:
      return "default";
  }
}

/* CARD */
function Card({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}