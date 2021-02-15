import { key } from "../key";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import { SwipeableDrawer, Toolbar } from "@material-ui/core";
import { Header } from "./Header";
import { DataTable } from "./Table";

const alignCenter = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledLocation = styled.div`
  position: relative;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 0px solid transparent;
  background: rgba(9, 157, 148, 0.8);
  box-shadow: 0px 0px 1rem rgba(9, 157, 148, 0.6),
    inset 0px 0px 1rem rgba(9, 157, 148, 0.6);
  &:hover,
  &.active {
    transition: all 0.3s ease-in-out;
    border: 0.25rem solid rgb(9, 157, 148);
  }
  &.active {
    background: none;
  }
`;

const Location = ({ place_id, openDetail, handleOpenDetail }) => (
  <StyledLocation
    className={openDetail && "active"}
    onClick={() => handleOpenDetail(place_id, openDetail === false)}
  ></StyledLocation>
);

Location.propTypes = {
  place_id: PropTypes.string,
  openDetail: PropTypes.bool,
  handleOpenDetail: PropTypes.func,
};

const StyledMarker = styled.div`
  ${alignCenter}
  width: .25rem;
  height: 0.25rem;
  background: #ffffff;
  border: 0.25rem solid rgb(14, 255, 241);
  box-shadow: 0px 0px 0.5rem rgba(14, 255, 241, 0.8);
  border-radius: 50%;
`;
const StyledMarkerRange = styled.div`
  ${alignCenter}
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: rgba(14, 255, 241, 0.1);
  box-shadow: inset 0px 0px 2.5rem rgba(14, 255, 241, 0.1);
`;
const Marker = () => (
  <StyledMarkerRange>
    <StyledMarker></StyledMarker>
  </StyledMarkerRange>
);

Marker.propTypes = {
  text: PropTypes.string,
};

const StyledMap = styled.div`
  width: 100%;
  height: 100vh;
`;

export const Map = ({ center, zoom }) => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 25.038705,
    lng: 121.567338,
  });
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);
  const [restaurants, setRestaurants] = useState(null);
  const [openDetail, setOpenDetail] = useState({});

  const handleApiLoaded = ({ map, maps }) => {
    setMapInstance(map);
    setMapApi(maps);
    setMapApiLoaded(true);
  };

  const handleCenterChange = () => {
    if (mapApiLoaded) {
      setCurrentPosition({
        lat: mapInstance.center.lat(),
        lng: mapInstance.center.lng(),
      });
    }
  };

  useEffect(() => {
    if (mapApiLoaded)
      new mapApi.places.PlacesService(mapInstance).nearbySearch(
        {
          location: currentPosition,
          type: "restaurant",
          rankby: "distance",
          radius: 2000,
        },
        (results, status) => {
          if (status === mapApi.places.PlacesServiceStatus.OK) {
            setRestaurants(results);
            const state = {};
            results.forEach((item) => (state[item.place_id] = false));
            setOpenDetail(state);
          }
        }
      );
  }, [mapApiLoaded, mapApi, mapInstance, currentPosition, openDetail]);

  const [drawer, setDrawer] = useState(true);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawer(open);
  };

  const handleOpenDetail = async (target, isOpen) => {
    if (isOpen === false)
      return setOpenDetail({ ...openDetail, [target]: isOpen });
    await new mapApi.places.PlacesService(mapInstance).getDetails(
      {
        placeId: target,
        fields: [
          "formatted_address",
          "formatted_phone_number",
          "opening_hours",
        ],
      },
      (results, status) => {
        if (status === mapApi.places.PlacesServiceStatus.OK) {
          setOpenDetail({
            ...openDetail,
            [target]: {
              formatted_address: results.formatted_address,
              formatted_phone_number: results.formatted_phone_number,
              opening_hours: results.opening_hours,
            },
          });
          setDrawer(true);
        }
      }
    );
  };
  return (
    <>
      <Header drawer={drawer} toggleDrawer={toggleDrawer} />
      <SwipeableDrawer
        anchor={"left"}
        variant="persistent"
        open={drawer}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
      >
        <Toolbar />
        {restaurants && (
          <DataTable
            data={restaurants}
            openDetail={openDetail}
            handleOpenDetail={handleOpenDetail}
          />
        )}
      </SwipeableDrawer>
      <StyledMap>
        <GoogleMapReact
          bootstrapURLKeys={{ key, libraries: ["places"] }}
          onChange={handleCenterChange}
          defaultCenter={center}
          defaultZoom={zoom}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={handleApiLoaded}
        >
          <Marker lat={currentPosition.lat} lng={currentPosition.lng} />
          {restaurants &&
            restaurants.map(({ geometry, name, place_id }) => (
              <Location
                key={name}
                lat={geometry.location.lat()}
                lng={geometry.location.lng()}
                place_id={place_id}
                openDetail={openDetail[place_id] !== false}
                handleOpenDetail={handleOpenDetail}
              />
            ))}
        </GoogleMapReact>
      </StyledMap>
    </>
  );
};

Map.defaultProps = {
  center: { lat: 25.038705, lng: 121.567338 },
  zoom: 16,
};

Map.propTypes = {
  center: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
  zoom: PropTypes.number,
};
