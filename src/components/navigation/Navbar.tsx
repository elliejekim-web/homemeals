'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
};

type NavbarProps = {
  brandName: string;
  brandHref: string;
  badgeText?: string;
  items: NavItem[];
  actionButton?: {
    label: string;
    href: string;
    icon?: string;
    variant?: 'emerald' | 'blue';
  };
};

export default function Navbar({
  brandName,
  brandHref,
  badgeText,
  items,
  actionButton,
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 페이지 이동 시 모바일 메뉴 자동 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 활성 링크 판단 헬퍼 (exact match 또는 대시보드 하위 경로 처리)
  const isActive = (href: string) => {
    if (href === '/admin' || href === '/member') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand Logo & Desktop Nav */}
          <div className="flex items-center gap-6">
            <Link
              href={brandHref}
              className="flex items-center gap-2 font-bold text-lg tracking-tight text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-xs">
                ⛪
              </span>
              <span className="truncate max-w-[180px] sm:max-w-none">{brandName}</span>
              {badgeText && (
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {badgeText}
                </span>
              )}
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all ${
                      active
                        ? 'bg-blue-50 font-bold text-blue-600 shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {actionButton && (
              <Link
                href={actionButton.href}
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all active:scale-95 ${
                  actionButton.variant === 'emerald'
                    ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                }`}
              >
                {actionButton.icon && <span>{actionButton.icon}</span>}
                <span>{actionButton.label}</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-expanded={isOpen}
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 px-4 pt-2 pb-4 space-y-1 shadow-lg backdrop-blur-lg">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 font-bold text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon && <span className="text-base">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Action Button inside Mobile Menu */}
          {actionButton && (
            <div className="pt-2 border-t border-gray-100">
              <Link
                href={actionButton.href}
                className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white ${
                  actionButton.variant === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
              >
                {actionButton.icon && <span>{actionButton.icon}</span>}
                <span>{actionButton.label}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}