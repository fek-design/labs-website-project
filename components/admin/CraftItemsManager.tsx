"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CraftItemData,
  CampusKey,
  LabSlug,
  CANONICAL_CRAFT_CATEGORIES,
  STANDARD_CRAFT_TAGS,
} from "@/lib/craft-data";
import {
  getCraftArticles,
  saveCraftArticle,
  deleteCraftArticle,
  uploadCraftImage,
  getAvailableCraftAssets,
  CraftAssetItem,
} from "@/app/actions/crafts";

export function CraftItemsManager() {
  const [items, setItems] = useState<CraftItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCampus, setFilterCampus] = useState<CampusKey | "all">("all");
  const [filterLab, setFilterLab] = useState<LabSlug | "all">("all");

  // Modal / Form state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Asset Library Modal State
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [targetImageField, setTargetImageField] = useState<"thumbnailImage" | "heroImage" | null>(null);
  const [availableAssets, setAvailableAssets] = useState<CraftAssetItem[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [assetFolderFilter, setAssetFolderFilter] = useState<"all" | "craft" | "landing">("all");
  const [assetSearchQuery, setAssetSearchQuery] = useState("");

  const thumbFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [formData, setFormData] = useState<CraftItemData>({
    slug: "",
    title: "",
    category: CANONICAL_CRAFT_CATEGORIES[0],
    tags: [],
    campuses: ["køge", "roskilde"],
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
      materials: "",
      estimatedTime: "Estimeret tid: 15-30 minutter",
      difficulty: "Begynder-venligt",
    },
    processes: [],
    inspiration: [],
    manuals: [],
  });

  const [tagInput, setTagInput] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCraftArticles();
      setItems(data);
    } catch (err) {
      console.error("Failed to load craft items:", err);
      setFeedback({ message: "Kunne ikke indlæse data.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAssetPicker = async (field: "thumbnailImage" | "heroImage") => {
    setTargetImageField(field);
    setShowAssetModal(true);
    setLoadingAssets(true);
    try {
      const assets = await getAvailableCraftAssets();
      setAvailableAssets(assets);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setFeedback({ message: "Kunne ikke indlæse billedbibliotek.", type: "error" });
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleFileUpload = async (file: File, field?: "thumbnailImage" | "heroImage") => {
    const target = field || targetImageField || "thumbnailImage";
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadCraftImage(fd);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, [target]: res.url! }));
        setFeedback({ message: `Billedet blev uploadet og valgt! (${res.url})`, type: "success" });
        if (showAssetModal) {
          setShowAssetModal(false);
        }
      } else {
        setFeedback({ message: res.error || "Fejl ved upload.", type: "error" });
      }
    } catch (err: any) {
      setFeedback({ message: err.message || "Upload fejlede.", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const openNewItemModal = () => {
    setFormData({
      slug: "",
      title: "",
      category: CANONICAL_CRAFT_CATEGORIES[0],
      tags: ["prototype", "maker"],
      campuses: ["køge", "roskilde"],
      labs: ["makerspace"],
      heroImage: "/images/landing/showcase-3dprint.jpg",
      thumbnailImage: "/images/landing/showcase-3dprint.jpg",
      locations: [
        {
          name: "Makerspace (Køge)",
          campus: "køge",
          hours: "Åbent Onsdag 14-17",
          labSlug: "makerspace",
        },
      ],
      prerequisites: {
        materials: "Materialer stilles til rådighed",
        estimatedTime: "Estimeret tid: 20-40 minutter",
        difficulty: "Begynder-venligt",
      },
      processes: [],
      inspiration: [],
      manuals: [],
    });
    setTagInput("prototype, maker");
    setIsEditing(true);
  };

  const openEditModal = (item: CraftItemData) => {
    setFormData({ ...item });
    setTagInput(item.tags.join(", "));
    setIsEditing(true);
  };

  const togglePresetTag = (tag: string) => {
    const currentTags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const lowerTag = tag.toLowerCase();
    let updated: string[];
    if (currentTags.includes(lowerTag)) {
      updated = currentTags.filter((t) => t !== lowerTag);
    } else {
      updated = [...currentTags, lowerTag];
    }
    setTagInput(updated.join(", "));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const isNew = !items.some((i) => i.slug === formData.slug);
    const slug = isNew
      ? title
          .toLowerCase()
          .replace(/[æøå]/g, (match) => (match === "æ" ? "ae" : match === "ø" ? "oe" : "aa"))
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : formData.slug;

    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug.trim() || !formData.title.trim()) {
      setFeedback({ message: "Titel og slug skal udfyldes.", type: "error" });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const updatedData: CraftItemData = {
      ...formData,
      tags: parsedTags,
    };

    try {
      const res = await saveCraftArticle(updatedData);
      if (res.success) {
        setFeedback({ message: `Artiklen "${formData.title}" blev gemt!`, type: "success" });
        setIsEditing(false);
        await loadData();
      } else {
        setFeedback({ message: res.error || "Fejl ved gemning.", type: "error" });
      }
    } catch (err: any) {
      setFeedback({ message: err.message || "Uventet fejl.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const res = await deleteCraftArticle(slug);
      if (res.success) {
        setFeedback({ message: "Artiklen er blevet slettet.", type: "success" });
        setDeleteConfirmSlug(null);
        await loadData();
      } else {
        setFeedback({ message: res.error || "Kunne ikke slette.", type: "error" });
      }
    } catch (err: any) {
      setFeedback({ message: err.message || "Fejl ved sletning.", type: "error" });
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterCampus !== "all" && !item.campuses.includes(filterCampus)) return false;
      if (filterLab !== "all" && !item.labs.includes(filterLab)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCategory && !matchesTags) return false;
      }
      return true;
    });
  }, [items, filterCampus, filterLab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`p-4 border rounded-none flex items-center justify-between text-xs font-mono ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
              : "bg-rose-950/40 border-rose-500/50 text-rose-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="hover:underline cursor-pointer"
          >
            Luk ✕
          </button>
        </div>
      )}

      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#141414] border border-[#262626] p-5 rounded-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E6007E]" />
            <h2 className="font-extrabold text-lg text-white tracking-tight uppercase">
              Crafts & Prototype Artikler
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Administrer offentlige vejledninger, prototyper og blogartikler vist på /katalog og /craft/[slug].
          </p>
        </div>

        <button
          type="button"
          onClick={openNewItemModal}
          className="px-4 py-2 bg-[#009FE3] hover:bg-[#0080BA] text-black font-bold text-xs uppercase rounded-none transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-[#009FE3]/20"
        >
          <span>+ Opret Ny Artikel</span>
        </button>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0D0D0D] border border-[#262626] p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Søg i titel, kategori eller tags..."
          className="bg-[#171717] border border-zinc-800 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#009FE3]"
        />

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Campus:</span>
          <select
            value={filterCampus}
            onChange={(e) => setFilterCampus(e.target.value as any)}
            className="bg-[#171717] border border-zinc-800 px-2 py-1.5 text-xs text-white flex-1 focus:outline-none"
          >
            <option value="all">Alle Campuser</option>
            <option value="køge">Køge</option>
            <option value="roskilde">Roskilde</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Lab:</span>
          <select
            value={filterLab}
            onChange={(e) => setFilterLab(e.target.value as any)}
            className="bg-[#171717] border border-zinc-800 px-2 py-1.5 text-xs text-white flex-1 focus:outline-none"
          >
            <option value="all">Alle Labs</option>
            <option value="makerspace">Makerspace</option>
            <option value="medialab">Medialab</option>
            <option value="dimselab">Dimselab</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-[#262626] bg-[#0A0A0A] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#141414] border-b border-[#262626] text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="p-3 w-16">Preview</th>
              <th className="p-3">Titel & Slug</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Campuses & Labs</th>
              <th className="p-3">Tags</th>
              <th className="p-3 text-right">Handlinger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  Indlæser artikler...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  Ingen artikler fundet matching søgekriterier.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.slug} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-3">
                    <div className="relative w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.thumbnailImage || item.heroImage}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="text-zinc-500 text-[11px]">/craft/{item.slug}</div>
                  </td>
                  <td className="p-3">
                    <span className="text-zinc-300">{item.category}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {item.campuses.map((c) => (
                        <span
                          key={c}
                          className="px-1.5 py-0.5 text-[9px] uppercase bg-zinc-800 text-zinc-300 border border-zinc-700"
                        >
                          {c}
                        </span>
                      ))}
                      {item.labs.map((l) => (
                        <span
                          key={l}
                          className="px-1.5 py-0.5 text-[9px] uppercase bg-[#009FE3]/20 text-[#009FE3] border border-[#009FE3]/40"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800"
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 4 && (
                        <span className="text-[9px] text-zinc-500">+{item.tags.length - 4}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/craft/${item.slug}`}
                      target="_blank"
                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-[10px] uppercase transition-colors"
                    >
                      Se live ↗
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="px-2 py-1 bg-[#FFED00] hover:bg-amber-400 text-black border border-[#FFED00] text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Rediger
                    </button>
                    {deleteConfirmSlug === item.slug ? (
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.slug)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase cursor-pointer"
                        >
                          Bekræft!
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmSlug(null)}
                          className="px-1.5 py-1 text-[10px] text-zinc-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmSlug(item.slug)}
                        className="px-2 py-1 bg-zinc-900 hover:bg-rose-950/60 hover:text-rose-300 border border-zinc-800 hover:border-rose-800/80 text-zinc-400 text-[10px] uppercase transition-colors cursor-pointer"
                      >
                        Slet
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#262626] max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto rounded-none text-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="font-extrabold text-white text-base uppercase">
                {items.some((i) => i.slug === formData.slug)
                  ? `Rediger: ${formData.title}`
                  : "Opret Ny Prototype Artikel"}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-zinc-400 hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-1 font-bold">
                    Titel *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="f.eks. T-SHIRT"
                    className="w-full bg-[#1C1C1C] border border-zinc-800 px-3 py-2 text-white focus:outline-none focus:border-[#009FE3]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-1 font-bold">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                    placeholder="f.eks. t-shirt"
                    className="w-full bg-[#1C1C1C] border border-zinc-800 px-3 py-2 text-white focus:outline-none focus:border-[#009FE3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-1 font-bold">
                  Kategori * (Låst Fagdisciplin)
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-zinc-800 px-3 py-2 text-white focus:outline-none focus:border-[#009FE3] cursor-pointer"
                >
                  {CANONICAL_CRAFT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Standardiseret for at undgå fragmenterede og duplikerede kategorier i kataloget.
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] font-bold">
                    Tags (adskilt med komma)
                  </label>
                  <span className="text-[10px] text-zinc-500">Klik på hurtig-tags for at tilføje</span>
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="f.eks. tekstil, merch, folie, print"
                  className="w-full bg-[#1C1C1C] border border-zinc-800 px-3 py-2 text-white focus:outline-none focus:border-[#009FE3]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {STANDARD_CRAFT_TAGS.map((tag) => {
                    const currentTags = tagInput
                      .split(",")
                      .map((t) => t.trim().toLowerCase())
                      .filter((t) => t.length > 0);
                    const isSelected = currentTags.includes(tag.toLowerCase());
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => togglePresetTag(tag)}
                        className={`px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-[#009FE3] border-[#009FE3] text-black font-bold"
                            : "bg-[#181818] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-1 font-bold">
                    Campuses
                  </label>
                  <div className="flex gap-4 pt-1">
                    {(["køge", "roskilde"] as CampusKey[]).map((c) => (
                      <label key={c} className="flex items-center gap-2 text-zinc-300 capitalize cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.campuses.includes(c)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, campuses: [...formData.campuses, c] });
                            } else {
                              setFormData({
                                ...formData,
                                campuses: formData.campuses.filter((x) => x !== c),
                              });
                            }
                          }}
                        />
                        <span>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-1 font-bold">
                    Labs
                  </label>
                  <div className="flex gap-3 pt-1">
                    {(["makerspace", "medialab", "dimselab"] as LabSlug[]).map((l) => (
                      <label key={l} className="flex items-center gap-1.5 text-zinc-300 capitalize cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.labs.includes(l)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, labs: [...formData.labs, l] });
                            } else {
                              setFormData({
                                ...formData,
                                labs: formData.labs.filter((x) => x !== l),
                              });
                            }
                          }}
                        />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-1 font-bold">
                    Sværhedsgrad
                  </label>
                  <select
                    value={formData.prerequisites.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prerequisites: { ...formData.prerequisites, difficulty: e.target.value },
                      })
                    }
                    className="w-full bg-[#1C1C1C] border border-zinc-800 px-2 py-2 text-white focus:outline-none"
                  >
                    <option value="Begynder-venligt">Begynder-venligt</option>
                    <option value="Let øvet">Let øvet</option>
                    <option value="Avanceret">Avanceret</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-1 font-bold">
                    Estimeret tid
                  </label>
                  <input
                    type="text"
                    value={formData.prerequisites.estimatedTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prerequisites: { ...formData.prerequisites, estimatedTime: e.target.value },
                      })
                    }
                    placeholder="f.eks. Estimeret tid: 15-45 minutter"
                    className="w-full bg-[#1C1C1C] border border-zinc-800 px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-1 font-bold">
                  Materialer & Forudsætninger
                </label>
                <input
                  type="text"
                  value={formData.prerequisites.materials}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prerequisites: { ...formData.prerequisites, materials: e.target.value },
                    })
                  }
                  placeholder="f.eks. Medbring egen bomuld/polyester eller køb i lab"
                  className="w-full bg-[#1C1C1C] border border-zinc-800 px-3 py-2 text-white focus:outline-none"
                />
              </div>

              {/* Media Management */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#262626] pt-4">
                {/* Thumbnail Image Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-zinc-400 uppercase tracking-widest text-[10px] font-bold">
                      Katalog Thumbnail Billede
                    </label>
                  </div>
                  <div className="flex gap-3 items-start bg-[#171717] border border-zinc-800 p-2.5">
                    <div className="relative w-16 h-16 bg-zinc-900 border border-zinc-700 shrink-0 overflow-hidden flex items-center justify-center">
                      {formData.thumbnailImage ? (
                        <Image
                          src={formData.thumbnailImage}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-[9px] text-zinc-500 uppercase">Intet</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <input
                        type="text"
                        value={formData.thumbnailImage || ""}
                        onChange={(e) => setFormData({ ...formData, thumbnailImage: e.target.value })}
                        placeholder="/images/landing/carousel-tshirt.png"
                        className="w-full bg-[#121212] border border-zinc-800 px-2 py-1 text-[11px] text-zinc-300 truncate focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openAssetPicker("thumbnailImage")}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-[#009FE3] hover:text-black text-white text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-zinc-700"
                        >
                          Vælg fra bibliotek
                        </button>
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => thumbFileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-[#E6007E] hover:text-white text-zinc-300 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-zinc-700 disabled:opacity-50"
                        >
                          {isUploading ? "Uploader..." : "Upload fil"}
                        </button>
                        <input
                          ref={thumbFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "thumbnailImage");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Image Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-zinc-400 uppercase tracking-widest text-[10px] font-bold">
                      Artikel Hero Banner Billede
                    </label>
                  </div>
                  <div className="flex gap-3 items-start bg-[#171717] border border-zinc-800 p-2.5">
                    <div className="relative w-16 h-16 bg-zinc-900 border border-zinc-700 shrink-0 overflow-hidden flex items-center justify-center">
                      {formData.heroImage ? (
                        <Image
                          src={formData.heroImage}
                          alt="Hero preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-[9px] text-zinc-500 uppercase">Intet</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <input
                        type="text"
                        value={formData.heroImage || ""}
                        onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                        placeholder="/images/craft/hero-tshirts.png"
                        className="w-full bg-[#121212] border border-zinc-800 px-2 py-1 text-[11px] text-zinc-300 truncate focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openAssetPicker("heroImage")}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-[#009FE3] hover:text-black text-white text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-zinc-700"
                        >
                          Vælg fra bibliotek
                        </button>
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => heroFileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-[#E6007E] hover:text-white text-zinc-300 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-zinc-700 disabled:opacity-50"
                        >
                          {isUploading ? "Uploader..." : "Upload fil"}
                        </button>
                        <input
                          ref={heroFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "heroImage");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-300 hover:text-white cursor-pointer uppercase text-xs"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#009FE3] hover:bg-[#0080BA] text-black font-bold uppercase text-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Gemmer..." : "Gem Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visual Asset Library Picker Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] max-w-3xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col rounded-none text-xs font-mono">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#009FE3]" />
                  Billedbibliotek
                </h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Vælg et eksisterende foto med 1 klik eller upload et nyt direkte til labbet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssetModal(false)}
                className="text-zinc-400 hover:text-white text-base cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Filter and Upload Toolbar */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center bg-[#0D0D0D] border border-zinc-800 p-2.5">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={assetSearchQuery}
                  onChange={(e) => setAssetSearchQuery(e.target.value)}
                  placeholder="Søg filnavn..."
                  className="bg-[#181818] border border-zinc-700 px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#009FE3] flex-1 max-w-xs"
                />
                <div className="flex border border-zinc-800">
                  {(["all", "craft", "landing"] as const).map((folder) => (
                    <button
                      key={folder}
                      type="button"
                      onClick={() => setAssetFolderFilter(folder)}
                      className={`px-2 py-1 text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                        assetFolderFilter === folder
                          ? "bg-zinc-700 text-white"
                          : "bg-[#181818] text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {folder === "all" ? "Alle" : folder}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => modalFileInputRef.current?.click()}
                  className="w-full sm:w-auto px-3 py-1 bg-[#E6007E] hover:bg-[#C5006C] text-white text-xs font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>⬆ Upload Billede</span>
                </button>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </div>
            </div>

            {/* Assets Gallery Grid */}
            <div className="flex-1 overflow-y-auto min-h-[300px] border border-zinc-800 p-3 bg-[#0A0A0A]">
              {loadingAssets ? (
                <div className="h-full flex items-center justify-center text-zinc-500 py-12">
                  Indlæser billeder fra serveren...
                </div>
              ) : availableAssets.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500 py-12">
                  Ingen billeder fundet i mappen.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableAssets
                    .filter((a) => {
                      if (assetFolderFilter !== "all" && a.folder !== assetFolderFilter) return false;
                      if (assetSearchQuery.trim()) {
                        return a.fileName.toLowerCase().includes(assetSearchQuery.toLowerCase());
                      }
                      return true;
                    })
                    .map((asset) => (
                      <div
                        key={asset.url}
                        onClick={() => {
                          if (targetImageField) {
                            setFormData((prev) => ({ ...prev, [targetImageField]: asset.url }));
                            setFeedback({ message: `Billede valgt: ${asset.fileName}`, type: "success" });
                          }
                          setShowAssetModal(false);
                        }}
                        className="group bg-[#141414] border border-zinc-800 hover:border-[#009FE3] p-2 flex flex-col gap-2 cursor-pointer transition-all hover:bg-zinc-900/60"
                      >
                        <div className="relative aspect-video bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center">
                          <Image
                            src={asset.url}
                            alt={asset.fileName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            unoptimized
                          />
                          <span className="absolute top-1 right-1 bg-black/75 px-1 py-0.5 text-[8px] text-zinc-400 uppercase font-mono">
                            {asset.folder}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-zinc-300 truncate font-mono" title={asset.fileName}>
                            {asset.fileName}
                          </p>
                          <span className="text-[9px] text-[#009FE3] group-hover:underline">
                            Vælg dette ↵
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-[#262626]">
              <span className="text-[10px] text-zinc-500">
                {availableAssets.length} tilgængelige billeder
              </span>
              <button
                type="button"
                onClick={() => setShowAssetModal(false)}
                className="px-3 py-1.5 border border-zinc-700 text-zinc-300 hover:text-white uppercase text-xs cursor-pointer"
              >
                Luk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

