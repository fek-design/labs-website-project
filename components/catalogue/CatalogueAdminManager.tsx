"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCraftArticles,
  saveCraftArticle,
  deleteCraftArticle,
  uploadCraftImage,
  getAvailableCraftAssets,
  toggleFeatureOnFrontpage,
  CraftAssetItem,
} from "@/app/actions/crafts";
import { getAuthSession } from "@/app/actions/auth";
import { AnimatedCounter } from "@/components/pos/AnimatedCounter";
import {
  CraftItemData,
  CraftProcess,
  CANONICAL_CRAFT_CATEGORIES,
  LabSlug,
} from "@/lib/craft-data";
import {
  MagnifyingGlass,
  Star,
  ArrowUpRight,
  Trash,
  X,
  CaretDown,
  Eye,
  Plus,
  PencilSimple,
  UploadSimple,
  FolderOpen,
} from "@phosphor-icons/react";

interface CatalogueAdminManagerProps {
  activeLab?: string;
  onSelectLab?: (lab: "medialab" | "makerspace") => void;
}

const DEFAULT_FORM_DATA: CraftItemData = {
  slug: "",
  title: "",
  category: CANONICAL_CRAFT_CATEGORIES[0],
  tags: [],
  campuses: ["køge"],
  labs: ["makerspace"],
  heroImage: "/images/landing/carousel-tshirt.png",
  thumbnailImage: "/images/landing/carousel-tshirt.png",
  locations: [
    {
      name: "Makerspace (Køge)",
      campus: "køge",
      hours: "Åbent Onsdag 14-17",
      labSlug: "makerspace",
    },
  ],
  prerequisites: {
    materials: "Træfiberplade, akrylmaling, lim",
    estimatedTime: "Estimeret tid: 20-45 minutter",
    difficulty: "Begynder-venligt",
  },
  processes: [
    {
      id: "step-1",
      name: "Trin 1: Klargøring og design",
      subtitle: "Forbered din vektorfil eller model i det relevante software.",
      machines: [],
    },
  ],
  inspiration: [],
  manuals: [],
};

