import { useState, useEffect } from 'react';
import { debounce } from "@rodrigo-barraza/utilities-library/rate";

interface UseFilteredPaginationOptions {
    postsPerPage?: number;
}

export default function useFilteredPagination(items: any[], options: UseFilteredPaginationOptions = {}) {
    const { postsPerPage = 12 } = options;

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [galleryMode, setGalleryMode] = useState('grid');

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // Debounce search input
    useEffect(() => {
        const debouncedSearchValue = debounce((value: string) => {
            setCurrentPage(1);
            setDebouncedSearch(value);
        }, 600);

        debouncedSearchValue(search);

        return () => {
            debouncedSearchValue.cancel();
        };
    }, [search]);

    // Filter and sort items
    const filteredItems = (() => {
        if (!items || !items.length) return undefined;

        const filteredArray = items.filter((item) => {
            const matchesSearch = item.prompt.toLowerCase().includes(debouncedSearch.toLowerCase());
            if (filter === 'favorites') {
                return matchesSearch && item.favorite === true;
            }
            if (filter === 'unfavorites') {
                return matchesSearch && item.favorite === false;
            }
            return matchesSearch;
        });

        if (sort === 'oldest') {
            return filteredArray.reverse();
        }
        return filteredArray;
    })();

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const paginatedItems = filteredItems?.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return {
        search,
        setSearch,
        filter,
        setFilter,
        sort,
        setSort,
        galleryMode,
        setGalleryMode,
        currentPage,
        postsPerPage,
        filteredItems,
        paginatedItems,
        paginate,
    };
}
