import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Home, About, Profile, SignIn, SignOut, SignUp, CreateList} from './pages';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import UpdateList from './pages/UpdateList';
import Listing from './pages/Listing';
function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/'         element={ <Home />      } />
        <Route path='/about'    element={ <About />     } />
        <Route path='/signin'   element={ <SignIn />    } />
        <Route path='/signout'  element={ <SignOut />   } />
        <Route path='/signup'   element={ <SignUp />    } />
        <Route element={<PrivateRoute />}>
          <Route path='/profile'      element={ <Profile />    } />
          <Route path='/createlist'   element={ <CreateList /> } />
          <Route path='/updatelist/:id'   element={ <UpdateList /> } />
          <Route path='/listing/:id'   element={ <Listing /> } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;