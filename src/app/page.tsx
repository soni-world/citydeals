"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { CITIES } from "@/lib/cities";
import type { City } from "@/lib/cities";
import type { Deal } from "@/lib/db";
import DealForm from "@/components/DealForm";
import DealCard from "@/components/DealCard";
import CityPicker from "@/components/CityPicker";
import CategoryFilter from "@/components/CategoryFilter";
import Toast from "@/components/Toast";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-xl bg-gray-100 flex items-center justify-center animate-pulse">
      <div className="text-center">
        <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-gray-400 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMarker, setNewMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("map");

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals?city=${encodeURIComponent(selectedCity.name)}`);
      const data = await res.json();
      setDeals(data);
    } catch {
      setToast({ message: "Failed to load deals", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedCity.name]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Category deal counts
  const dealCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const deal of deals) {
      counts[deal.category] = (counts[deal.category] || 0) + 1;
    }
    return counts;
  }, [deals]);

  // Filtered deals
  const filteredDeals = useMemo(() => {
    if (categoryFilter === "All") return deals;
    return deals.filter((d) => d.category === categoryFilter);
  }, [deals, categoryFilter]);

  function handleCityChange(city: City) {
    setSelectedCity(city);
    setSelectedDeal(null);
    setShowForm(false);
    setNewMarker(null);
    setCategoryFilter("All");
  }

  function handleMapClick(lat: number, lng: number) {
    setNewMarker({ lat, lng });
    if (!showForm) {
      setShowForm(true);
      setSelectedDeal(null);
    }
  }

  function handleDealSubmitted() {
    setShowForm(false);
    setNewMarker(null);
    fetchDeals();
    setToast({ message: "Deal posted successfully!", type: "success" });
  }

  function handleDealClick(deal: Deal) {
    setSelectedDeal(deal);
    setShowForm(false);
  }

  async function handleDeleteDeal(dealId: string) {
    try {
      const res = await fetch(`/api/deals/${dealId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSelectedDeal(null);
      fetchDeals();
      setToast({ message: "Deal deleted", type: "success" });
    } catch {
      setToast({ message: "Failed to delete deal", type: "error" });
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
              CityDeals
            </h1>
            <span className="hidden lg:inline text-xs text-gray-400 border-l pl-3 whitespace-nowrap">
              Buy & sell locally on the map
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <CityPicker selectedCity={selectedCity} onChange={handleCityChange} />

            <button
              onClick={() => {
                setShowForm(!showForm);
                setSelectedDeal(null);
                if (!showForm) setNewMarker(null);
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                showForm
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md"
              }`}
            >
              {showForm ? "Cancel" : "+ Post Deal"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile toggle (visible on small screens) */}
      <div className="sm:hidden flex bg-white border-b border-gray-200">
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${
            mobileView === "list"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
        >
          Deals ({filteredDeals.length})
        </button>
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${
            mobileView === "map"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
        >
          Map
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-full sm:w-[380px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden ${
          mobileView === "map" ? "hidden sm:flex" : "flex"
        }`}>
          {showForm ? (
            <div className="p-4 overflow-y-auto deals-sidebar flex-1">
              <DealForm
                city={selectedCity.name}
                state={selectedCity.state}
                markerPosition={newMarker}
                onSubmit={handleDealSubmitted}
                onCancel={() => {
                  setShowForm(false);
                  setNewMarker(null);
                }}
              />
            </div>
          ) : selectedDeal ? (
            <div className="p-4 overflow-y-auto deals-sidebar flex-1">
              <button
                onClick={() => setSelectedDeal(null)}
                className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1 group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to deals
              </button>

              <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{selectedDeal.title}</h2>

              <p className="text-2xl font-bold text-green-700 mb-3">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(selectedDeal.price)}
              </p>

              <div className="flex items-center gap-2 flex-wrap mb-5">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  {selectedDeal.category}
                </span>
                <span className="text-xs text-gray-400">
                  {selectedCity.name}, {selectedCity.state}
                </span>
                {selectedDeal.expires_at && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    new Date(selectedDeal.expires_at + "Z") < new Date(Date.now() + 24 * 60 * 60 * 1000)
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-600"
                  }`}>
                    Expires {new Date(selectedDeal.expires_at + "Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedDeal.description}</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Contact Seller
                </h3>
                {selectedDeal.contact_phone && (
                  <a
                    href={`tel:${selectedDeal.contact_phone}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Call</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedDeal.contact_phone}</p>
                    </div>
                  </a>
                )}
                {selectedDeal.contact_email && (
                  <a
                    href={`mailto:${selectedDeal.contact_email}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Email</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedDeal.contact_email}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Delete deal */}
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this deal?")) {
                    handleDeleteDeal(selectedDeal.id);
                  }
                }}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete this deal
              </button>
            </div>
          ) : (
            <>
              {/* Sidebar header */}
              <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 text-sm">
                    Deals in {selectedCity.name}
                  </h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {filteredDeals.length} {filteredDeals.length === 1 ? "deal" : "deals"}
                  </span>
                </div>
                <CategoryFilter
                  selected={categoryFilter}
                  onChange={setCategoryFilter}
                  dealCounts={dealCounts}
                />
              </div>

              {/* Deals list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 deals-sidebar">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredDeals.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      {categoryFilter !== "All"
                        ? `No ${categoryFilter} deals yet`
                        : `No deals in ${selectedCity.name} yet`}
                    </p>
                    <p className="text-gray-400 text-xs mb-4">Be the first to post a deal!</p>
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setSelectedDeal(null);
                        setNewMarker(null);
                      }}
                      className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                    >
                      + Post a deal now
                    </button>
                  </div>
                ) : (
                  filteredDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      selected={false}
                      onClick={() => handleDealClick(deal)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </aside>

        {/* Map */}
        <main className={`flex-1 p-2 sm:p-3 ${
          mobileView === "list" ? "hidden sm:block" : "block"
        }`}>
          <Map
            center={[selectedCity.lat, selectedCity.lng]}
            zoom={selectedCity.zoom}
            deals={filteredDeals}
            onDealClick={handleDealClick}
            onMapClick={handleMapClick}
            newMarker={newMarker}
          />
        </main>
      </div>
    </div>
  );
}
