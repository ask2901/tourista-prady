import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "../../App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

const styles = {
  width: "100vw",
  height: "calc(100vh - 80px)",
  position: "absolute",
};

const Map = forwardRef((props, ref) => {
  const [map, setMap] = useState(null);

  const mapContainer = useRef(null);
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2VzaGcwOTEyIiwiYSI6ImNsZGRlMjNmYzAycWIzb3MwdGxhaTd2aWUifQ.Ah1yPzjAal0Ez-QZC36M2A";

  useImperativeHandle(ref, () => ({
    getAlert() {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [-75.3999866894848, 42.60101025299741],
        zoom: 5,
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });

      // Creates new directions control instance
      var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
        interactive: false,
      });

      // Integrates directions control with map
      map.addControl(directions, "top-left");
      //add waypoints
      // map.on("style.load", function () {
      //   directions.setOrigin([76.68346, 28.99329]);
      //   directions.addWaypoint(0, [77.67999, 29.00393]);
      //   directions.addWaypoint(1, [79.67628, 29.0308]);
      //   // directions.addWaypoint(2, [79.49764, 28.60245]);
      //   directions.setDestination([76.68346, 28.99329]);
      // });

      const placesCoords = [];
      props.entityDetails.forEach(function (entry) {
        var coordinates = [];
        coordinates.push(parseFloat(entry.longitude));
        coordinates.push(parseFloat(entry.latitude));
        placesCoords.push(coordinates);
      });
      console.log(placesCoords);
      for (var i = 0; i < placesCoords.length; i++) {
        directions.addWaypoint(i, placesCoords[i]);
        var k = i + 1;
        var el = document.createElement("div");
        el.className = "marker";
        el.innerHTML = "<span><b>" + k + "</b></span>";
        new mapboxgl.Marker(el)
          .setLngLat(placesCoords[i])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h3>${props.entityDetails[i].title}</h3>
                    <div style="height: 200px; overflow-y: scroll; height: 300px;">
                    <img src="${props.entityDetails[i].image}" alt="Image" style="width: 100%; height: 100px;">
                    <p> ${props.entityDetails[i].description}</p>
                    <a target="_blank" href="${props.entityDetails[i].wiki_url}">Read More on Wikipedia </a>
                  </div>
                    `
              )
              .setMaxWidth("400px")
          )
          .addTo(map);

        map.on("style.load", function () {
          directions.setOrigin(placesCoords[0]);

          directions.setDestination(placesCoords[placesCoords.length - 1]);
        });
      }
    },

    getLocalBusinessDetails() {
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
        interactive: false,
      });

      console.log(props.city);
      fetch(`http://localhost:5000/api/merchant/${props.city}/getmerchants`)
        .then((res) => res.json())
        .then((json) => {
          const details = json;
          const placesCoords = [];
          details.forEach(function (entry) {
            var coordinates = [];
            coordinates.push(parseFloat(entry.longitude));
            coordinates.push(parseFloat(entry.latitude));
            placesCoords.push(coordinates);
          });
          console.log(placesCoords);

          for (var i = 0; i < placesCoords.length; i++) {
            directions.addWaypoint(i, placesCoords[i]);
            var el = document.createElement("div");
            el.className = "local_marker";
            el.innerHTML = "<span><b>" + (i + 1) + "</b></span>";
            new mapboxgl.Marker(el)
              .setLngLat(placesCoords[i])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                  .setHTML(
                    `<h3>${details.name}</h3>
                    <div style="height: 200px; overflow-y: scroll; height: 300px;">
                    <img src="https://images.unsplash.com/photo-1670680307288-dae87434670e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Image" style="width: 100%; height: 100px;">
                    <p> ${details.name}</p>
                  </div>
                    `
                  )
                  .setMaxWidth("400px")
              )
              .addTo(map);
          }
        });
    },
  }));

  const loadLocalBusiness = () => {
    console.log(props.city);
  };

  return (
    <>
      <div
        ref={(el) => (mapContainer.current = el)}
        style={{
          height: "150vh",
          marginTop: "20px",
          marginBottom: "50px",
        }}
      />
    </>
  );
});

export default Map;
