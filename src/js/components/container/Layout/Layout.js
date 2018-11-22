import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import SearchPage01 from '../searchPage01/SearchPage01';
import SearchPage02 from '../searchPage02/SearchPage02';
import SideBar from '../sideBar/SideBar';



export default class Layout extends Component {



  render() {
    return (
      <div className="layout">
        <BrowserRouter >
          <div>

            <SideBar />

            <Route exact path="/" component={SearchPage01} />
            <Route path="/search01" component={SearchPage01}></Route>
            <Route path="/search02" component={SearchPage02}></Route>
            {/* <Redirect from="/" to="search01" /> */}
          </div>
        </BrowserRouter>

        {this.props.children}
      </div>
    )
  }
}

ReactDOM.render(<Layout />, document.getElementById('root'));
