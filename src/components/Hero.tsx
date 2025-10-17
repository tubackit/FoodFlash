import { Youtube, Facebook, Instagram, Music, Sparkles } from 'lucide-react'
import { Platform } from '../types/recipe'

interface HeroProps {
  onPlatformClick: (platform: Platform) => void
}

const Hero = ({ onPlatformClick }: HeroProps) => {
  return (
    <div className="text-center py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-gray-100 mb-4 bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 bg-clip-text text-transparent">
          🍂 Willkommen bei Food Flash! ⚡
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Speichere deine Lieblingsrezepte von überall und habe sie immer griffbereit!
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
        {/* YouTube Card */}
        <button
          onClick={() => onPlatformClick('youtube')}
          data-test-id="platform-youtube"
          aria-label="YouTube Rezepte anzeigen"
          className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-red-500/30 hover:scale-105 transition-all duration-300 hover:border-red-400 hover:shadow-2xl hover:autumn-glow cursor-pointer"
        >
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <Youtube className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="font-bold text-gray-100 mb-2">YouTube</h3>
          <p className="text-sm text-gray-400">Video-Rezepte speichern</p>
        </button>

        {/* Instagram Card */}
        <button
          onClick={() => onPlatformClick('instagram')}
          data-test-id="platform-instagram"
          aria-label="Instagram Rezepte anzeigen"
          className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-500/30 hover:scale-105 transition-all duration-300 hover:border-pink-400 hover:shadow-2xl cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/30">
            <Instagram className="h-8 w-8 text-pink-400" />
          </div>
          <h3 className="font-bold text-gray-100 mb-2">Instagram</h3>
          <p className="text-sm text-gray-400">Reel-Rezepte sichern</p>
        </button>

        {/* Facebook Card */}
        <button
          onClick={() => onPlatformClick('facebook')}
          data-test-id="platform-facebook"
          aria-label="Facebook Rezepte anzeigen"
          className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-500/30 hover:scale-105 transition-all duration-300 hover:border-blue-400 hover:shadow-2xl cursor-pointer"
        >
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <Facebook className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="font-bold text-gray-100 mb-2">Facebook</h3>
          <p className="text-sm text-gray-400">Posts & Videos merken</p>
        </button>

        {/* TikTok Card */}
        <button
          onClick={() => onPlatformClick('tiktok')}
          data-test-id="platform-tiktok"
          aria-label="TikTok Rezepte anzeigen"
          className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-500/30 hover:scale-105 transition-all duration-300 hover:border-gray-400 hover:shadow-2xl cursor-pointer"
        >
          <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-500/30">
            <Music className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-100 mb-2">TikTok</h3>
          <p className="text-sm text-gray-400">Kurze Rezept-Videos</p>
        </button>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600/80 to-secondary-600/80 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto text-white shadow-2xl border border-primary-500/30 autumn-glow">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-accent-400" />
        <h3 className="text-3xl font-bold mb-4">
          🍂 Starte jetzt mit deiner Rezeptsammlung!
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Klicke auf "📖 Rezepte" in der Navigation oben, um dein erstes Rezept hinzuzufügen.
        </p>
      </div>
    </div>
  )
}

export default Hero

