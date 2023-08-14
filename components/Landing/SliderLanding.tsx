import { useState, useEffect } from "react";
import NextImage from "next/image";
import { Box, Button } from "@mui/material";

// Icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const IMAGES = ["agrosal", "variedad", "rentasal", "variedad2", "arsenipur"];

const SliderLanding = () => {
  const [image, setImage] = useState(0);
  const [render, setRender] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setImage((prev) => (prev + 1) % IMAGES.length);
    }, 7000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [image]);

  return (
    <Box
      sx={{
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => setRender(true)}
      onMouseLeave={() => setRender(false)}
    >
      {render && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "10%",
            bottom: 7,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 1,
            display: "flex",
          }}
        >
          <Button
            sx={{
              width: "100%",
            }}
            onClick={() => setImage((prev) => (prev - 1) % IMAGES.length)}
          >
            <ArrowBackIosIcon />
          </Button>
          <Button
            sx={{
              width: "100%",
            }}
            onClick={() => setImage((prev) => (prev + 1) % IMAGES.length)}
          >
            <ArrowForwardIosIcon />
          </Button>
        </Box>
      )}
      <NextImage
        src={`/images/landing/${IMAGES[image]}.jpg`}
        alt="Company S.A.S Logo"
        width={830}
        height={538}
        style={{
          objectFit: "fill",
          objectPosition: "center",
        }}
        loading="eager"
        className="image_landing"
      />
    </Box>
  );
};

export { SliderLanding };
