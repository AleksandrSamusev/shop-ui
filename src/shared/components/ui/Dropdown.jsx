import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function Dropdown({
    value,
    options = [],
    placeholder = "Select...",
    onChange,
    className = "",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const ref = useRef(null);

    const selectedIndex = options.findIndex((o) => o.value === value);
    const selected = options[selectedIndex];

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < options.length - 1 ? prev + 1 : 0
                );
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : options.length - 1
                );
            }

            if (e.key === "Enter") {
                e.preventDefault();
                const option = options[highlightedIndex];
                if (option) {
                    onChange(option.value);
                    setIsOpen(false);
                }
            }

            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, highlightedIndex, options, onChange]);

    // Sync highlighted with selected
    useEffect(() => {
        if (selectedIndex >= 0) {
            setHighlightedIndex(selectedIndex);
        }
    }, [selectedIndex]);

    return (
        <div
            ref={ref}
            className={`relative ${className}`}
            role="combobox"
            aria-expanded={isOpen}
        >
            {/* BUTTON */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full h-[48px] bg-slate-950 border border-slate-800 rounded-2xl px-4 flex items-center justify-between text-[10px] font-bold text-white uppercase tracking-widest hover:border-blue-500/50 transition-all"
            >
                <span className="truncate">
                    {selected?.label || placeholder}
                </span>

                <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* MENU */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                        {options.map((opt, index) => {
                            const isSelected = value === opt.value;
                            const isHighlighted = index === highlightedIndex;

                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-[10px] font-bold rounded-xl transition-colors uppercase tracking-widest flex items-center justify-between
                    ${isSelected
                                            ? "bg-blue-600 text-white"
                                            : isHighlighted
                                                ? "bg-slate-800 text-white"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    {opt.label}
                                    {isSelected && <Check size={12} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}