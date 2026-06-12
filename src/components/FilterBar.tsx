import { LayoutGrid, LayoutList, Flame, Clock, UserCheck, SlidersHorizontal } from 'lucide-react';
import { FilterCategory, SortType } from '../types';

interface FilterBarProps {
  category: FilterCategory;
  onCategoryChange: (c: FilterCategory) => void;
  sort: SortType;
  onSortChange: (s: SortType) => void;
  gridCols: 2 | 3 | 4;
  onGridColsChange: (c: 2 | 3 | 4) => void;
  totalCount: number;
}

const CATEGORIES: { key: FilterCategory; label: string; tone: string }[] = [
  { key: 'all', label: 'Tất cả', tone: 'from-gray-900 to-gray-700' },
  { key: 'illustration', label: 'Illustration', tone: 'from-violet-600 to-fuchsia-500' },
  { key: 'manga', label: 'Manga', tone: 'from-sky-600 to-cyan-500' },
  { key: 'ugoira', label: 'Animation', tone: 'from-amber-500 to-orange-500' },
  { key: 'novel', label: 'Novel', tone: 'from-emerald-600 to-teal-500' },
];

const SORTS: { key: SortType; label: string; icon: React.ComponentType<{ size: number }> }[] = [
  { key: 'newest', label: 'Mới nhất', icon: Clock },
  { key: 'popular', label: 'Phổ biến', icon: Flame },
  { key: 'following', label: 'Đang theo dõi', icon: UserCheck },
];

export default function FilterBar({
  category,
  onCategoryChange,
  sort,
  onSortChange,
  gridCols,
  onGridColsChange,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="mb-6 rounded-[1.75rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
              <SlidersHorizontal size={12} />
              Curated feed
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {totalCount} tác phẩm đang khớp với bộ lọc hiện tại.
            </p>
          </div>

          <div className="flex items-center gap-2">
            
            <div className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white p-1">
              <button
                onClick={() => onGridColsChange(3)}
                className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                  gridCols === 3
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => onGridColsChange(4)}
                className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                  gridCols === 4
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <LayoutList size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(({ key, label, tone }) => (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`group flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                category === key
                  ? `border-transparent bg-gradient-to-r ${tone} text-white shadow-lg`
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  category === key ? 'bg-white' : 'bg-gray-300 group-hover:bg-violet-400'
                }`}
              />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SORTS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onSortChange(key)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold transition-all ${
                sort === key
                  ? 'border-violet-200 bg-violet-50 text-violet-700'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon size={12} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
