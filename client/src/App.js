import './App.css';
import React from 'react';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Homepage from './components/Homepage';
import Room from './components/Room';

// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000');

const App = () => {
    // const [streamId, setStreamID] = useState(null)

    // useEffect(() =>{
    //     socket.on('streamID', (id) => {
    //         setStreamID(id);
    //     })
    // },[])

    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Homepage} />
                <Route path="/:roomID" component={Room} />
            </Switch>
        </Router>
    );
}

export default App