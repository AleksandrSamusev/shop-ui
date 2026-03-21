export default function AddressesPage() {
  const addresses = []; // replace later with API

  return (
    <div className="flex flex-col h-full">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">
          My Addresses
        </h1>
      </div>

      {/* CONTENT */}
      {addresses.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-500">No addresses found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <p className="text-sm text-white font-bold">{addr.street}</p>
              <p className="text-sm text-slate-400">
                {addr.city}, {addr.state}
              </p>
              <p className="text-sm text-slate-400">
                {addr.zipCode}, {addr.country}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}