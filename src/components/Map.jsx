import React from "react";
import GoogleMapReact from "google-map-react";
import LocationPin from "./LocationPin";

const Map = ({ locations }) => {
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: "AIzaSyDaPAVyVamG1LfzcZa3brFYQRzEemSo6qA" }}
      defaultCenter={locations[0]}
      defaultZoom={14}
    >
      {locations.map((location) => (
        <LocationPin
          lat={location.lat}
          lng={location.lng}
          text={location.address}
          key={location.address}
        />
      ))}
    </GoogleMapReact>
  );
};

export default Map;
