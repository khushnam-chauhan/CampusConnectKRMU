import React, { useState, useEffect } from 'react';
import './JobListing.css';
import SearchFilters from './SearchFilters';
import JobCard from './JobCard';
import Pagination from './Pagination';

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
  
        const jobsArray = data.data || [];
  
        const approvedJobs = jobsArray
          .filter(job => job.status === 'approved')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setJobs(approvedJobs);
        setFilteredJobs(approvedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchJobs();
  }, []);
  
  const handleFilterChange = (filters) => {
    let results = [...jobs];

    //  Search by Job Profile or Company Name
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        job => 
          job.profiles.toLowerCase().includes(searchLower) || 
          job.companyName.toLowerCase().includes(searchLower)
      );
    }

    //  Filter by Location
    if (filters.location) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    //  Filter by Offer Type
    if (filters.offerType && filters.offerType !== 'All Types') {
      results = results.filter(job => job.offerType === filters.offerType);
    }

    //  Filter by CTC (Optional)
    if (filters.ctcRange) {
      results = results.filter(job => 
        job.ctcOrStipend.toLowerCase().includes(filters.ctcRange.toLowerCase())
      );
    }

    //  Filter by Skills (Now Fixed 💯)
    if (filters.skills.length > 0) {
      results = results.filter(job => {
        return filters.skills.some(skill =>
          job.skills.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });
    }

    //  Reset Page to 1 when Filter Changes
    setCurrentPage(1);
    setFilteredJobs(results);
  };

  //  Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="job-listing-page">
      <SearchFilters onFilterChange={handleFilterChange} />
      <div className="job-results-info">
        <p>Found <span className="job-count">{filteredJobs.length}</span> job listings</p>
      </div>
      <div className="job-grid">
        {currentJobs.length > 0 ? (
          currentJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))
        ) : (
          <div className="no-jobs-message">
            <h3>No jobs match your search criteria</h3>
            <p>Try adjusting your filters or search for something else</p>
          </div>
        )}
      </div>
      {filteredJobs.length > jobsPerPage && (
        <Pagination
          jobsPerPage={jobsPerPage}
          totalJobs={filteredJobs.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default JobListingPage;
