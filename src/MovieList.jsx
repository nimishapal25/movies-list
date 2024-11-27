/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { MovieListAccordion } from './MovieListAccordion'
import { Loader } from './Loader'

export const  MovieList = ({ movie }) => {
    const [movieDetails, setMovieDetails] = useState()
    const [title, setTitle] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if(!title) return;
  
      async function getMovieDetail() {
        setLoading(true)
        try {
            const res = await fetch(`https://www.omdbapi.com/?i=${IMDB_ID}&apikey=${API_KEY}&t=${title}`)
            const data = await res.json()
            setMovieDetails(data)
        } catch (error) {
          console.error("Error fetching movie details:", error);
        } finally {
          setLoading(false)
        }
      }
      getMovieDetail()
    }, [title])
  
    function handleAccordion(title) {
      setTitle(title)
      setIsOpen(!isOpen)
    }
  
    return (
      <div onClick={() => handleAccordion(movie.Title)} className="flex flex-col gap-4 shadow-lg px-6 py-5 pr-12 border-t-4 border-t-white border-b-4 border-b-white w-1/2 cursor-pointer">
        <div className="flex justify-between items-center">
          <div>{movie.Title}</div>
          <div> { isOpen ? '-' : '+' }</div>
        </div>
  
        {loading ? <Loader /> : movieDetails && (<MovieListAccordion movieDetails={movieDetails} isOpen={isOpen} />)
        }
      </div>
    )
  }