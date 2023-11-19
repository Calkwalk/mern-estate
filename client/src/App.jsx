import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Home, About, Profile, SignIn, SignOut, SignUp} from './pages';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
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
          <Route path='/profile' element={ <Profile />  } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;