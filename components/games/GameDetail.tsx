'use client';

import { parseJsonArray, Platform } from '@/lib/types';
import {
  GameDetailHero,
  ScreenshotGallery,
  ProsCons,
  ParentTip,
  PlatformLinks,
} from './GameDetailComponents';

// ============================================================================
// TYPES
// ============================================================================

export interface GameDetailProps {
  game: {
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    type: 'digital' | 'board';
    minAge: number;
    maxAge: number;
    iconUrl?: string | null;
    imageUrl?: string | null;
    rating: number;
    publisher?: string | null;
    developer?: string | null;
    releaseDate?: string | null;
    editorChoice?: boolean;
    // Digital game specific
    platforms?: string;
    appStoreUrl?: string | null;
    playStoreUrl?: string | null;
    websiteUrl?: string | null;
    // Review data
    pros?: string | string[];
    cons?: string | string[];
    parentTip?: string | null;
    screenshots?: string;
    // Categories
    categories?: string;
    skills?: string;
    themes?: string;
  };
}

// ============================================================================
// MAIN GAME DETAIL COMPONENT
// ============================================================================

export function GameDetail({ game }: GameDetailProps) {
  // Parse JSON fields - handle both string arrays (new) and JSON strings (old)
  const parsedPlatforms = game.platforms ? parseJsonArray<Platform>(game.platforms) : [];
  const parsedPros = Array.isArray(game.pros) ? game.pros : (game.pros ? parseJsonArray<string>(game.pros) : []);
  const parsedCons = Array.isArray(game.cons) ? game.cons : (game.cons ? parseJsonArray<string>(game.cons) : []);
  const parsedScreenshots = game.screenshots ? parseJsonArray<string>(game.screenshots) : [];
  const parsedCategories = game.categories ? parseJsonArray<string>(game.categories) : [];
  const parsedSkills = game.skills ? parseJsonArray<string>(game.skills) : [];
  const parsedThemes = game.themes ? parseJsonArray<string>(game.themes) : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="mb-12">
        <GameDetailHero
          title={game.title}
          type={game.type}
          iconUrl={game.iconUrl}
          imageUrl={game.imageUrl}
          minAge={game.minAge}
          maxAge={game.maxAge}
          rating={game.rating}
          publisher={game.publisher}
          releaseDate={game.releaseDate}
          editorChoice={game.editorChoice}
        />
      </section>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Screenshots */}
          {parsedScreenshots.length > 0 && (
            <section>
              <h2 className="font-bold text-xl text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>📸</span>
                <span>Screenshots</span>
              </h2>
              <ScreenshotGallery screenshots={parsedScreenshots} title={game.title} />
            </section>
          )}

          {/* Description */}
          <section>
            <h2 className="font-bold text-xl text-[#4A4A4A] mb-4 flex items-center gap-2">
              <span>📝</span>
              <span>Om spillet</span>
            </h2>
            <div className="bg-[#FFFCF7] rounded-3xl p-6 shadow-sm">
              <p className="text-[#4A4A4A] leading-relaxed whitespace-pre-line">{game.description}</p>
            </div>
          </section>

          {/* Pros & Cons */}
          {(parsedPros.length > 0 || parsedCons.length > 0) && (
            <section>
              <h2 className="font-bold text-xl text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>⚖️</span>
                <span>Fordele og ulemper</span>
              </h2>
              <ProsCons pros={parsedPros} cons={parsedCons} />
            </section>
          )}

          {/* Parent Tip */}
          {game.parentTip && (
            <section>
              <ParentTip tip={game.parentTip} />
            </section>
          )}

          {/* Categories & Tags */}
          {(parsedCategories.length > 0 || parsedSkills.length > 0 || parsedThemes.length > 0) && (
            <section>
              <h2 className="font-bold text-xl text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span>🏷️</span>
                <span>Kategorier og tags</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {parsedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-2 bg-[#A2D2FF]/30 text-[#1D4E89] rounded-full text-sm font-semibold"
                  >
                    {cat}
                  </span>
                ))}
                {parsedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-[#BAFFC9]/30 text-[#2D6A4F] rounded-full text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
                {parsedThemes.map((theme) => (
                  <span
                    key={theme}
                    className="px-4 py-2 bg-[#CDB4DB]/30 text-[#5B4670] rounded-full text-sm font-semibold"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Download Links (for digital games) */}
          {game.type === 'digital' && parsedPlatforms.length > 0 && (
            <section>
              <PlatformLinks
                platforms={parsedPlatforms}
                appStoreUrl={game.appStoreUrl}
                playStoreUrl={game.playStoreUrl}
                websiteUrl={game.websiteUrl}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
