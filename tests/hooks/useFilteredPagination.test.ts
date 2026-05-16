import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useFilteredPagination from '@/hooks/useFilteredPagination';
import type { Render } from '@/types/types';

const mockItems = [
  { prompt: 'A sunset over mountains', favorite: true },
  { prompt: 'A cat sitting on a chair', favorite: false },
  { prompt: 'Abstract colorful painting', favorite: true },
  { prompt: 'City skyline at night', favorite: false },
  { prompt: 'Ocean waves crashing', favorite: true },
] as unknown as Render[];

describe('useFilteredPagination', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should return all items when no filters are applied', () => {
    const { result } = renderHook(() => useFilteredPagination(mockItems));

    expect(result.current.filteredItems).toHaveLength(5);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.search).toBe('');
    expect(result.current.filter).toBe('');
    expect(result.current.sort).toBe('');
  });

  it('should filter items by search after debounce', async () => {
    const { result } = renderHook(() => useFilteredPagination(mockItems));

    act(() => {
      result.current.setSearch('cat');
    });

    // Before debounce, still all items
    expect(result.current.filteredItems).toHaveLength(5);

    // After debounce (600ms)
    await act(async () => {
      vi.advanceTimersByTime(700);
    });

    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems![0].prompt).toContain('cat');
  });

  it('should filter favorites when filter is set', () => {
    const { result } = renderHook(() => useFilteredPagination(mockItems));

    act(() => {
      result.current.setFilter('favorites');
    });

    expect(result.current.filteredItems).toHaveLength(3);
    result.current.filteredItems!.forEach((item) => {
      expect(item.favorite).toBe(true);
    });
  });

  it('should filter unfavorites when filter is set', () => {
    const { result } = renderHook(() => useFilteredPagination(mockItems));

    act(() => {
      result.current.setFilter('unfavorites');
    });

    expect(result.current.filteredItems).toHaveLength(2);
    result.current.filteredItems!.forEach((item) => {
      expect(item.favorite).toBe(false);
    });
  });

  it('should paginate items correctly', () => {
    const manyItems = Array.from({ length: 25 }, (_, i) => ({
      prompt: `Item ${i}`,
      favorite: false,
    })) as unknown as Render[];

    const { result } = renderHook(() =>
      useFilteredPagination(manyItems, { postsPerPage: 10 })
    );

    expect(result.current.paginatedItems).toHaveLength(10);

    act(() => {
      result.current.paginate(2);
    });

    expect(result.current.paginatedItems).toHaveLength(10);
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.paginate(3);
    });

    expect(result.current.paginatedItems).toHaveLength(5);
  });

  it('should reset to page 1 when filter changes', () => {
    const manyItems = Array.from({ length: 25 }, (_, i) => ({
      prompt: `Item ${i}`,
      favorite: i % 2 === 0,
    })) as unknown as Render[];

    const { result } = renderHook(() =>
      useFilteredPagination(manyItems, { postsPerPage: 10 })
    );

    act(() => {
      result.current.paginate(3);
    });
    expect(result.current.currentPage).toBe(3);

    act(() => {
      result.current.setFilter('favorites');
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('should return undefined for empty items array', () => {
    const { result } = renderHook(() => useFilteredPagination([]));
    expect(result.current.filteredItems).toBeUndefined();
  });
});
