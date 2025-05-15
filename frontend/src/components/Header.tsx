import { useAuth } from "../hooks/auth.hook";

export default function Header() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  return (
    <header className="top-0 z-10 fixed bg-sky-600 shadow-md w-full text-white">
      <div className="flex justify-between items-center mx-auto px-4 py-3 max-w-7xl">
        <h1 className="font-bold text-xl">Weather App</h1>

        {isAuthenticated ? (
          <span className="text-sm">
            Welcome, <strong>{user?.username}</strong>
          </span>
        ) : (
          <button
            onClick={() => openAuthModal()}
            className="bg-white hover:bg-gray-100 px-4 py-1.5 rounded font-semibold text-blue-600 transition cursor-pointer"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}
