import { Navigate } from "react-router-dom";
import { PropTypes } from "prop-types";

export const PublicRoute = ({ isAuthenticated, element: Element, ...rest }) => {
    return isAuthenticated ? <Navigate to="/" /> : <Element {...rest} />;
}

PublicRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    component: PropTypes.elementType.isRequired
}