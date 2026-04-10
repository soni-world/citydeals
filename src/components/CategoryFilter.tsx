"use client";

const CATEGORIES = [
  { key: "All", icon: "\uD83D\uDD0D" },
  { key: "Electronics", icon: "\uD83D\uDCF1" },
  { key: "Furniture", icon: "\uD83E\uDE91" },
  { key: "Vehicles", icon: "\uD83D\uDE97" },
  { key: "Real Estate", icon: "\uD83C\uDFE0" },
  { key: "Clothing", icon: "\uD83D\uDC55" },
  { key: "Books", icon: "\uD83D\uDCDA" },
  { key: "Sports", icon: "\u26BD" },
  { key: "Grocery Store", icon: "\uD83D\uDED2" },
  { key: "Home & Garden", icon: "\uD83C\uDF3F" },
  { key: "Services", icon: "\uD83D\uDD27" },
  { key: "Jobs", icon: "\uD83D\uDCBC" },
  { key: "General", icon: "\uD83D\uDCE6" },
];

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
  dealCounts: Record<string, number>;
}

export default function CategoryFilter({ selected, onChange, dealCounts }: CategoryFilterProps) {
  const total = Object.values(dealCounts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map(({ key, icon }) => {
        const count = key === "All" ? total : (dealCounts[key] || 0);
        const isActive = selected === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
              isActive
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : count > 0
                  ? "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                  : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
            }`}
          >
            <span className="text-[11px]">{icon}</span>
            {key}
            {count > 0 && (
              <span className={`text-[10px] min-w-[16px] h-4 flex items-center justify-center rounded-full ${
                isActive ? "bg-indigo-500 text-indigo-100" : "bg-gray-100 text-gray-500"
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
