import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function withLocation(Child: any) {
  return function withRouter(props: any) {
    const location = useLocation();
    // other relevant props
    // ...
    return <Child {...props} location={location} />;
  };
}

function ScrollToTop({ history }: any) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, []);

  return (null);
}

export default withLocation(ScrollToTop);
