import {  Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import {Outlet, useLocation} from 'react-router-dom'
import HomePage from '../../features/activities/home/HomePage';
import { ToastContainer } from 'react-toastify';



function App() {
  const location = useLocation();

  return (
    //when we load a route, outlet will swapped with the actually component.
    //<ToastContainer position='top-right' hideProgressBar theme='colored'/> Neil's line
    <>
    <ToastContainer position='top-right' theme='colored'/>
    {location.pathname === '/' ? <HomePage /> : (
      <>
      <NavBar />
        <Container style={{marginTop: '7em'}}>
          <Outlet />
        </Container>
      </>
    )}
      
    </>
  );
}

export default observer(App);
