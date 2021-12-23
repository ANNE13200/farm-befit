import React from "react";
import { Link } from "react-router-dom";
import "./Navigate.css";
export default function Navigate() {
  return (
    <div  id="section2" style={{"background":"#edb329"}}>
      <div className="navigate-row">
        <Link to="/token">
          <div className="token-div" style={{background: "#890c08"}}>
            <i className="fa fa-circle-o fa-3x"></i>
            <h3>TOKEN</h3>
          </div>
        </Link>

        <Link to="/">
          <div className="farm-div" style={{background: "#890c08"}}>
            <i className="fa fa-tree fa-3x"></i>
            <h3>FARM</h3>
          </div>
        </Link>

        <Link to="/account">
          <div className="account-div" style={{background: "#890c08"}}>
            <span className="fa fa-user fa-3x"></span>
            <h3>ACCOUNTS</h3>
          </div>
        </Link>
      </div>
    </div>
  );
  }