export function CatalogueAdminManager({ activeLab = "makerspace" }: CatalogueAdminManagerProps) {
  const [items, setItems] = useState<CraftItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedShowcaseFilter, setSelectedShowcaseFilter] = useState<"ALL" | "FEATURED" | "UNFEATURED">("ALL");
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Editor Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CraftItemData>(DEFAULT_FORM_DATA);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);

  // Asset Browser Modal State
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [targetImageField, setTargetImageField] = useState<"thumbnailImage" | "heroImage" | null>(null);
  const [availableAssets, setAvailableAssets] = useState<CraftAssetItem[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch admin session username for greeting
  useEffect(() => {
    getAuthSession()
      .then((session) => {
        if (session?.user?.username) {
          const raw = session.user.username;
          const formatted = raw.charAt(0).toUpperCase() + raw.slice(1);
          setAdminName(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getCraftArticles();
      setItems(data);
    } catch (err: any) {
      console.error("Failed to load catalogue items:", err);
      setFeedback({ message: "Kunne ikke indlæse katalogartikler.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const featuredCount = useMemo(() => {
    return items.filter((i) => i.isFeaturedOnFrontpage).length;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }

      // Showcase filter
      if (selectedShowcaseFilter === "FEATURED" && !item.isFeaturedOnFrontpage) {
        return false;
      }
      if (selectedShowcaseFilter === "UNFEATURED" && item.isFeaturedOnFrontpage) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedCategory, selectedShowcaseFilter, searchQuery]);

  const handleToggleShowcase = async (slug: string) => {
    const targetItem = items.find((i) => i.slug === slug);
    if (!targetItem) return;

    const isAdding = !targetItem.isFeaturedOnFrontpage;
    if (isAdding && featuredCount >= 5) {
      setFeedback({
        message: "Maksimalt 5 genstande kan være fremhævet på forsiden ad gangen.",
        type: "error",
      });
      return;
    }

    try {
      const res = await toggleFeatureOnFrontpage(slug);
      if (res.success) {
        setFeedback({
          message: res.isFeatured
            ? `"${targetItem.title}" fremhævet på forsiden (${res.count}/5)`
            : `"${targetItem.title}" fjernet fra forside-showcase (${res.count}/5)`,
          type: "success",
        });
        await loadData();
      }
    } catch (err: any) {
      setFeedback({ message: err.message || "Fejl under opdatering.", type: "error" });
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const res = await deleteCraftArticle(slug);
      if (res.success) {
        setFeedback({ message: "Artiklen blev slettet fra kataloget.", type: "success" });
        setDeleteConfirmSlug(null);
        await loadData();
      } else {
        setFeedback({ message: res.error || "Kunne ikke slette artikel.", type: "error" });
      }
    } catch (err: any) {
      setFeedback({ message: err.message || "Fejl ved sletning.", type: "error" });
    }
  };

  // Open Edit Modal with selected item
  const openEditModal = (item: CraftItemData) => {
    setFormData({
      ...item,
      campuses: ["køge"],
      labs: item.labs?.length ? item.labs : ["makerspace"],
      processes: item.processes?.length ? item.processes : DEFAULT_FORM_DATA.processes,
    });
    setIsEditing(true);
  };

  // Open Create Modal with default item
  const openCreateModal = () => {
    setFormData({
      ...DEFAULT_FORM_DATA,
      slug: `projekt-${Date.now().toString(36)}`,
    });
    setIsEditing(true);
  };

  // Save handler for craft article
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ message: "Angiv venligst en projekttitel.", type: "error" });
      return;
    }

    const slug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    setIsSaving(true);
    try {
      const payload: CraftItemData = {
        ...formData,
        slug,
        campuses: ["køge"],
      };

      const res = await saveCraftArticle(payload);
      if (res.success) {
        setFeedback({ message: `Projektet "${payload.title}" er gemt!`, type: "success" });
        setIsEditing(false);
        await loadData();
      } else {
        setFeedback({ message: res.error || "Kunne ikke gemme projektet.", type: "error" });
      }
    } catch (err: any) {
      setFeedback({ message: err.message || "Fejl ved gemning.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Asset Browser helpers
  const openAssetPicker = async (field: "thumbnailImage" | "heroImage") => {
    setTargetImageField(field);
    setShowAssetModal(true);
    setLoadingAssets(true);
    try {
      const assets = await getAvailableCraftAssets();
      setAvailableAssets(assets);
    } catch {
      setFeedback({ message: "Kunne ikke hente billedbibliotek.", type: "error" });
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleSelectAsset = (assetUrl: string) => {
    if (targetImageField) {
      setFormData((prev) => ({ ...prev, [targetImageField]: assetUrl }));
    }
    setShowAssetModal(false);
  };

  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const res = await uploadCraftImage(uploadFormData);
      if (res.success && res.url) {
        if (targetImageField) {
          setFormData((prev) => ({ ...prev, [targetImageField]: res.url }));
        }
        setShowAssetModal(false);
        setFeedback({ message: "Billede uploadet!", type: "success" });
      } else {
        setFeedback({ message: res.error || "Upload mislykkedes.", type: "error" });
      }
    } catch {
      setFeedback({ message: "Netværksfejl under upload.", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1512px] mx-auto p-4 sm:p-6 lg:p-8 bg-[#0e0d0f] min-h-screen text-white font-text">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-headline font-bold border flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-[#E6007E]/10 border-[#E6007E]/30 text-[#E6007E]"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-white/10 rounded-md cursor-pointer transition-colors"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      )}

      {/* 1. Canonical Admin Page Header Standard (AGENTS.md) with Magenta #E6007E Accent */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black font-notch tracking-tight flex items-baseline gap-1.5">
            <span className="text-white">LABS</span>
            <span className="text-[#E6007E]">Katalog</span>
          </h1>
          <p className="text-sm font-headline font-bold text-zinc-400 mt-1">
            Velkommen, {adminName}
          </p>
        </div>

        {/* 3 Top KPI Metric Counters */}
        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          {/* 1. Total offentlige genstande */}
          <div className="flex items-baseline gap-3">
            <AnimatedCounter
              value={items.length}
              className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none"
            />
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Offentlige<br />projekter
            </span>
          </div>

          {/* 2. Forside Showcase */}
          <div className="flex items-baseline gap-3">
            <div className="flex items-baseline gap-1">
              <AnimatedCounter
                value={featuredCount}
                className="text-5xl sm:text-6xl font-bold font-notch text-[#E6007E] leading-none"
              />
              <span className="text-2xl font-bold text-zinc-500 font-notch">/5</span>
            </div>
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Forside<br />showcase
            </span>
          </div>

          {/* 3. Aktive kategorier */}
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none">
              <AnimatedCounter value={CANONICAL_CRAFT_CATEGORIES.length} />
            </span>
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Aktive<br />kategorier
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Container with Filter Toolbar */}
      <div className="flex flex-col gap-5 p-4 sm:p-6 bg-[#151517] border border-[#333333] rounded-2xl shadow-xl">
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={18}
              weight="bold"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg i offentlige katalogartikler, tags eller metoder..."
              className="w-full bg-[#151517] border border-[#333333] hover:border-[#444444] focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X size={14} weight="bold" />
              </button>
            )}
          </div>

          {/* Create New Craft Article Action */}
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#E6007E] hover:bg-[#d00072] text-white font-headline font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <Plus size={16} weight="bold" />
            <span>Nyt Projekt</span>
          </button>

          {/* View Public Catalogue Link */}
          <Link
            href="/katalog"
            target="_blank"
            className="px-4 py-2.5 bg-[#202021] hover:bg-[#262628] border border-[#444444] text-zinc-200 hover:text-white font-headline font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span>Se Offentligt</span>
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </div>

        {/* Filter Strip */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full border-b border-[#262626] pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-notch tracking-tight">
            Katalog Prototyper &amp; Guides <span className="text-[#888888] font-normal">{filteredItems.length}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="flex flex-col gap-1.5 min-w-[150px] flex-1 sm:flex-initial">
              <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wider font-headline">
                KATEGORI
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-[#151517] hover:bg-[#1a1a1d] text-white text-xs sm:text-sm font-bold font-text border border-[#333333] hover:border-[#444444] rounded-lg px-3.5 py-2.5 pr-8 cursor-pointer focus:outline-none focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] transition-colors"
                >
                  <option value="ALL">ALLE KATEGORIER</option>
                  {CANONICAL_CRAFT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <CaretDown
                  size={14}
                  weight="bold"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-[1px] h-8 bg-[#333333] self-end mb-1" />

            {/* Showcase Filter */}
            <div className="flex flex-col gap-1.5 min-w-[140px] flex-1 sm:flex-initial">
              <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wider font-headline">
                SHOWCASE
              </label>
              <div className="relative">
                <select
                  value={selectedShowcaseFilter}
                  onChange={(e) => setSelectedShowcaseFilter(e.target.value as any)}
                  className="w-full appearance-none bg-[#151517] hover:bg-[#1a1a1d] text-white text-xs sm:text-sm font-bold font-text border border-[#333333] hover:border-[#444444] rounded-lg px-3.5 py-2.5 pr-8 cursor-pointer focus:outline-none focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] transition-colors"
                >
                  <option value="ALL">ALLE</option>
                  <option value="FEATURED">Fremhævet på forside</option>
                  <option value="UNFEATURED">Ikke fremhævet</option>
                </select>
                <CaretDown
                  size={14}
                  weight="bold"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Items Card Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#E6007E] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-zinc-500 font-headline text-sm">Indlæser katalogartikler...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#333333] rounded-2xl bg-[#09090b]/50">
            <p className="text-zinc-400 font-headline text-base">Ingen artikler matcher dine søgekriterier.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedShowcaseFilter("ALL");
              }}
              className="mt-3 text-xs text-[#E6007E] hover:underline font-bold cursor-pointer"
            >
              Nulstil alle filtre
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isFeatured = Boolean(item.isFeaturedOnFrontpage);
              return (
                <div
                  key={item.slug}
                  className="bg-[#202021] border border-[#444444] hover:border-[#666666] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group relative shadow-md"
                >
                  {/* Top: Image & Status Badges */}
                  <div>
                    <div className="relative w-full h-48 bg-[#151517] rounded-xl overflow-hidden border border-[#333333] mb-4 flex items-center justify-center">
                      <Image
                        src={item.thumbnailImage || item.heroImage || "/images/landing/carousel-tshirt.png"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Showcase Star Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleShowcase(item.slug)}
                        title={
                          isFeatured
                            ? "Fjern fra forside showcase"
                            : "Fremhæv på forside showcase (maks 5)"
                        }
                        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                          isFeatured
                            ? "bg-[#E6007E] text-white hover:scale-110"
                            : "bg-black/60 text-zinc-400 hover:text-white hover:bg-black/80"
                        }`}
                      >
                        <Star size={16} weight={isFeatured ? "fill" : "bold"} />
                      </button>

                      {/* Category Tag */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#333333] text-[11px] font-headline font-bold text-white uppercase tracking-wider">
                        {item.category}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold font-notch text-white group-hover:text-[#E6007E] transition-colors leading-tight">
                        {item.title}
                      </h3>
                    </div>

                    {/* Metadata strip */}
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-3">
                      <span>{item.prerequisites?.difficulty || "Begynder"}</span>
                      <span>•</span>
                      <span>{item.prerequisites?.estimatedTime || "15-30 min"}</span>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-[#151517] border border-[#333333] text-[10px] font-mono text-zinc-300"
                          >
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-[10px] text-zinc-500 font-mono self-center">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Card Actions */}
                  <div className="pt-4 border-t border-[#333333] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/craft/${item.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-[#151517] hover:bg-[#252528] border border-[#333333] text-xs font-headline font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye size={14} weight="bold" />
                        <span>Se</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1.5 rounded-lg bg-[#151517] hover:bg-[#252528] border border-[#333333] text-xs font-headline font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PencilSimple size={14} weight="bold" />
                        <span>Rediger</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmSlug(item.slug)}
                      className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Slet artikel"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Full Article Authoring & Editing Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#151517] border border-[#333333] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#333333] pb-4">
              <div>
                <h2 className="text-2xl font-bold font-notch text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#E6007E] rounded-full" />
                  <span>{formData.slug ? "Rediger Katalogartikel" : "Opret Ny Katalogartikel"}</span>
                </h2>
                <p className="text-xs text-zinc-400 font-headline mt-1">
                  Udgiv eller opdater trin-for-trin guides og projekter i det offentlige katalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#202021] cursor-pointer"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs font-text">
              {/* Basic Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-headline font-bold text-zinc-300 block">Projekttitel *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="fx Laserskåret Nøglering i Akryl"
                    className="w-full bg-[#202021] border border-[#444444] focus:border-[#E6007E] rounded-lg p-2.5 text-sm text-white font-bold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-headline font-bold text-zinc-300 block">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#202021] border border-[#444444] focus:border-[#E6007E] rounded-lg p-2.5 text-xs text-white font-bold outline-none"
                  >
                    {CANONICAL_CRAFT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-headline font-bold text-zinc-300 block">URL Slug (Valgfri)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="autogenereres hvis tom"
                    className="w-full bg-[#202021] border border-[#444444] focus:border-[#E6007E] rounded-lg p-2.5 text-xs text-zinc-300 font-mono outline-none"
                  />
                </div>
              </div>

              {/* Lab & Facility Selection (Strictly Køge Campus facilities) */}
              <div className="p-4 bg-[#202021] border border-[#444444] rounded-xl space-y-3">
                <div className="text-xs font-headline font-bold text-zinc-300 uppercase tracking-wider">
                  Tilknyttet Facilitet (Køge Campus)
                </div>
                <div className="flex gap-4">
                  {(["makerspace", "medialab"] as LabSlug[]).map((lab) => {
                    const isChecked = formData.labs?.includes(lab);
                    return (
                      <label
                        key={lab}
                        className="flex items-center gap-2 cursor-pointer text-xs font-headline font-bold"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const newLabs = e.target.checked
                              ? [...(formData.labs || []), lab]
                              : (formData.labs || []).filter((l) => l !== lab);
                            setFormData({
                              ...formData,
                              labs: newLabs.length > 0 ? newLabs : ["makerspace"],
                            });
                          }}
                          className="accent-[#E6007E] w-4 h-4 rounded"
                        />
                        <span className="capitalize">{lab === "makerspace" ? "Makerspace" : "MediaLab"}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Image Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-headline font-bold text-zinc-300 block">Thumbnail Billede</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.thumbnailImage || ""}
                      onChange={(e) => setFormData({ ...formData, thumbnailImage: e.target.value })}
                      placeholder="/images/crafts/thumb.png"
                      className="flex-1 bg-[#202021] border border-[#444444] rounded-lg p-2 text-xs text-white font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => openAssetPicker("thumbnailImage")}
                      className="px-3 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-lg cursor-pointer"
                      title="Vælg fra bibliotek"
                    >
                      <FolderOpen size={16} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-headline font-bold text-zinc-300 block">Hero Billede</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.heroImage || ""}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="/images/crafts/hero.png"
                      className="flex-1 bg-[#202021] border border-[#444444] rounded-lg p-2 text-xs text-white font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => openAssetPicker("heroImage")}
                      className="px-3 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-lg cursor-pointer"
                      title="Vælg fra bibliotek"
                    >
                      <FolderOpen size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Prerequisites & Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-headline font-bold text-zinc-300 block">Sværhedsgrad</label>
                  <input
                    type="text"
                    value={formData.prerequisites?.difficulty || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prerequisites: {
                          ...formData.prerequisites,
                          difficulty: e.target.value,
                          materials: formData.prerequisites?.materials || "",
                          estimatedTime: formData.prerequisites?.estimatedTime || "",
                        },
                      })
                    }
                    placeholder="Begynder-venligt"
                    className="w-full bg-[#202021] border border-[#444444] rounded-lg p-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-headline font-bold text-zinc-300 block">Estimeret tid</label>
                  <input
                    type="text"
                    value={formData.prerequisites?.estimatedTime || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prerequisites: {
                          ...formData.prerequisites,
                          estimatedTime: e.target.value,
                          materials: formData.prerequisites?.materials || "",
                          difficulty: formData.prerequisites?.difficulty || "",
                        },
                      })
                    }
                    placeholder="20-40 minutter"
                    className="w-full bg-[#202021] border border-[#444444] rounded-lg p-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-headline font-bold text-zinc-300 block">Materialer</label>
                  <input
                    type="text"
                    value={formData.prerequisites?.materials || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prerequisites: {
                          ...formData.prerequisites,
                          materials: e.target.value,
                          estimatedTime: formData.prerequisites?.estimatedTime || "",
                          difficulty: formData.prerequisites?.difficulty || "",
                        },
                      })
                    }
                    placeholder="Akryl, krydsfiner"
                    className="w-full bg-[#202021] border border-[#444444] rounded-lg p-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Processes & Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-headline font-bold text-zinc-300 block uppercase tracking-wider text-[11px]">
                    Trin-for-trin Vejledning ({formData.processes?.length || 0} trin)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const nextStepNum = (formData.processes?.length || 0) + 1;
                      const newProcess: CraftProcess = {
                        id: `step-${nextStepNum}-${Date.now().toString(36)}`,
                        name: `Trin ${nextStepNum}: Nyt trin`,
                        subtitle: "Beskrivelse af processen...",
                        machines: [],
                      };
                      setFormData({
                        ...formData,
                        processes: [...(formData.processes || []), newProcess],
                      });
                    }}
                    className="px-3 py-1 bg-[#202021] hover:bg-[#333333] border border-[#444444] rounded-md text-[11px] font-headline font-bold text-zinc-300 cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={12} weight="bold" />
                    <span>Tilføj Trin</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.processes?.map((proc, idx) => (
                    <div key={proc.id || idx} className="p-3 bg-[#202021] border border-[#444444] rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={proc.name}
                          onChange={(e) => {
                            const updated = [...(formData.processes || [])];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setFormData({ ...formData, processes: updated });
                          }}
                          className="flex-1 bg-[#151517] border border-[#333333] rounded px-2.5 py-1 text-xs font-bold text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.processes || []).filter((_, i) => i !== idx);
                            setFormData({ ...formData, processes: updated });
                          }}
                          className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={proc.subtitle || ""}
                        onChange={(e) => {
                          const updated = [...(formData.processes || [])];
                          updated[idx] = { ...updated[idx], subtitle: e.target.value };
                          setFormData({ ...formData, processes: updated });
                        }}
                        placeholder="Uddybende vejledning for dette trin..."
                        className="w-full bg-[#151517] border border-[#333333] rounded p-2 text-xs text-zinc-300 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-[#333333] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-[#202021] hover:bg-[#262628] text-zinc-300 font-headline font-bold rounded-lg cursor-pointer"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#E6007E] hover:bg-[#d00072] text-white font-headline font-bold rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Gemmer..." : "Gem Projekt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Asset Library Browser Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151517] border border-[#333333] rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <h3 className="text-lg font-bold font-notch text-white flex items-center gap-2">
                <FolderOpen size={20} weight="bold" className="text-[#E6007E]" />
                <span>Vælg eller Upload Billede</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAssetModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Upload Button */}
            <div className="flex items-center justify-between gap-3">
              <input
                type="file"
                ref={modalFileInputRef}
                accept="image/*"
                onChange={handleModalFileUpload}
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => modalFileInputRef.current?.click()}
                className="px-4 py-2 bg-[#E6007E] hover:bg-[#d00072] text-white text-xs font-headline font-bold rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <UploadSimple size={16} weight="bold" />
                <span>{isUploading ? "Uploader..." : "Upload fra enhed"}</span>
              </button>
            </div>

            {/* Asset Grid */}
            <div className="flex-1 overflow-y-auto min-h-[300px] border border-[#333333] rounded-xl p-3 bg-[#09090b]">
              {loadingAssets ? (
                <div className="py-16 text-center text-zinc-500 font-headline text-xs">
                  Indlæser billeder...
                </div>
              ) : availableAssets.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 font-headline text-xs">
                  Ingen billeder fundet i mappen.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableAssets.map((asset) => (
                    <button
                      key={asset.url}
                      type="button"
                      onClick={() => handleSelectAsset(asset.url)}
                      className="group relative aspect-square bg-[#151517] border border-[#333333] hover:border-[#E6007E] rounded-xl overflow-hidden cursor-pointer p-1.5 transition-all"
                    >
                      <Image
                        src={asset.url}
                        alt={asset.fileName}
                        fill
                        className="object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-[2px] p-1 text-[9px] text-zinc-300 truncate font-mono">
                        {asset.fileName}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {deleteConfirmSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151517] border border-[#333333] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-notch text-white">Bekræft Sletning</h3>
            <p className="text-xs text-zinc-300 font-text">
              Er du sikker på, at du vil slette denne artikel fra det offentlige katalog? Handlingen kan ikke fortrydes.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmSlug(null)}
                className="px-4 py-2 bg-[#202021] hover:bg-[#262628] text-zinc-300 text-xs font-headline font-bold rounded-lg cursor-pointer"
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmSlug)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-headline font-bold rounded-lg cursor-pointer"
              >
                Slet Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
