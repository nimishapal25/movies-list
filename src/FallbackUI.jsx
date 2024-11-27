/* eslint-disable react/prop-types */
export const FallbackUI = ({ error }) => {
    console.log(error)
    return (
        <div className="bg-white shadow-lg p-6 rounded-lg max-w-md text-center">
          <h1 className="mb-4 font-bold text-3xl text-red-500">Something went wrong!</h1>
          <p className="mb-4 text-gray-700">{ error || 'We encountered an unexpected error. Please try again later.'}</p>
        </div>
    )
  }