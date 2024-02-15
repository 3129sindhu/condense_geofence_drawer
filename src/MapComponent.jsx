import { MapContainer, TileLayer, useMap, Marker,Circle,Polygon} from "react-leaflet";
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
import { circle,polygon } from "@turf/turf";

const MapComponent = () => {
  const [selectedFenceType, setSelectedFenceType] = useState(null);
  const [radius,setRadius]=useState(0)
  const [Latitude,setLatitude]=useState(0)
  const [Longitude,setLongitude]=useState(0)
  const [circleCenter,setCircleCenter]=useState(null)
  const [geoJson, setGeoJson] = useState(null);
  const [geoJsonPoly,setgeoJsonPoly]=useState(null)
  const [polygonPoints, setPolygonPoints] = useState([]);


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

  const addPoint = () => {
    setPolygonPoints([...polygonPoints, [0, 0]]);
  };

  const handleLatitudeChangePolygon= (index, value) => {
    const newPoints = [...polygonPoints];
    newPoints[index] = [value, newPoints[index][1]];
    setPolygonPoints(newPoints);
  };

  const handleLongitudeChangePolygon = (index, value) => {
    const newPoints = [...polygonPoints];
    newPoints[index] = [newPoints[index][0], value];
    setPolygonPoints(newPoints);
  };

  const handleSubmitPolygon=()=>{
    const latLngs = polygonPoints.map((point) => [parseFloat(point[1]), parseFloat(point[0])]);
    const poly = polygon([latLngs]);

    const polyJson={
      fencegeoJson:poly
    }
    setgeoJsonPoly(polyJson);
  }

  useEffect(() => {
    setCircleCenter(null)
    setPolygonPoints([])
    setGeoJson(null)
    setgeoJsonPoly(null)
    
  }, [selectedFenceType]);

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
                         <h5>Data:</h5>
                           <pre style={{overflow:"unset"}}>{JSON.stringify(geoJson, null, 2)}</pre>
                        </Col>
                      </Row>
                   )}
                  </Row>
                )}
                {selectedFenceType==="POLYGON" &&(
                  <Row>
                    <Col xs={12} style={{ marginTop: "20px" }}>
                    <Button onClick={addPoint} >Add Point</Button>
                  </Col>
                 

                  <Col xs={12}>
          {polygonPoints.map((point, index) => (
            <Row key={index}>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Latitude"
                  value={point[0]}
                  onChange={(e) => handleLatitudeChangePolygon(index, e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Longitude"
                  value={point[1]}
                  onChange={(e) => handleLongitudeChangePolygon(index, e.target.value)}
                />
              </Col>
            </Row>
          ))}
        </Col>
                 <Col xs={12} style={{ marginTop: "20px" }}>
                    <Button onClick={handleSubmitPolygon}>Submit</Button>
                  </Col>

                  {geoJsonPoly && (
                     <Row>
                       <Col xs={12} style={{ marginTop: "20px" }}>
                         <h5>Data:</h5>
                           <pre style={{overflow:"unset"}}>{JSON.stringify(geoJsonPoly, null, 2)}</pre>
                        </Col>
                      </Row>
                   )}
                  </Row>
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
              marginLeft:"10%"
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
                              polygonPoints&&(
                                <Polygon positions={polygonPoints}></Polygon>
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
