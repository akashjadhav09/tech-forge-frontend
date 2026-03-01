import { useState, useRef, useEffect } from "react";

export default function SearchWithDropdown({
    options = [],
    onSearch
}) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(options[0] || "");
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(query, selected);
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="relative hidden lg:flex items-center bg-gray-50 rounded-full px-3 py-1.5 border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-all duration-300"
        >
            {/* Search Icon */}
            <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>

            {/* Input */}
            <input
                type="text"
                placeholder={`Search by ${selected}`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="ml-2 bg-transparent border-none focus:ring-0 text-sm text-gray-600 w-24 focus:w-40 transition-all duration-300 placeholder-gray-400 focus:outline-none"
            />

            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="ml-3 text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
                {selected}
                <svg
                    className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md py-2 w-32 z-50 border border-gray-100">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 ${selected === option
                                ? "bg-gray-100 font-medium"
                                : ""
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}