import React from "react";
import { useNavigate } from "react-router-dom";

export const Header = (props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/signup"); // Navigate to the CV component route
  };

  return (
    <header id="header">
      <div className="intro">
        <video autoPlay muted loop id="background-video">
          <source src="../img/test.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <button
                  onClick={handleNavigate}
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Start For Free {">"}
                </button>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
