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
                <li>
                    <Link to="/search01">
                        <i className="fa fa-dashboard fa-lg"></i> 以日期查詢
                    </Link>
                </li>

                {/* <!-- <li data-toggle="collapse" data-target="#products" class="collapsed active">
                    <a href="#"><i class="fa fa-gift fa-lg"></i> UI Elements <span class="arrow"></span></a>
                </li>
                <ul class="sub-menu collapse" id="products">
                    <li class="active"><a href="#">CSS3 Animation</a></li>
                    <li><a href="#">General</a></li>
                    <li><a href="#">Buttons</a></li>
                    <li><a href="#">Tabs & Accordions</a></li>
                    <li><a href="#">Typography</a></li>
                    <li><a href="#">FontAwesome</a></li>
                    <li><a href="#">Slider</a></li>
                    <li><a href="#">Panels</a></li>
                    <li><a href="#">Widgets</a></li>
                    <li><a href="#">Bootstrap Model</a></li>
                </ul>


                <li data-toggle="collapse" data-target="#service" class="collapsed">
                    <a href="#"><i class="fa fa-globe fa-lg"></i> Services <span class="arrow"></span></a>
                </li>
                <ul class="sub-menu collapse" id="service">
                    <li>New Service 1</li>
                    <li>New Service 2</li>
                    <li>New Service 3</li>
                </ul>


                <li data-toggle="collapse" data-target="#new" class="collapsed">
                    <a href="#"><i class="fa fa-car fa-lg"></i> New <span class="arrow"></span></a>
                </li>
                <ul class="sub-menu collapse" id="new">
                    <li>New New 1</li>
                    <li>New New 2</li>
                    <li>New New 3</li>
                </ul> --> */}


                <li>
                    <Link to="/search02">
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
