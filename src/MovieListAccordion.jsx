/* eslint-disable react/prop-types */
export const MovieListAccordion = ({ movieDetails, isOpen }) => {
    return (
      <>
      {isOpen && <div>
        <div className="gap-4 grid grid-cols-2 text-gray-700 text-sm">
          <div><span className="font-semibold">Genre:</span> {movieDetails.Genre}</div>
          <div><span className="font-semibold">Year:</span> { movieDetails.Year} </div>
          <div><span className="font-semibold">Director:</span> {movieDetails.Director} </div>
          <div><span className="font-semibold">Actors:</span> { movieDetails.Actors}</div>
          <div><span className="font-semibold">Rated:</span> { movieDetails.Rated}</div>
          <div><span className="font-semibold">IMDb Rating:</span> {movieDetails.imdbRating}</div>
          <div><span className="font-semibold">Box Office:</span> {movieDetails.BoxOffice} </div>
        </div>
        <p className="mt-4 text-gray-600 text-sm">
          <span className="font-semibold">Plot:</span> {movieDetails.Plot}
        </p>
      </div>}
      </>
      
    )
  }