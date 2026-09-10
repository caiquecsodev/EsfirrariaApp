export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 to-orange-500 lg:flex">
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
          <svg
            viewBox="0 0 200 200"
            className="h-64 w-64 drop-shadow-lg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="100" cy="178" rx="70" ry="8" fill="#000" fillOpacity="0.12" />
            <path
              d="M40 120c0-33 27-60 60-60s60 27 60 60c0 8-6 14-14 14H54c-8 0-14-6-14-14Z"
              fill="#F5D9A8"
            />
            <path
              d="M40 120c0-33 27-60 60-60s60 27 60 60"
              stroke="#C97B2E"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M52 108c6-22 24-38 48-38s42 16 48 38"
              stroke="#fff"
              strokeOpacity="0.5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 10"
            />
            <circle cx="78" cy="96" r="4" fill="#8B4513" />
            <circle cx="100" cy="88" r="4" fill="#8B4513" />
            <circle cx="122" cy="96" r="4" fill="#8B4513" />
            <circle cx="90" cy="106" r="4" fill="#8B4513" />
            <circle cx="112" cy="106" r="4" fill="#8B4513" />
          </svg>

          <div>
            <h2 className="text-3xl font-bold text-white">Esfirraria 🥙</h2>
            <p className="mt-2 max-w-xs text-sm text-white/90">
              O sabor que você ama, a poucos cliques de distância.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
