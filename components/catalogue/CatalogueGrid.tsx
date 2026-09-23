"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useCampus } from "@/components/landing/CampusContext";
import { CraftItemData, LabSlug, getAllCraftItems } from "@/lib/craft-data";
import { getCraftArticles } from "@/app/actions/crafts";
import { CatalogueCard } from "./CatalogueCard";
import { CatalogueFilterBar } from "./CatalogueFilterBar";
import { SmileySad } from "@phosphor-icons/react";

const BATCH_SIZE = 8;
const BATCH_INCREMENT = 4;

interface CatalogueGridProps {
  initialItems?: CraftItemData[];
}

export function CatalogueGrid({ initialItems }: CatalogueGridProps) {
  const { campus } = useCampus();
  const [items, setItems] = useState<CraftItemData[]>(() => initialItems || getAllCraftItems());
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Dynamically refresh items from server actions / data store
  useEffect(() => {
    let isMounted = true;
    getCraftArticles()
      .then((fetched) => {
        if (isMounted && fetched && fetched.length > 0) {
          setItems(fetched);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote craft items, using local seed:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState<LabSlug | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Determine available labs for the active campus
  const availableLabs = useMemo<LabSlug[]>(() => {
    if (campus === "køge") {
      return ["makerspace", "medialab"];
    }
    return ["makerspace", "dimselab"];
  }, [campus]);

  // When campus changes, reset lab filter if it is not supported at the new campus
  useEffect(() => {
    if (selectedLab !== "all" && !availableLabs.includes(selectedLab)) {
      setSelectedLab("all");
    }
  }, [campus, availableLabs, selectedLab]);

  // Reset lazy loaded count back to initial batch whenever filter criteria change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [searchQuery, selectedLab, selectedCategory, campus]);

  // Dynamic categories extracted from current items
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => set.add(item.category));
    return Array.from(set);
  }, [items]);

  // Scoped strictly to active campus
  const campusItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.campuses.includes(campus) ||
        item.locations.some((loc) => loc.campus === campus)
    );
  }, [items, campus]);

  // Filtered by search, lab, and category
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return campusItems.filter((item) => {
      // Lab filter
      if (selectedLab !== "all" && !item.labs.includes(selectedLab)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (query) {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesProcess = item.processes.some(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.subtitle.toLowerCase().includes(query) ||
            p.machines.some(
              (m) =>
                m.name.toLowerCase().includes(query) ||
                m.model.toLowerCase().includes(query)
            )
        );

        if (!matchesTitle && !matchesCategory && !matchesTags && !matchesProcess) {
          return false;
        }
      }

      return true;
    });
  }, [campusItems, selectedLab, selectedCategory, searchQuery]);

  // Sliced visible items for lazy rendering
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  // IntersectionObserver for seamless scroll-based progressive loading
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, filteredItems.length));
        }
      },
      { rootMargin: "300px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, filteredItems.length]);

  const hasActiveFilters = searchQuery !== "" || selectedLab !== "all" || selectedCategory !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLab("all");
    setSelectedCategory("all");
    setVisibleCount(BATCH_SIZE);
  };

  return (
    <div className="w-full space-y-8">
      {/* Filter and Search Bar */}
      <CatalogueFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLab={selectedLab}
        onLabChange={setSelectedLab}
        availableLabs={availableLabs}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={allCategories}
        totalCount={campusItems.length}
        filteredCount={filteredItems.length}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Grid of Catalogue Cards - progressive render */}
      {visibleItems.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {visibleItems.map((item) => (
              <CatalogueCard key={item.slug} item={item} />
            ))}
          </div>

          {/* Lazy Load Sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="w-full py-8 flex justify-center items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-[#009FE3] animate-pulse" />
                <span>Indlæser flere projekter ({visibleItems.length}/{filteredItems.length})...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty Fallback State */
        <div className="w-full py-16 px-4 text-center border border-zinc-800 bg-zinc-950/60 rounded-none flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-none border border-zinc-700 flex items-center justify-center text-zinc-500">
            <SmileySad size={28} weight="regular" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-headline text-lg text-white font-medium">Ingen resultater fundet</h4>
            <p className="text-sm text-zinc-400 mt-1 max-w-sm">
              Vi fandt ingen projekter i {campus === "køge" ? "Køge" : "Roskilde"}, der matcher dine søgekriterier.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-mono uppercase bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer rounded-none border border-white"
          >
            Nulstil alle filtre
          </button>
        </div>
      )}
    </div>
  );
}
