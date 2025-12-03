import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCurrentMonthEquipment } from "../../functions/controllers/equipment.controller";
import { filterservice } from "../../functions/controllers/service.controller";

// Small, accessible toast for non-blocking notifications
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, 3500);
    return () => clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 max-w-xs p-3 rounded shadow bg-white text-sm border"
      style={{ zIndex: 9999 }}
    >
      {message}
    </div>
  );
};

// Memoized phone input with forwardRef so focus is preserved across re-renders
const PhoneInput = React.memo(
  React.forwardRef(function PhoneInput({ value, onChange, id }, ref) {
    return (
      <input
        id={id}
        ref={ref}
        inputMode="tel"
        pattern="[0-9]*"
        autoComplete="tel"
        type="tel"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 rounded border"
        placeholder="Enter phone number (e.g. 6591234567)"
        aria-label="WhatsApp phone number"
      />
    );
  })
);

PhoneInput.displayName = "PhoneInput";

// Helper to create a stable id for each item (fallback to index if necessary)
const makeItemId = (item, idx) => {
  const name = item?.["Equipment Name"] || "";
  const pkg = item?.["Svc Pkg"] || "";
  return `${name}||${pkg}||${idx}`;
};

export default function MobilePm() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // array of stable ids
  const [phoneNumber, setPhoneNumber] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const phoneRef = useRef(null);
  const isMountedRef = useRef(true);

  // detect mobile width reactively (no reload)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Load saved phone from localStorage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pm_phone");
      if (saved) setPhoneNumber(saved);
    } catch (err) {
      // ignore localStorage errors silently
      // but surface small toast for the user
      setToastMessage("Could not read saved phone");
    }
  }, []);

  // Fetch and prepare data
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { pm = [], spec } = (await getCurrentMonthEquipment()) || {};
        const services = Array.isArray(spec) ? filterservice(spec) : [];

        const editedPM = Array.isArray(pm)
          ? pm.map((item) => {
              const serviceInfo = services.find(
                (s) => s?.["Service No"] === item?.["Svc Pkg"]
              );
              return {
                ...item,
                ServiceDetails: serviceInfo || {},
              };
            })
          : [];

        if (!cancelled && isMountedRef.current) {
          setData(editedPM);
        }
      } catch (err) {
        console.error("Failed to load PM data", err);
        if (!cancelled && isMountedRef.current) setError("Failed to load data");
      } finally {
        if (!cancelled && isMountedRef.current) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Create item map and stable ids so selection uses ids instead of object references
  const itemsWithIds = useMemo(() => {
    return data.map((item, idx) => ({ id: makeItemId(item, idx), item }));
  }, [data]);

  const itemsById = useMemo(() => {
    const map = new Map();
    itemsWithIds.forEach(({ id, item }) => map.set(id, item));
    return map;
  }, [itemsWithIds]);

  // Filtered data (search) - memoized
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return itemsWithIds;

    return itemsWithIds.filter(({ id, item }) => {
      const name = (item["Equipment Name"] || "").toLowerCase();
      const pkg = (item["Svc Pkg"] || "").toLowerCase();
      const details = item.ServiceDetails || {};
      const keys = Object.keys(details);
      const tasks = keys[1] && Array.isArray(details[keys[1]]) ? details[keys[1]] : [];

      const taskMatch = tasks.some((t) => String(t).toLowerCase().includes(term));
      return name.includes(term) || pkg.includes(term) || taskMatch;
    });
  }, [itemsWithIds, searchTerm]);

  // Selection: toggle id
  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const found = prev.includes(id);
      if (found) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }, []);

  // Save/clear phone handlers
  const savePhone = useCallback(() => {
    const trimmed = phoneNumber.trim();
    if (!/^[0-9]{6,15}$/.test(trimmed)) {
      setToastMessage("Please enter a valid phone number (digits only)");
      return;
    }
    try {
      localStorage.setItem("pm_phone", trimmed);
      setToastMessage("Phone saved");
    } catch (err) {
      console.error("Failed to save phone", err);
      setToastMessage("Failed to save phone");
    }
  }, [phoneNumber]);

  const clearPhone = useCallback(() => {
    try {
      localStorage.removeItem("pm_phone");
    } catch (err) {
      // ignore
    }
    setPhoneNumber("");
    setToastMessage("Phone cleared");
    phoneRef.current?.focus();
  }, []);

  // Send WhatsApp message
  const sendWhatsApp = useCallback(() => {
    const trimmed = phoneNumber.trim();
    if (!/^[0-9]{6,15}$/.test(trimmed)) {
      setToastMessage("Enter a valid phone number before sending");
      phoneRef.current?.focus();
      return;
    }

    if (selectedIds.length === 0) {
      setToastMessage("Select at least one item to send");
      return;
    }

    const lines = selectedIds.map((id, i) => {
      const item = itemsById.get(id);
      const name = item?.["Equipment Name"] || "(unknown)";
      const pkg = item?.["Svc Pkg"] || "(unknown)";
      return `${i + 1}. ${name} - ${pkg}`;
    });

    const msg = lines.join("\n");
   const url = `https://wa.me/${trimmed}?text=${encodeURIComponent(msg)}`;

    // open in new tab
    try {
  // iOS wrapper link updater
  if (window.pmUpdateLink) {
    window.pmUpdateLink(trimmed, msg);
  }

      window.open(url, "_blank", "noopener,noreferrer");
      setToastMessage("Opening WhatsApp...");
    } catch (err) {
      console.error("Failed to open WhatsApp", err);
      setToastMessage("Unable to open WhatsApp");
    }
  }, [phoneNumber, selectedIds, itemsById]);

  const dismissToast = useCallback(() => setToastMessage(""), []);

  // Render helpers
  const handleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  if (loading) {
    return (
      <div className="p-4">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">{error}</div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-[750px] mx-auto min-h-screen p-4">
      <h1 className="font-bold text-lg mt-2">Preventive Maintenance (PM) Schedule</h1>

      <div className="w-full max-w-md mt-4">
        <label htmlFor="pm-search" className="sr-only">
          Search equipment, service or task
        </label>
        <input
          id="pm-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="font-bold mb-4 w-full bg-amber-50 px-4 py-2 rounded"
          placeholder="Search Equipment, Service, or Task..."
          aria-label="Search equipment, service or task"
        />

        <div className="bg-gray-100 p-3 rounded mb-3">
          <label htmlFor="pm-phone" className="font-semibold mb-1 block">
            WhatsApp Number
          </label>

          <PhoneInput
            id="pm-phone"
            ref={phoneRef}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <div className="flex gap-3 mt-2">
            <button
              onClick={savePhone}
              className="bg-green-600 text-white px-3 py-1 rounded"
              aria-label="Save phone number"
            >
              Save
            </button>
            <button
              onClick={clearPhone}
              className="bg-red-600 text-white px-3 py-1 rounded"
              aria-label="Clear phone number"
            >
              Clear
            </button>
            <button
              onClick={() => phoneRef.current?.focus()}
              className="bg-gray-300 text-black px-3 py-1 rounded"
              aria-label="Focus phone input"
            >
              Focus
            </button>
          </div>
        </div>

        <button
          onClick={sendWhatsApp}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
          aria-label="Send selected items via WhatsApp"
        >
          Send Selected via WhatsApp
        </button>

        <p className="font-mono text-[12px] m-2">{filtered.length} results found</p>

        {filtered.map(({ id, item }, index) => {
          const details = item.ServiceDetails || {};
          const keys = Object.keys(details);
          const tasks = keys[1] && Array.isArray(details[keys[1]]) ? details[keys[1]] : [];
          const isSelected = selectedIds.includes(id);

          return (
            <article
              key={id}
              className={`border p-4 m-2 rounded shadow-md w-full max-w-md ${isSelected ? "bg-green-50 border-green-600" : "bg-white"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">Equipment: {item["Equipment Name"]}</h2>
                  <p className="text-sm">Service: {item["Svc Pkg"]}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(id)}
                      aria-checked={isSelected}
                      aria-label={`Select ${item["Equipment Name"]} service ${item["Svc Pkg"]}`}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-2">
                <button
                  onClick={() => handleExpand(id)}
                  className="w-full bg-gray-500 text-white text-center py-1 rounded mt-2 cursor-pointer"
                  aria-expanded={expandedId === id}
                >
                  {expandedId === id ? "Hide Spec" : "View Spec"}
                </button>

                {expandedId === id && tasks.length > 0 && (
                  <ul className="ml-4 list-disc mt-2">
                    {tasks.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <Toast message={toastMessage} onClose={dismissToast} />
    </div>
  );
}
