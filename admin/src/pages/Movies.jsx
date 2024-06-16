import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'b60eb8fce3740a7bae744bd3699d8721';
const BASE_URL = 'https://api.themoviedb.org/3';

const MovieAndSeries = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

 console.log(error,'error')
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}`
        );
        const seriesResponse = await axios.get(
          `${BASE_URL}/discover/tv?api_key=${API_KEY}`
        );

        setMovies(movieResponse.data.results);
        setSeries(seriesResponse.data.results);
        console.log(series,'series')
        console.log(movies,'movies')
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    console.log(series,'series')
        console.log(movies,'movies')

  return (
    <div>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error</div>}
      <button style={{background:'red',color:'white', width:'100px',height:'50px'}} onClick={fetchData}>Fetchdata</button>
    </div>
  );
};

export default MovieAndSeries;
