import React, { Fragment, useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import Search from "./Search";
import AuthContext from "../../context/auth/authContext";
import DisplayEntities from "./DisplayEntities";
import Map from "./Map";
import Navbar from "../layout/Navbar";


function NerExtract(props) {
  const authContext = useContext(AuthContext);
  const { user, loadUser } = authContext;
  const [loading, setLoading] = useState(false);
  const [maploading, setMapLoading] = useState(false);
  const [city, setCity] = useState("");
  const [entities, setEntities] = useState([]);
  const [entityDetails, setEntityDetails] = useState([]);
  const [entityDisplay, setEntityDisplay] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const extractEntities = async (search) => {
    setCity(search.city);
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("http://127.0.0.1:8000/entities-recognition", search, config);
      setEntities(res.data.entities);
      setEntityDisplay(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getEntityDetails = async () => {
    setMapLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("http://127.0.0.1:8000/geo-details", entities, config);
      setMapLoading(false);
      setEntityDetails(res.data);
      setIsDisplay(true);
      console.log(isDisplay);
      console.log(entityDetails);
      childRef.current.getAlert();
    } catch (err) {
      console.log(err);
    }
  };

  const loadLocalBusiness = async () => {
    childRef.current.getLocalBusinessDetails();
  };

  const childRef = useRef();

  return (
    <>
      <Navbar />
      {!isDisplay && <Search extractEntities={extractEntities} setCity={setCity} displayBlog={isDisplay}/>}
      {/* <Search extractEntities={extractEntities} setCity={setCity} displayBlog={isDisplay}/> */}
      <DisplayEntities entities={entities} setEntities={setEntities} entityDisplay={entityDisplay} loading={loading} />
      <div className="flex">
        <button
          onClick={() => getEntityDetails()}
          class="btn btn-outline-primary"
          style={{
            marginTop: "10px",
            display: entityDisplay ? "inline-block" : "none",
            marginTop: "40px",
            marginRight: "20px",
          }}
        >
          Get Coordinates
        </button>

        <button
          onClick={() => loadLocalBusiness()}
          class="btn btn-outline-primary"
          style={{
            marginTop: "10px",
            display: entityDisplay ? "inline-block" : "none",
            marginTop: "40px",
          }}
        >
          Load Local Business
        </button>
      </div>

      {/* <Map
        ref={childRef}
        entityDetails={entityDetails}
        city={city}
        entityDisplay={entityDisplay}
        maploading={maploading}
      /> */}
    </>
  );
}

export default NerExtract;
