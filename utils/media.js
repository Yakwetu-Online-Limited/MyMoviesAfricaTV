import { mediaURL } from '../store';

// Function to fetch the artwork based on movie ref
export const getArtwork = (ref) => {
  return {
    portrait: mediaURL + ref + '_port.jpg',  
  };
};
