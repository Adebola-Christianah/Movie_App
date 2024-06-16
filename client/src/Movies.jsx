import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'b60eb8fce3740a7bae744bd3699d8721';
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to save data to JSON file on the server-side
const saveDataToFile = (data, filename) => {
  // Assuming you're handling file operations on the server-side using Node.js
  // Example code to save data to a JSON file in Node.js:
  // fs.writeFile(filename, JSON.stringify(data), (err) => {
  //   if (err) {
  //     console.error('Error saving data to file:', err);
  //   } else {
  //     console.log('Data saved to file successfully:', filename);
  //   }
  // });
};

const MovieAndSeries = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&include_adult=false`
        );
        const seriesResponse = await axios.get(
          `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&include_adult=false`
        );

        const moviesWithVideosAndImages = await Promise.all(
          movieResponse.data.results.map(async (movie) => {
            const videoResponse = await axios.get(
              `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
            );
            const imageResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${API_KEY}`
            );
            return {
              ...movie,
              video: videoResponse.data.results[0]?.key || null, // Get the first video key if available
              posterImage: imageResponse.data.posters[0]?.file_path || null, // Get the first poster image path if available
            };
          })
        );

        const seriesWithVideosAndImages = await Promise.all(
          seriesResponse.data.results.map(async (serie) => {
            const videoResponse = await axios.get(
              `${BASE_URL}/tv/${serie.id}/videos?api_key=${API_KEY}`
            );
            const imageResponse = await axios.get(
              `https://api.themoviedb.org/3/tv/${serie.id}/images?api_key=${API_KEY}`
            );
            return {
              ...serie,
              video: videoResponse.data.results[0]?.key || null, // Get the first video key if available
              posterImage: imageResponse.data.posters[0]?.file_path || null, // Get the first poster image path if available
            };
          })
        );

        // Save the data to JSON files
        saveDataToFile(moviesWithVideosAndImages, 'movies.json');
        saveDataToFile(seriesWithVideosAndImages, 'series.json');

        setMovies(moviesWithVideosAndImages);
        setSeries(seriesWithVideosAndImages);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
console.log(movies,'movies')
console.log(series,'movies')
  return (
    <div>
      <h2>Movies</h2>
      <div>
        {movies.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <p>{movie.overview}</p>
            <p>Video: {movie.video}</p>
            <img src={`https://image.tmdb.org/t/p/w500${movie.posterImage}`} alt={movie.title} />
          </div>
        ))}
      </div>
      <h2>Series</h2>
      <div>
        {series.map((serie) => (
          <div key={serie.id}>
            <h3>{serie.name}</h3>
            <p>{serie.overview}</p>
            <p>Video: {serie.video}</p>
            <img src={`https://image.tmdb.org/t/p/w500${serie.posterImage}`} alt={serie.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieAndSeries;
