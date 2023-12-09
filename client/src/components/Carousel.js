import React, { useState, useEffect } from 'react';
import image1 from '../images/Carousel_img_1.png';
import image2 from '../images/Carousel_img_2.jpg';
import image3 from '../images/Carousel_img_3.png';
import image4 from '../images/Carousel_img_4.png';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Carousel = () => {
  const images = [image1, image2, image3, image4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
  };

  // Function to go to the previous image
  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
  };

  // Automatically slide to the next image after a fixed time interval (e.g., 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 4000); // Change image every 4 seconds

    // Clear the interval when component unmounts or when the user interacts with the carousel manually
    return () => clearInterval(interval);
  }, [currentImageIndex]); // Depend on currentImageIndex to reset the interval when manually navigating

  return (
    <div className="carousel">
      <img
        src={images[currentImageIndex]}
        alt={`Slide ${currentImageIndex + 1}`}
        style={{
          width: '450px',
          height: '570px',
          objectFit: 'cover', // ensures images fill the container
        }}
        className="carousel-image" // add custom class for styling
      />
      <div className="carousel-controls">
        <IconButton
          onClick={prevImage}
          className="carousel-button prev-button" // Add custom button styles
        >
          <ArrowBackIcon fontSize="medium" />
        </IconButton>
        <IconButton
          onClick={nextImage}
          className="carousel-button next-button" // Add custom button styles
        >
          <ArrowForwardIcon fontSize="medium" />
        </IconButton>
      </div>
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={
              `carousel-indicator ${
                index === currentImageIndex ? 'active' : ''
              }`
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
