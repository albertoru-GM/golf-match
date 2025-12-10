import Link from "next/link";
import { MapPin, Calendar, TrendingUp, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <nav className="relative container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-green-800 font-bold text-xl">⛳</span>
            </div>
            <span className="text-2xl font-bold">GolfMatch</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link href="/courses" className="hover:text-yellow-300 transition-colors">
              Campos
            </Link>
            <Link href="/stats" className="hover:text-yellow-300 transition-colors">
              Estadísticas
            </Link>
            <Link href="/profile" className="hover:text-yellow-300 transition-colors">
              Perfil
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link href="/login" className="px-4 py-2 text-white hover:text-yellow-300 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/login" className="px-6 py-2 bg-yellow-400 text-green-900 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105">
              Registrarse
            </Link>
          </div>
        </nav>

        <div className="relative container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              El Playtomic del Golf en España
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              Reserva tee times, mejora tu juego y conecta con golfistas de tu nivel
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/courses" className="px-8 py-4 bg-yellow-400 text-green-900 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg text-center">
                Explorar Campos
              </Link>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                Ver Cómo Funciona
              </button>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          ¿Por qué GolfMatch?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Campos en España</h3>
            <p className="text-gray-600">
              Accede a los mejores campos de golf en toda España. Reserva fácilmente tu tee time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Award className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Golf Rating</h3>
            <p className="text-gray-600">
              Sistema único de rating 0-10 además del handicap tradicional para mejor matchmaking.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Estadísticas</h3>
            <p className="text-gray-600">
              Guarda y analiza tus rondas. Sigue tu progreso y mejora tu juego.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Clases de Golf</h3>
            <p className="text-gray-600">
              Reserva clases con profesionales. Mejora tu técnica con los mejores instructores.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para tu próxima ronda?
            </h2>
            <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
              Únete a GolfMatch hoy y descubre una nueva forma de disfrutar el golf
            </p>
            <Link href="/login" className="px-10 py-4 bg-yellow-400 text-green-900 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl inline-block">
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-green-800 font-bold">⛳</span>
              </div>
              <span className="text-xl font-bold text-white">GolfMatch</span>
            </div>

            <div className="text-center md:text-right">
              <p>&copy; 2025 GolfMatch. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
