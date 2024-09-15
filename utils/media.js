import { mediaURL } from '../store';

export const getArtwork = (ref) => {
  return {
    portrait: mediaURL + ref + '_port.jpg',  
  };
};