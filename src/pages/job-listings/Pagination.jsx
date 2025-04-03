import React from 'react';

const Pagination = ({ jobsPerPage, totalJobs, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalJobs / jobsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        <li>
          <button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
            disabled={currentPage === 1}
          >
            &laquo; Prev
          </button>
        </li>
        
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          </li>
        ))}
        
        <li>
          <button
            onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
            className={`pagination-btn ${currentPage === pageNumbers.length ? 'disabled' : ''}`}
            disabled={currentPage === pageNumbers.length}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;