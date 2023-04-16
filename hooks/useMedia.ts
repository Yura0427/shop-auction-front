import { useState, useEffect } from 'react';

interface IMediaQuery {
  (query: string): boolean;
}

/**
  @param query should receive a string such as - '(min-width: ${number}px)' or '(max-width: ${number}px)'
  @example '(min-width: 400px)', '(max-width: 100px)'
*/

export const useMedia: IMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};
