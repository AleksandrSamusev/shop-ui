import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
    const [position, setPosition] = useState(null);

    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const selectedIndex = options.findIndex((o) => o.value === value);
    const selected = options[selectedIndex];

    const OFFSET = 6;

    // 🔥 POSITION CALCULATION (REAL HEIGHT)
    const updatePosition = () => {
        if (!buttonRef.current || !dropdownRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();

        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < dropdownRect.height + OFFSET;

        setPosition({
            top: openUp
                ? rect.top - dropdownRect.height - OFFSET
                : rect.bottom + OFFSET,
            left: rect.left,
            width: rect.width,
        });
    };

    // Toggle
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // 🔥 Wait for render, then measure
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => {
                updatePosition();
            });
        }
    }, [isOpen]);

    // 🔥 Recalculate on scroll/resize
    useEffect(() => {
        if (!isOpen) return;

        const handler = () => updatePosition();

        window.addEventListener("scroll", handler, true);
        window.addEventListener("resize", handler);

        return () => {
            window.removeEventListener("scroll", handler, true);
            window.removeEventListener("resize", handler);
        };
    }, [isOpen]);

    // Close outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(e.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
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
        return () =>
            window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, highlightedIndex, options, onChange]);

    // Sync highlighted with selected
    useEffect(() => {
        if (selectedIndex >= 0) {
            setHighlightedIndex(selectedIndex);
        }
    }, [selectedIndex]);

    return (
        <>
            {/* BUTTON */}
            <div className={`relative ${className}`}>
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={toggleDropdown}
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
            </div>

            {/* 🔥 PORTAL DROPDOWN */}
            {isOpen &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: "fixed",
                            top: position?.top ?? 0,
                            left: position?.left ?? 0,
                            width: position?.width ?? "auto",
                            zIndex: 9999,
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="max-h-[220px] overflow-y-auto custom-scrollbar p-2">
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
                                        className={`w-full px-4 py-3 text-left text-[10px] font-bold rounded-xl transition-all uppercase tracking-widest flex items-center justify-between
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
                    </div>,
                    document.body
                )}
        </>
    );
}