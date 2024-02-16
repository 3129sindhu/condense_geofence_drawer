import { MapContainer,TileLayer, useMap, Marker,Circle,Polygon,useMapEvents, Polyline} from "react-leaflet";
import "../node_modules/leaflet/dist/leaflet.css";
import {
  Row,
  Col,
  Container,
  FormGroup,
  Dropdown,
  InputGroup,
  Form,
  Button
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { featureCollection, point } from "@turf/helpers";
import { circle,polygon,lineString } from "@turf/turf";

const MapComponent = () => {
  const [selectedFenceType, setSelectedFenceType] = useState(null);
  const [radius,setRadius]=useState(0)
  const [Latitude,setLatitude]=useState(0)
  const [Longitude,setLongitude]=useState(0)
  const [circleCenter,setCircleCenter]=useState(null)
  const [geoJson, setGeoJson] = useState(null);
  const [geoJsonPoly,setgeoJsonPoly]=useState(null)
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [polylinePoints, setPolylinePoints] = useState([]);
  const [geoJsonRoute,setgeoJsonRoute]=useState(null)
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isPolySubmitEnabled,setIsPolySubmitEnabled]=useState(false)


  const geoFenceSelector = (e) => {
    setSelectedFenceType(e.target.name);
  };

  const handleRadiusSelector = (e) => {
    const rad=e.target.value*1000
    setRadius(rad)
  };

  const handleLatitudechange = (e) => {   
    setLatitude(parseFloat(e.target.value))
  };

  const handleLongitudeChange = (e) => {
    setLongitude(parseFloat(e.target.value))
  };
  
  const handleSubmit=()=>
  {
    setCircleCenter([Latitude,Longitude])

    // This is for fencegeojson field (to be used later)

  //   const centerPoint = point([Longitude, Latitude]);
  // const options = { steps: 3, units: 'kilometers' }; 
  // const circle1 = circle(centerPoint, radius / 1000, options);

  // const geojson = featureCollection([centerPoint]);
  // geojson.features[0].properties = {
  //   radius: radius/1000
  // };

const geojson={
  fenceRadius:radius/1000,
  Latitude:Latitude,
  Longitude:Longitude
}
  setGeoJson(geojson)
  }

  const handlePolygonMapClick=(e)=>{
    const {lat,lng}=e.latlng
    setPolygonPoints([...polygonPoints,[lat,lng]])
  }

  const handleSubmitPolygon=()=>{

    let points = [...polygonPoints];
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
      points.push(firstPoint);
    }
    const latLngs = points.map((point) => [parseFloat(point[1]), parseFloat(point[0])]);
    const poly = polygon([latLngs]);

    const polyJson={
      fencegeoJson:poly,
    }
    setgeoJsonPoly(polyJson);
  }


  const ClickHandler = ({ onClick }) => {
  
    useMapEvents({
      click: (e) => {
        onClick(e);
      },
    });

    return null;
  };
  const handleMapClick=(e)=>{
    console.log("handlemapclick")
    const {lat,lng}=e.latlng
    console.log("latlng",{lat ,lng})
    setPolylinePoints([...polylinePoints, [lat, lng]]);
    console.log("before set",geoJsonRoute)

  }

  
  const handleSubmitRoute=()=>{
    console.log("polypointslength",polylinePoints.length)
    const coordinates = polylinePoints.map((point) => [point[1], point[0]]);
    const line = lineString(coordinates);
    const routejson={
      fencegeoJson:line,
      fenceRadius:radius/1000

    }
    setgeoJsonRoute(routejson)
    console.log("geojson",geoJsonRoute)
    

  }

  useEffect(() => {
    setCircleCenter(null)
    setPolygonPoints([])
    setGeoJson(null)
    setgeoJsonPoly(null)
    setPolylinePoints([])
    setgeoJsonRoute(null)
    setRadius(null)
    
  }, [selectedFenceType]);

  useEffect(()=>{
    setIsSubmitEnabled(polylinePoints.length>1)
  },[polylinePoints])

  useEffect(()=>{
    setIsPolySubmitEnabled(polygonPoints.length>3)
  },[polygonPoints])

  const position = [12.982867217730057, 77.54874525597238];
 
  return (
    <Container style={{ margin: "5px" }}>
      <Row>
        <Col md={2}>
          <Row>
            <Col xs={12}>
              <h5>Condense Geo-fence</h5>
              {/* <SelectForm
                    labelText="Mode"
                    buttonText={
                      isDrawingEnabled ? "Stop drawing" : "Start drawing"
                    }
                    option={option}
                    options={[
                      {
                        name: "Draw",
                        value: "draw",
                      },
                      {
                        name: "Click",
                        value: "click",
                      },
                    ]}
                    onSubmit={this.handleSubmit}
                    buttonStyle={isDrawingEnabled ? "danger" : "primary"}
                  /> */}
            </Col>
            <Col
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Dropdown>
                <Dropdown.Toggle>
                  {selectedFenceType ?? "Select GeoFence"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item name={"CIRCLE"} onClick={geoFenceSelector}>
                    Circle
                  </Dropdown.Item>
                  <Dropdown.Item name={"POLYGON"} onClick={geoFenceSelector}>
                    Polygon
                  </Dropdown.Item>
                  <Dropdown.Item name={"ROUTE"} onClick={geoFenceSelector}>
                    Route
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs={12} style={{ marginTop: "20px" }}>
              <Container >
                {selectedFenceType === "CIRCLE" && (
                  <Row>
                    <Col xs={12}>
                      <InputGroup size="sm" onChange={handleRadiusSelector}>
                        <InputGroup.Text>
                          <b>Radius</b>
                        </InputGroup.Text>
                        <Form.Control
                        type="number"

                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </InputGroup>
                    </Col>
                    <Col xs={12}>
                      <InputGroup size="sm" onChange={handleLatitudechange}>
                        <InputGroup.Text>
                          <b>Latitude</b>
                        </InputGroup.Text>
                        <Form.Control
                        type="number"

                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </InputGroup>
                    </Col>
                    <Col xs={12}>
                      <InputGroup size="sm" onChange={handleLongitudeChange}>
                        <InputGroup.Text>
                          <b>Longitude</b>
                        </InputGroup.Text>
                        <Form.Control
                        type="number"

                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </InputGroup>
                    </Col>
                    <Col xs={12} style={{ marginTop: "20px" }}>
                    <Button onClick={handleSubmit}>Submit</Button>
                  </Col>
                  {geoJson && (
                     <Row>
                       <Col xs={12} style={{ marginTop: "20px" }}>
                         <h5>Json:</h5>
                           <pre style={{overflow:"unset"}}>{JSON.stringify(geoJson, null, 2)}</pre>
                        </Col>
                      </Row>
                   )}
                  </Row>
                )}
                {selectedFenceType==="POLYGON" &&(
                  <div >
                   
                  <h5>Selected Points:</h5>
                  <table className="table" >
                    <thead>
                      <tr>
                        <th>Latitude</th>
                        <th>Longitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {polygonPoints.map((point, index) => (
                        <tr key={index}>
                          <td>{point[0]}</td>
                          <td>{point[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Col xs={12} style={{ marginTop: "20px" }}>
                    <Button onClick={handleSubmitPolygon } disabled={!isPolySubmitEnabled}>Submit</Button>
                  </Col>

                  {geoJsonPoly && (
                     <Row>
                       <Col xs={12} style={{ marginTop: "20px" }}>
                         <h5>Json:</h5>
                           <pre style={{overflow:"unset"}}>{JSON.stringify(geoJsonPoly, null, 2)}</pre>
                        </Col>
                      </Row>
                   )}
                  </div>
                )} 
                {selectedFenceType==="ROUTE"&&(
                  <div >
                     <Col xs={12}>
                      <InputGroup size="sm" onChange={handleRadiusSelector}>
                        <InputGroup.Text>
                          <b>Radius</b>
                        </InputGroup.Text>
                        <Form.Control
                        type="number"

                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </InputGroup>
                    </Col>
                  <h5>Selected Points:</h5>
                  <table className="table" >
                    <thead>
                      <tr>
                        <th>Latitude</th>
                        <th>Longitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {polylinePoints.map((point, index) => (
                        <tr key={index}>
                          <td>{point[0]}</td>
                          <td>{point[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Col xs={12} style={{ marginTop: "20px" }}>
                    <Button onClick={handleSubmitRoute } disabled={!isSubmitEnabled}>Submit</Button>
                  </Col>

                  {geoJsonRoute &&(
                     <Row>
                       <Col xs={12} style={{ marginTop: "20px" }}>
                         <h5>Json:</h5>
                           <pre style={{overflow:"unset"}}>{JSON.stringify(geoJsonRoute, null, 2)}</pre>
                        </Col>
                      </Row>
                   )}

                </div>
                )}
              </Container>
            </Col>
          </Row>
        </Col>

        <Col sm={12} md={10} lg={10}>
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{
              height: "100vh",
              width: "100%",
              marginLeft:"15%"
            }}
            gestureHandling={true}
          >
           
            {circleCenter&&(
              <>
                            <Circle
                                center={circleCenter}
                                radius={radius}
                                fillColor="#f44242"
                                color="#f44242"
                                
                            />
                            <Marker position={circleCenter}></Marker>
                            </>)
                            }
                            {
                              polygonPoints&& selectedFenceType==="POLYGON" &&(
                                <>
                                <ClickHandler onClick={handlePolygonMapClick} />
                                <Polygon positions={polygonPoints}></Polygon>
                                </>
                              )
                            }
                            {polylinePoints && selectedFenceType==="ROUTE" &&(
                              <>
                             <ClickHandler onClick={handleMapClick} />
                             <Polyline positions={polylinePoints} color="blue" />
                             </>
                            )
                            }
                          
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              
            />
            
          </MapContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default MapComponent;
