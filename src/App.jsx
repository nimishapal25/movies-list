/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import InfiniteScroll from 'react-infinite-scroll-component';
import { MovieList } from './MovieList' 
import { Loader } from './Loader'
import { FallbackUI } from './FallbackUI'

const API_KEY = 34045347
const IMDB_ID = 'tt3896198'

function App() {
  const [movieList, setMovieList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [search, setSearch] = useState()
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const timeoutRef = useRef(null);
  const totalPages = movieList.totalResults ? Math.ceil(Number(movieList.totalResults) / 10) : 0;

  useEffect(() => {
    async function getMovieList() {
      if (debouncedSearch === "" || loading) return;
      setError(null)
      setLoading(true)
  
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${IMDB_ID}&apikey=${API_KEY}&s=${debouncedSearch}&page=${currentPage}`)
        const data = await res.json()
        if (data.Response === "True") {
          if(currentPage > 1) {
            setMovieList((prev) => ({
              ...data,
              Search: [...(prev.Search || []), ...data.Search], // Append new results
            }));
          }
          else {
            setMovieList(data)
          }
        } else {
          setError(data.Error || "Something went wrong");
        }
      } catch(e) {
        setError('Failed to fetch movies')
      } finally {
        setLoading(false)
      }
    }
    getMovieList()
  }, [currentPage, debouncedSearch])

  function handleSearch(e) {
    const val = e.target.value
    setSearch(val)
    setCurrentPage(1)

    if (val.length >= 3) {
      clearTimeout(timeoutRef.current);  // Clear the previous timeout

      timeoutRef.current = setTimeout(() => {
        setDebouncedSearch(val);  // Update debounced search after delay
      }, 500);  // 500ms delay for debounce
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 mb-8 min-h-screen">
      <input type="text" placeholder="Search By Movie Title ex: batman" value={search} onChange={handleSearch} 
      className="border-gray-300 p-3 border focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full max-w-md focus:outline-none placeholder-gray-400"/>
      {loading && currentPage === 1  ? <Loader /> : 
        movieList.Search && movieList.Search.length > 0  ?
          (<>
            <InfiniteScroll
              dataLength={movieList.Search.length}
              next={() => {
                if (!loading) setCurrentPage((prev) => prev + 1);
              }}
              hasMore={currentPage < totalPages && !loading}
            >
            </InfiniteScroll>

            {movieList.Search.map(movie => <MovieList movie={movie} key={movie.imdbID}/>)}
            {loading && <Loader />}
          </>) : 
          (<p className="text-center">
            {error ? <FallbackUI error={error}/> : "No movies to display. Start searching!"}
          </p>)
      }
        
    </div>
  )
}


export default App
