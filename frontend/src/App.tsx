import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignIn from './pages/Signin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import ProtectedRoute from './components/general/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Layout from './layout/Layout';
import Admins from './pages/Admins';
import Events from './pages/Events';


function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/signin" element={<SignIn/>}></Route>
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute>
                          <Layout>
                            <Dashboard/>
                          </Layout>
                        </ProtectedRoute>}
            >
              
            </Route>
            <Route 
                path="/admins" 
                element={<ProtectedRoute>
                            <Layout>
                              <Admins/>
                            </Layout>
                          </ProtectedRoute>}
            >
            </Route>
            <Route 
                path="/events" 
                element={<ProtectedRoute>
                            <Layout>
                              <Events />
                            </Layout>
                          </ProtectedRoute>}
            >
            </Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
    
  );
}


export default App