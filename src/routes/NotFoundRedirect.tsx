import { useEffect } from 'react';

const NotFoundRedirect = () => {
  useEffect(() => {
    window.location.replace('/');
  }, []);

  return null;
};

export default NotFoundRedirect;
