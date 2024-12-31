"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const MovieReviewPage = () => {
  const router = useRouter();
  const parms = useParams()
  const { movieId } = parms; 

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  useEffect(() => {
    if (movieId) {
      fetch(`https://sassmonk-be.onrender.com/reviews/${movieId}`)
        .then((response) => response.json())
        .then((data) => {
          setMovie(data.movie);
          setReviews(data.reviews);
        })
        .catch((error) => console.error('Error fetching movie:', error));
    }
  }, [movieId]);

  const handleEditReview = (review) => {
    setCurrentReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteReview = (reviewId) => {
    fetch(`https://sassmonk-be.onrender.com/reviews/delete/${reviewId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        setReviews(reviews.filter((review) => review._id !== reviewId));
      })
      .catch((error) => console.error('Error deleting review:', error));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentReview(null);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    // Update the review list after editing
    const updatedReviews = reviews.map((review) =>
      review._id === currentReview._id ? currentReview : review
    );
    setReviews(updatedReviews);
    handleModalClose();
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'left', marginBottom: '20px' }}>{movie.name}</h1>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reviews</h2>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {reviews.map((review) => (
          <div
            key={review._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              width: '80%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <p><strong>Review:</strong> {review.reviewComment}</p>
            <p><strong>Author:</strong> {review.reviewerName}</p>
            <p><strong>Rating:</strong> {review.rating}/10</p>

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
                onClick={() => handleEditReview(review)}
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
                onClick={() => handleDeleteReview(review._id)}
              >
                <FaTrashAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && currentReview && (
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
              color: '#000',
              width: '400px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Movie Name:</label>
                <input
                  type="text"
                  value={movie.name}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Review Text:</label>
                <textarea
                  value={currentReview.reviewComment}
                  onChange={(e) =>
                    setCurrentReview({ ...currentReview, reviewComment: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    minHeight: '100px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Reviewer Name:</label>
                <input
                  type="text"
                  value={currentReview.reviewerName}
                  onChange={(e) =>
                    setCurrentReview({ ...currentReview, reviewerName: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Rating (1-10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={currentReview.rating}
                  onChange={(e) =>
                    setCurrentReview({ ...currentReview, rating: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
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
