import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class NavLink extends React.Component {
    render() {
        let isActive = this.context.router.route.location.pathname === this.props.to;
        var className = isActive ? 'active' : '';

        return(
            <li className={className} >
                <Link {...this.props}/>
            </li>
        );
    }
}

NavLink.contextTypes = {
    router: PropTypes.object
};

export default NavLink;