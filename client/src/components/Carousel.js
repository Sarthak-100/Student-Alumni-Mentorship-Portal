import React, { useState, useEffect } from "react";
import image1 from "../images/Carousel_img_1.png";
import image2 from "../images/Carousel_img_2.jpg";
import image3 from "../images/Carousel_img_3.png";
import image4 from "../images/Carousel_img_4.png";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
    }, 4000); // Change image every 3 seconds (3000 milliseconds)

    // Clear the interval when component unmounts or when the user interacts with the carousel manually
    return () => clearInterval(interval);
  }, [currentImageIndex]); // Depend on currentImageIndex to reset the interval when manually navigating

  return (
    <div className="carousel">
      <IconButton onClick={prevImage}>
        <ArrowBackIcon />
      </IconButton>
      <img
        src={images[currentImageIndex]}
        alt={`Slide ${currentImageIndex + 1}`}
        style={{ width: "450px", height: "580px" }}
      />
      <IconButton onClick={nextImage}>
        <ArrowForwardIcon />
      </IconButton>
    </div>
  );
};

export default Carousel;