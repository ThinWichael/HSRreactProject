import React, { Component } from 'react';
import { Route, Link }  from "react-router-dom";

export default class SideBar extends Component {

  render() {
    return (
      <div className="Sidebar">
      <div className="nav-side-menu">
        <div className="brand">高鐵時刻查詢</div>
        <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

        <div className="menu-list">

            <ul id="menu-content" className="menu-content collapse out">
                {/* <NavLink to="/search01">
                  
                        <i className="fa fa-dashboard fa-lg"></i> 以日期查詢
                    
                </NavLink> */}
                <li >
                    <Link to="/search01" style={{display: 'block', height: '100%'}}>
                        <i className="fa fa-dashboard fa-lg"></i> 以日期查詢
                    </Link>
                </li>
                <li>
                    <Link to="/search02" style={{display: 'block', height: '100%'}}>
                        <i className="fa fa-user fa-lg"></i> 今日對號座狀況確認
                    </Link>
                </li>

                {/* <li>
                    <a href="#">
                        <i class="fa fa-users fa-lg"></i> Users
                    </a>
                </li>  */}
            </ul>
          </div>
       </div>
    
        { this.props.children }
      </div>
    
    )
  }

}
