"use client";

import type { Deal } from "@/lib/db";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr + "Z");
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function expiresIn(dateStr: string): string {
  const now = new Date();
  const expires = new Date(dateStr + "Z");
  const diff = expires.getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
}

interface DealCardProps {
  deal: Deal;
  selected?: boolean;
  onClick?: () => void;
}

export default function DealCard({ deal, selected, onClick }: DealCardProps) {
  return (
    <div
      onClick={onClick}
      className={`deal-card-enter p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-200"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
          {deal.title}
        </h3>
        <span className="text-green-700 font-bold text-sm whitespace-nowrap bg-green-50 px-2 py-0.5 rounded-md">
          {formatPrice(deal.price)}
        </span>
      </div>

      <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{deal.description}</p>

      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="inline-block bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded-full font-medium">
            {deal.category}
          </span>
          {deal.expires_at && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
              new Date(deal.expires_at + "Z") < new Date(Date.now() + 24 * 60 * 60 * 1000)
                ? "bg-red-50 text-red-500"
                : "bg-amber-50 text-amber-600"
            }`}>
              {expiresIn(deal.expires_at)}
            </span>
          )}
        </div>
        <span className="text-gray-400 text-[11px] flex-shrink-0">{timeAgo(deal.created_at)}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
        {deal.contact_phone && (
          <a
            href={`tel:${deal.contact_phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors group"
          >
            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="truncate max-w-[100px]">{deal.contact_phone}</span>
          </a>
        )}
        {deal.contact_email && (
          <a
            href={`mailto:${deal.contact_email}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors group"
          >
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="truncate max-w-[120px]">{deal.contact_email}</span>
          </a>
        )}
      </div>
    </div>
  );
}
