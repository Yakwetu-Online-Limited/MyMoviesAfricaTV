import { mediaURL } from './urlStore';

export const getArtwork = (ref) => {
    
  const portraitUrl = ref ? mediaURL + ref + '_port.jpg' : null;
  // console.log('Base URL:', mediaURL);
  // console.log('Ref:', ref);
  // console.log('Portrait URL:', portraitUrl);
  return {
    portrait: portraitUrl,
  };
};
