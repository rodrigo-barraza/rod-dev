import React from 'react';
import style from './PaginationComponent.module.scss';
import type { PaginationComponentProps } from '@/types/types';

const Pagination: React.FC<PaginationComponentProps> = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers: number[] = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className={style.PaginationComponent}>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item`}>
            <a onClick={() => paginate(number)} className={`${currentPage === number ? 'current' : ''} page-link`}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;