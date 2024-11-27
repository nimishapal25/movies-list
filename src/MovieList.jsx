/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { MovieListAccordion } from "./MovieListAccordion";
import { Loader } from "./Loader";

export const MovieList = ({ movie }) => {
  
  const [movieDetails, setMovieDetails] = useState(); // State to store detailed information about the selected movie
  const [title, setTitle] = useState(""); // State to store the title of the selected movie
  const [isOpen, setIsOpen] = useState(false); // State to track whether the accordion is open or closed
  const [loading, setLoading] = useState(false); // State to indicate if the movie details are being fetched

  useEffect(() => {
    if (!title) return;

    async function getMovieDetail() {
      setLoading(true); // Set loading state to true
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${import.meta.env.VITE_IMDB_ID}&apikey=${import.meta.env.VITE_API_KEY}&t=${title}`
        );
        const data = await res.json();
        setMovieDetails(data); // Store the fetched movie details
      } catch (error) {
        // Handle any errors during the fetch process
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    }

    getMovieDetail();
  }, [title]); // Run the effect whenever the title changes

  // Function to handle accordion toggle
  function handleAccordion(title) {
    setTitle(title); // Update the selected title
    setIsOpen(!isOpen); // Toggle the accordion state
  }

  return (
    <div
      onClick={() => handleAccordion(movie.Title)}
      className="flex flex-col gap-4 shadow-lg px-6 py-5 pr-12 border-t-4 border-t-white border-b-4 border-b-white w-1/2 cursor-pointer"
    >
      {/* Display movie title and toggle indicator */}
      <div className="flex justify-between items-center">
        <div>{movie.Title}</div>
        <div>{isOpen ? "-" : "+"}</div>
      </div>

      {/* Display a loader while fetching details, or show the accordion with movie details */}
      {loading ? (
        <Loader />
      ) : (
        movieDetails && (
          <MovieListAccordion movieDetails={movieDetails} isOpen={isOpen} />
        )
      )}
    </div>
  );
};
