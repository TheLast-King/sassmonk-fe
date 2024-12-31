"use client";

import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderComponent = () => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isAddMovieModalOpen, setAddMovieModalOpen] = useState(false);
  const [isAddReviewModalOpen, setAddReviewModalOpen] = useState(false);

  // Movie and review state
  const [movieName, setMovieName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [movieList, setMovieList] = useState([]);

  const router = useRouter();

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const handleAddMovieClick = () => {
    setAddMovieModalOpen(true);
  };

  const handleAddReviewClick = () => {
    setAddReviewModalOpen(true);
  };

    // Fetch movies list when the component mounts
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch("https://sassmonk-be.onrender.com/movie");
          const data = await response.json();
          setMovieList(data);
        } catch (error) {
          console.error("Error fetching movie list:", error);
        }
      };
  
      fetchMovies();
    }, []);

  const handleAddMovieSubmit = async () => {
    try {
      // Send data to the API
      const response = await fetch("https://sassmonk-be.onrender.com/movie/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: movieName,
          releaseDate: releaseDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add movie");
      }

      const data = await response.json();
      console.log("Movie Added:", data);
      setMovieName("");
      setReleaseDate("")
      
      // Close the modal after submitting
      setAddMovieModalOpen(false);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const handleAddReviewSubmit = async () => {
    try {
      const response = await fetch("https://sassmonk-be.onrender.com/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          reviewComment: comment,
          movieId: selectedMovie,
          name: reviewerName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      const data = await response.json();
      console.log("Review Submitted:", data);
      
      // Close the modal after submitting
      setAddReviewModalOpen(false);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        color: "white",
        boxShadow: 3,
        zIndex: 50,
        transition: "all 0.3s ease-in-out",
        backgroundColor: scrollY > 0 ? "rgba(3, 8, 21, 0.9)" : "transparent",
        borderBottom:
          scrollY > 0 ? "1px solid rgba(255, 255, 255, 0.3)" : "none"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0px 24px",
          height: { xs: "60px" }
        }}
      >
        <Box
          sx={{
            cursor: "pointer",
            marginLeft: "10px",
            display: "flex",
            alignItems: "center"
          }}
          onClick={() => router.push("/")}
        >
         
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Button
            sx={{
              padding: "8px 16px",
              borderRadius: "8px",
              color: "white",
              backgroundColor: "blue",
              "&:hover": {
                backgroundColor: "gray"
              }
            }}
            onClick={handleAddMovieClick}
          >
            Add Movie
          </Button>
          <Button
            sx={{
              padding: "8px 16px",
              borderRadius: "8px",
              color: "white",
              backgroundColor: "blue",
              "&:hover": {
                backgroundColor: "gray"
              }
            }}
            onClick={handleAddReviewClick}
          >
            Add Review
          </Button>
        </Box>
      </Box>

      {/* Add Movie Modal */}
      <Dialog open={isAddMovieModalOpen} onClose={() => setAddMovieModalOpen(false)}>
        <DialogTitle>Add Movie</DialogTitle>
        <DialogContent>
          <TextField
            label="Movie Name"
            fullWidth
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Release Date"
            type="date"
            fullWidth
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMovieModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMovieSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Add Review Modal */}
      <Dialog open={isAddReviewModalOpen} onClose={() => setAddReviewModalOpen(false)}>
        <DialogTitle>Add Review</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Select Movie</InputLabel>
            <Select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              label="Select Movie"
            >
              {movieList.map((movie) => (
                <MenuItem key={movie?._id} value={movie?._id}>
                  {movie?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Your Name"
            fullWidth
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Rating (1-10)"
            type="number"
            fullWidth
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            sx={{ marginBottom: 2 }}
            inputProps={{ min: 1, max: 10 }}
          />
          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddReviewModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddReviewSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeaderComponent;
