import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export const GoogleMap = () => {
    const defaultProps = {
      center: {
        lat: 19.275857672079727, 
        lng: -99.66041675424353
      },
      zoom: 18
    };
  return (
    <div style={{height: '40vh' }}>
      <GoogleMapReact
      key={"388732565456-lup0fl535o3f07ja29ha5cl2sqjkl3kd.apps.googleusercontent.com"}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={19.275857672079727}
          lng={-99.66041675424353}
          text="CarWash autolavado y más "
        />
      </GoogleMapReact>
    </div>
  )
}
