import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header } from 'semantic-ui-react';
import List from 'semantic-ui-react/dist/commonjs/elements/List';

function App() {

  //we have declared a variable for activities and a function to set the activities when we get them from the server with a state.
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities')
    .then(response => {
      setActivities(response.data);
    }) 
  }, [])

  return (
    
    <div>
      <Header as='h2' icon='users' content='Reactivities'/>
        <List>
          {activities.map((activity: any) => (
            <li key={activity.id}>
              {activity.title}
            </li>
          ))}
        </List>
    </div>
  );
}

export default App;
