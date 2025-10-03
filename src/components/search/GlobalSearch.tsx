/** @format */

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { useFamilyStore } from "@/stores/crud/familyStore";
import { useBirdStore } from "@/stores/crud/birdStore";
import { useImageStore } from "@/stores/crud/imageStore";
import { useSoundStore } from "@/stores/crud/soundStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Loading } from "../ui/Loading";
import { FamilyCard } from "../family/FamilyCard";
import { BirdCard } from "../bird/BirdCard";
import { ImageCard } from "../image/ImageCard";
import { SoundCard } from "../sound/SoundCard";

interface SearchResult {
  type: "family" | "bird" | "image" | "sound";
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  data: any;
}

export const GlobalSearch: React.FC = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<
    "all" | "family" | "bird" | "image" | "sound"
  >("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Store hooks
  const {
    families,
    fetchFamilies,
    loading: familiesLoading,
  } = useFamilyStore();
  const { birds, fetchBirds, loading: birdsLoading } = useBirdStore();
  const { images, fetchImages, loading: imagesLoading } = useImageStore();
  const { sounds, fetchSounds, loading: soundsLoading } = useSoundStore();

  console.log({ images });

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search in families
      if (searchType === "all" || searchType === "family") {
        await fetchFamilies({ search: searchQuery });
        families.forEach((family) => {
          if (
            family.family_nm
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            family.description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            searchResults.push({
              type: "family",
              id: family.id,
              title: family.family_nm,
              description: family.description,
              data: family,
            });
          }
        });
      }

      // Search in birds
      if (searchType === "all" || searchType === "bird") {
        await fetchBirds({ search: searchQuery });
        birds.forEach((bird) => {
          if (
            bird.bird_nm.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bird.scientific_nm
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (bird.description &&
              bird.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            bird.habitat.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            searchResults.push({
              type: "bird",
              id: bird.id,
              title: bird.bird_nm,
              subtitle: bird.scientific_nm,
              description: bird.description || bird.habitat,
              data: bird,
            });
          }
        });
      }

      // Search in images (would search by bird name or metadata)
      if (searchType === "all" || searchType === "image") {
        // This would typically search image metadata or associated bird names
        // For now, we'll do a simple search
        await fetchImages();
        // Images don't have searchable text content, so we might search by related bird names
      }

      // Search in sounds
      if (searchType === "all" || searchType === "sound") {
        await fetchSounds({ search: searchQuery });
        sounds.forEach((sound) => {
          if (
            sound.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sound.description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            searchResults.push({
              type: "sound",
              id: sound.id,
              title: `Recording from ${sound.location}`,
              description: sound.description,
              data: sound,
            });
          }
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearchType("all");
  };

  const getResultsByType = (type: string) => {
    return results.filter((result) => result.type === type);
  };

  const isLoading =
    isSearching ||
    familiesLoading ||
    birdsLoading ||
    imagesLoading ||
    soundsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search</h1>
          <p className="text-gray-600">
            Find families, birds, images, and sounds
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search for families, birds, images, or sounds..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="primary" loading={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
            {(query || results.length > 0) && (
              <Button type="button" variant="ghost" onClick={clearSearch}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="border-t pt-4">
              <Select
                label="Tipe Pencarian"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                options={[
                  { value: "all", label: "Semua Tipe" },
                  { value: "family", label: "Hanya Keluarga" },
                  { value: "bird", label: "Hanya Burung" },
                  { value: "image", label: "Hanya Gambar" },
                  { value: "sound", label: "Hanya Suara" },
                ]}
              />
            </div>
          )}
        </form>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Mencari..." />
        </div>
      ) : query && results.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak ada hasil ditemukan
          </h3>
          <p className="text-gray-600 mb-4">
            Tidak ada yang cocok untuk &quot;{query}&quot;. Coba kata kunci lain atau
            cari di semua tipe.
          </p>
          <Button variant="outline" onClick={() => setSearchType("all")}>
            Cari Semua Tipe
          </Button>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-8">
          {/* Results Summary */}
          <div className="bg-base-100 rounded-lg shadow-md p-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="font-medium">
                Ditemukan {results.length} hasil untuk &quot;{query}&quot;
              </span>
              <div className="flex gap-4 text-gray-600">
                {getResultsByType("family").length > 0 && (
                  <span>{getResultsByType("family").length} Keluarga</span>
                )}
                {getResultsByType("bird").length > 0 && (
                  <span>{getResultsByType("bird").length} Burung</span>
                )}
                {getResultsByType("image").length > 0 && (
                  <span>{getResultsByType("image").length} Gambar</span>
                )}
                {getResultsByType("sound").length > 0 && (
                  <span>{getResultsByType("sound").length} Suara</span>
                )}
              </div>
            </div>
          </div>

          {/* Families Results */}
          {getResultsByType("family").length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Keluarga ({getResultsByType("family").length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getResultsByType("family").map((result) => (
                  <FamilyCard
                    key={result.id}
                    family={result.data}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onViewBirds={() => {}}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Birds Results */}
          {getResultsByType("bird").length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Burung ({getResultsByType("bird").length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getResultsByType("bird").map((result) => (
                  <BirdCard
                    key={result.id}
                    bird={result.data}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onViewImages={() => {}}
                    onViewSounds={() => {}}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Images Results */}
          {getResultsByType("image").length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Gambar ({getResultsByType("image").length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {getResultsByType("image").map((result) => (
                  <ImageCard
                    key={result.id}
                    image={result.data}
                    onView={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sounds Results */}
          {getResultsByType("sound").length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Suara ({getResultsByType("sound").length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getResultsByType("sound").map((result) => (
                  <SoundCard
                    key={result.id}
                    sound={result.data}
                    onView={() => {}}
                    onDelete={() => {}}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
