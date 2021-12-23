import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
const Navbar = (props) => {
  const dispatch = useDispatch();
  const mainAccount = useSelector((state) => state?.mainAccount);
  const isSetMainAccount = useSelector((state) => state?.isSetMainAccount);

  const connectBtn = (
    <button
      className="btn btn-primary"
      data-toggle="modal"
      data-target="#myWallet"
      style={{ width: "150px", borderRadius: "50px", background: "#edb329", border: "none" }}
    >
     <span className="fa fa-link"></span> Connect
    </button>
  );
  const address = (
    <button
      className="btn btn-primary text-center"
      style={{ width: "150px", borderRadius: "50px",background: "#edb329", border: "none" }}
    >
      {`${mainAccount.slice(0, 7)}...${mainAccount.slice(37, -1)}`}
    </button>
    
  );
  const logout = () => {
    dispatch({
      type: "SET_MAIN_ACCOUNT",
      payload: { account: "", isSet: false },
    });
  };
  const top = isSetMainAccount ? address : connectBtn;
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav1">
      <img src="img/logo.png" width="70" alt="" />
      <Link
        className="navbar-brand"
        to="/#"
        style={{
          color: "#fff",
          fontSize: "20px",
          fontWeight: "bold",
          marginLeft: "20px",
        }}
      >
        {" "}
       
      </Link>
      
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="row" id="connect-div">
          <div className="con-btn" onClick={logout}>{top}</div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
