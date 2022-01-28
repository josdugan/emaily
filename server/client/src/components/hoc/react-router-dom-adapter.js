import { useNavigate } from 'react-router-dom';

const withNavigate = (Component) => {
  const ComponentWithNavigateProp = (props) => {
    const navigate = useNavigate();

    return <Component {...props} navigate={navigate} />;
  };

  return ComponentWithNavigateProp;
};

export default withNavigate;
