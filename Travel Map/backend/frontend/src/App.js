import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from "@mui/icons-material";
import "./app.css";
import { axiosInstance } from "./connection";
import { format } from "timeago.js";
//import 'mapbox-gl/dist/mapbox-gl.css'
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null)
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [newPlace, setNewPlace] = useState(null);
  const [showregister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.78,
    longitude: -122.41,
    zoom: 8
  });


  useEffect(() => {
    const getPins = async ()=> {
      try{
        const res = await axiosInstance.get("/pins");
        setPins(res.data)
      }catch (err) {
        console.log(err);
      }
    };
    getPins()
  },[])

  const handleMarkerClick = (id, lat, long)=>{
    setCurrentPlaceId(id)
    setViewport({...viewport, latitude:lat, longitude:long})
  };

  const handleAddClick = (e)=>{
    const[long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  }; 

  const handleSubmit = async (e)=> {
    e.preventDefault()
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long: newPlace.long 
    }
    try{
      const res = await axiosInstance.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    }catch(err){
      console.log(err)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };


  return (
    <div className="App">
      <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/admintester/ckvj19w7j1fob14o5a7piiglh"
      onDblClick = {handleAddClick}
    >

      {pins.map(p=>(<>
        <Marker
          latitude={p.lat}
          longitude={p.long}
          offsetLeft={-viewport.zoom * 3.5}
          offsetTop={-viewport.zoom * 7}
        >
          <Room 
            style={{fontSize:viewport.zoom * 7, color: p.username===currentUser? "tomato": "slateblue", cursor:"pointer"}}
            onClick={()=>handleMarkerClick(p._id, p.lat, p.long)}
          />
        </Marker>
        {p._id === currentPlaceId && (
        <Popup
            latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={()=>setCurrentPlaceId(null)} 
            >
            <div className="card">
              <label>Place</label>
              <h4 className="place">{p.title}</h4>
              <label>Review</label>
              <p className="desc">{p.desc}</p>
              <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<Star className="star" />)}

                </div>
              <label>Information</label>
              <span className="username">Created By: <b>{p.username}</b></span>
              <span className="date">{format(p.createdAt)}</span>
              </div>
        </Popup>
      )}
    </>
    ))}
    {newPlace && ( 
    <Popup
    latitude={newPlace.lat}
    longitude={newPlace.long}
    closeButton={true}
    closeOnClick={false}
    anchor="left"
    onClose={()=>setNewPlace(null)} 
    >
      <div>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input 
            placeholder="enter a title" 
            onChange={(e)=>setTitle(e.target.value)}
          />
          <label>Review</label>
          <textarea 
            placeholder="say something about this place"
            onChange={(e)=>setDesc(e.target.value)}
          />
          <label>Rating</label>
          <select onChange={(e)=>setRating(e.target.value)}>  
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button className="submitButton" type="submit">Add Pin</button>
        </form>
      </div>
    </Popup>
    )}

    {currentUser? 
        (<button className="button logout" onClick={handleLogout}>Log Out</button>)
      : 
        (<div className="buttons">
          <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
          <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
        </div>
    )}
    {showregister && <Register setShowRegister={setShowRegister} />}
    {showLogin && 
      <Login setShowLogin={setShowLogin} 
             myStorage={myStorage} 
             setCurrentUser={setCurrentUser} />} 
    </ReactMapGL>
    </div>
  );
}

export default App;
