import { Link } from 'react-router-dom';

function PreviewLink(props) {
  return (
    <div className="about-link">
      <Link to={`/preview/`,props}>
      </Link>
    </div>
  );
}

export default PreviewLink;