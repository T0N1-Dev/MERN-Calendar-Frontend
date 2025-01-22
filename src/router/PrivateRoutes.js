import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const PrivateRoute = ({ isAuthenticated, element: Element, ...rest }) => {
    return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    component: PropTypes.elementType.isRequired,
};
