import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, PlusSquare, UserCircle, Search, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { searchUsers } from "../api/ProfileApi";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    // Search dropdown state
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Used to close the dropdown when clicking outside the search bar
    const searchBoxRef = useRef(null);

    // Pressing Enter: the dropdown already shows results as you type,
    // so just stop the page from reloading.
    const handleSearch = (e) => {
        e.preventDefault();
    };

    // ================= SEARCH AS YOU TYPE =================
    // Waits 300ms after the last key press, then calls the backend.

    useEffect(() => {

        const text = search.trim();

        if (!text) {
            setResults([]);
            setSearching(false);
            return;
        }

        let cancelled = false;

        const timer = setTimeout(async () => {

            try {

                setSearching(true);

                const data = await searchUsers(text);

                if (!cancelled) {
                    setResults(Array.isArray(data) ? data : []);
                }

            } catch (error) {

                console.error("Search failed:", error);

                if (!cancelled) setResults([]);

            } finally {

                if (!cancelled) setSearching(false);

            }

        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };

    }, [search]);

    // ================= CLOSE DROPDOWN ON OUTSIDE CLICK =================

    useEffect(() => {

        const handleClickOutside = (e) => {
            if (
                searchBoxRef.current &&
                !searchBoxRef.current.contains(e.target)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    // ================= OPEN A USER'S PROFILE =================

    const openUser = (user) => {
        const id = user.userId ?? user.id;

        setShowResults(false);
        setSearch("");
        setResults([]);

        navigate(`/profile/${id}`);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-600 shrink-0"
                >
                    ProfileHub
                </Link>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="flex-1 max-w-md"
                >
                    <div className="relative" ref={searchBoxRef}>

                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setShowResults(true);
                            }}
                            onFocus={() => setShowResults(true)}
                            className="w-full bg-gray-100 rounded-full
                                       py-2 pl-10 pr-4
                                       outline-none
                                       focus:ring-2 focus:ring-blue-500
                                       focus:bg-white"
                        />

                        {/* Results dropdown */}
                        {showResults && search.trim() && (

                            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">

                                {searching && (
                                    <p className="px-4 py-3 text-sm text-gray-500">
                                        Searching...
                                    </p>
                                )}

                                {!searching && results.length === 0 && (
                                    <p className="px-4 py-3 text-sm text-gray-500">
                                        No users found.
                                    </p>
                                )}

                                {!searching && results.map((user) => {

                                    const name =
                                        user.name || `User ${user.userId ?? user.id}`;

                                    return (
                                        <div
                                            key={user.userId ?? user.id}
                                            onClick={() => openUser(user)}
                                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                                        >

                                            {user.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    alt={name}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">
                                                    {name.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {name}
                                                </p>

                                                {user.bio && (
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {user.bio}
                                                    </p>
                                                )}
                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </div>
                </form>

                {/* Navigation */}
                <div className="flex items-center gap-7 shrink-0">

                    {/* Home */}
                    <Link
                        to="/"
                        className={`flex flex-col items-center gap-1 ${
                            location.pathname === "/"
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                    >
                        <Home size={22} />
                        <span className="text-sm">Home</span>
                    </Link>

                    {/* My Network */}
                    <Link
                        to="/network"
                        className={`flex flex-col items-center gap-1 ${
                            location.pathname === "/network"
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                    >
                        <Users size={22} />
                        <span className="text-sm">My Network</span>
                    </Link>

                    {/* Create Post */}
                   

                    {/* Me */}
                    <Link
                        to="/profile"
                        className={`flex flex-col items-center gap-1 ${
                            location.pathname === "/profile"
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                    >
                        <UserCircle size={22} />
                        <span className="text-sm">Me</span>
                    </Link>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;