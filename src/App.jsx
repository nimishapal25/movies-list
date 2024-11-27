/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { MovieList } from "./MovieList"; 
import { Loader } from "./Loader";
import { FallbackUI } from "./FallbackUI";

function App() {
  
  const [movieList, setMovieList] = useState([]); // State to store the list of movies
  const [currentPage, setCurrentPage] = useState(1);  // State to track the current page for pagination
  const [loading, setLoading] = useState(false);  // State to indicate if data is being fetched
  const [error, setError] = useState(); // State to store any error messages
  const [search, setSearch] = useState(); // State to track the user's input for search
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced version of the search input for optimized API calls
  const timeoutRef = useRef(null); // Reference to track the debounce timeout
  const totalPages = movieList.totalResults
    ? Math.ceil(Number(movieList.totalResults) / 10)
    : 0;

  useEffect(() => {
    async function getMovieList() {
      if (debouncedSearch === "" || loading) return;
      setError(null); // Clear any previous errors
      setLoading(true); // Set loading state to true
  
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${import.meta.env.VITE_IMDB_ID}&apikey=${import.meta.env.VITE_API_KEY}&s=${debouncedSearch}&page=${currentPage}`
        );
        const data = await res.json();

        if (data.Response === "True") {
          if (currentPage > 1) {
            setMovieList((prev) => ({
              ...data,
              Search: [...(prev.Search || []), ...data.Search], // Append new results
            }));
          } else {
            setMovieList(data); // Set the results for the first page
          }
        } else {
          // Handle errors returned by the API
          setMovieList([]);
          setError(data.Error || "Something went wrong");
        }
      } catch (e) {
        // Handle network or API errors
        setMovieList([]);
        setError("Failed to fetch movies");
      } finally {
        setLoading(false); // Reset loading state
      }
    }
    getMovieList();
  }, [currentPage, debouncedSearch]);

  function handleSearch(e) {
    const val = e.target.value;
    setSearch(val); // Update search state
    setCurrentPage(1); // Reset to the first page for new searches

    if (val.length >= 3) {
      clearTimeout(timeoutRef.current); // Clear previous debounce timeout

      timeoutRef.current = setTimeout(() => {
        setDebouncedSearch(val); // Update debounced search after delay
      }, 500); // 500ms debounce delay
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 mb-8 min-h-screen">
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search By Movie Title ex: Batman"
        value={search}
        onChange={handleSearch}
        className="border-gray-300 p-3 border focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full max-w-md focus:outline-none placeholder-gray-400"
      />
      
      {/* Display loader, movie list, or fallback UI based on the state */}
      {loading && currentPage === 1 ? (
        <Loader />
      ) : movieList.Search && movieList.Search.length > 0 ? (
        <>
          {/* Infinite scroll for pagination */}
          <InfiniteScroll
            dataLength={movieList.Search.length} // Number of items loaded so far
            next={() => {
              if (!loading) setCurrentPage((prev) => prev + 1); // Fetch next page
            }}
            hasMore={currentPage < totalPages && !loading} // Check if more pages are available
          >
          </InfiniteScroll>

          {/* Render movie list */}
          {movieList.Search.map((movie) => (
            <MovieList movie={movie} key={movie.imdbID} />
          ))}
          {loading && <Loader />}
        </>
      ) : (
        // Fallback message when no movies are found or an error occurs
        <p className="text-center">
          {error ? <FallbackUI error={error} /> : "No movies to display. Start searching!"}
        </p>
      )}
    </div>
  );
}

export default App;
