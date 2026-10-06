import type { ComponentType } from 'react';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import styled from 'styled-components';

const ReactPaginate = ((
  ReactPaginateModule as unknown as {
    default?: ComponentType<ReactPaginateProps>;
  }
).default ?? ReactPaginateModule) as ComponentType<ReactPaginateProps>;

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  if (pageCount <= 1) return null;

  return (
    <PaginationNav aria-label="支出一覧のページ">
      <ReactPaginate
        pageCount={pageCount}
        forcePage={currentPage}
        onPageChange={({ selected }) => onPageChange(selected)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        previousLabel="前へ"
        nextLabel="次へ"
        breakLabel="…"
        renderOnZeroPageCount={null}
        containerClassName="pagination-list"
        pageClassName="pagination-item"
        pageLinkClassName="pagination-link"
        previousClassName="pagination-item pagination-direction"
        previousLinkClassName="pagination-link"
        nextClassName="pagination-item pagination-direction"
        nextLinkClassName="pagination-link"
        breakClassName="pagination-item pagination-break"
        breakLinkClassName="pagination-link"
        activeClassName="is-active"
        disabledClassName="is-disabled"
        activeLinkClassName="is-active"
        disabledLinkClassName="is-disabled"
        ariaLabelBuilder={(page) => `${page}ページ目へ`}
        previousAriaLabel="前のページへ"
        nextAriaLabel="次のページへ"
      />
    </PaginationNav>
  );
};

const PaginationNav = styled.nav`
  margin-top: 24px;

  .pagination-list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .pagination-item {
    display: flex;
    min-width: 36px;
    height: 36px;
  }

  .pagination-link {
    display: grid;
    min-width: 36px;
    height: 36px;
    place-items: center;
    padding: 0 10px;
    border: 1px solid #dfddd4;
    border-radius: 9px;
    background: #fbfaf6;
    color: #37423b;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition:
      background 140ms ease,
      border-color 140ms ease,
      color 140ms ease;

    &:hover {
      border-color: #9aab9e;
      background: #e9eee8;
    }

    &:focus-visible {
      outline: 3px solid #55776440;
      outline-offset: 2px;
    }
  }

  .is-active .pagination-link,
  .pagination-link.is-active {
    border-color: #163c2c;
    background: #163c2c;
    color: #fff;
  }

  .is-disabled .pagination-link,
  .pagination-link.is-disabled {
    border-color: #e8e6df;
    background: #f3f1e9;
    color: #a5aaa5;
    cursor: not-allowed;
  }

  .pagination-break .pagination-link {
    min-width: 24px;
    padding: 0 2px;
    border-color: transparent;
    background: transparent;
    cursor: default;
  }

  @media (max-width: 420px) {
    .pagination-list {
      gap: 4px;
    }

    .pagination-item,
    .pagination-link {
      min-width: 32px;
      height: 32px;
    }

    .pagination-link {
      padding: 0 7px;
      font-size: 11px;
    }
  }
`;
