"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const MovieReviewPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [currentMovie, setCurrentMovie] = useState(null);

  const fetchMovies = (query = '') => {
    const url = query 
      ? `https://sassmonk-be.onrender.com/reviews/search?comment=${query}` 
      : 'https://sassmonk-be.onrender.com/movies';

    fetch(url)
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error('Error fetching movies:', error));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchMovies(value);
  };

  const handleEdit = (movie, e) => {
    e.stopPropagation();
    setCurrentMovie(movie);
    setIsModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    fetch(`https://sassmonk-be.onrender.com/movies/delete/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        const updatedMovies = movies.filter((movie) => movie._id !== id);
        setMovies(updatedMovies);
      })
      .catch((error) => console.error('Error deleting movie:', error));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentMovie(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { name, releaseDate, _id } = currentMovie;

    fetch('https://sassmonk-be.onrender.com/movies/add', {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        releaseDate: releaseDate,
        _id: _id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedMovies = movies.map((movie) =>
          movie._id === _id ? { ...movie, name, releaseDate } : movie
        );
        setMovies(updatedMovies);
        handleModalClose();
      })
      .catch((error) => {
        console.error('Error updating movie:', error);
      });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Movie Review Page</h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {movies.map((movie) => (
          <div
            key={movie._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              width: 'calc(33.33% - 20px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              position: 'relative',
              cursor: "pointer"
            }}
            onClick={() => router.push(`/movie/${movie._id}`)}
          >
            <h3>{movie.name}</h3>
            <p><strong>Release Date:</strong> {movie.releaseDate}</p>
            <p><strong>Rating:</strong> {movie.rating}/10</p>

            <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#007bff',
                  marginRight: '10px',
                }}
                title="Edit"
                onClick={(e) => handleEdit(movie, e)}
              >
                <FaEdit size={18} />
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'red',
                }}
                title="Delete"
                onClick={(e) => handleDelete(movie._id, e)}
              >
                <FaTrashAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && currentMovie && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              color: "#000",
              width: '400px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h2>Edit Movie</h2>
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
                <input
                  type="text"
                  value={currentMovie.name}
                  onChange={(e) =>
                    setCurrentMovie({ ...currentMovie, name: e.target.value })
                  }
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Release Date:</label>
                <input
                  type="text"
                  value={currentMovie.releaseDate}
                  onChange={(e) =>
                    setCurrentMovie({ ...currentMovie, releaseDate: e.target.value })
                  }
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#007bff',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                style={{
                  marginLeft: '10px',
                  background: '#ccc',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieReviewPage;
