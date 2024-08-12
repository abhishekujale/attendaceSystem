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
import SignupUser from './pages/SignupUser';
import SigninUser from './pages/SigninUser';
import UserDashboard from './pages/UserDashboard';
import EventPage from './pages/EventPage';



function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/signin" element={<SignIn/>} />
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute roles={['admin','superAdmin']}>
                          <Layout>
                            <Dashboard/>
                          </Layout>
                        </ProtectedRoute>}
            />
              
            
            <Route 
                path="/admins" 
                element={<ProtectedRoute roles={['superAdmin']}>
                            <Layout>
                              <Admins/>
                            </Layout>
                          </ProtectedRoute>}
            />
            
            <Route 
                path="/events" 
                element={<ProtectedRoute roles={['admin','superAdmin']}>
                  <Layout>
                    <Events />
                  </Layout>
                </ProtectedRoute>}
            />
            <Route 
                path="/event/:eventId" 
                element={<ProtectedRoute roles={['superAdmin']}>
                  <Layout>
                    <EventPage />
                  </Layout>
                </ProtectedRoute>}
            />
            
            <Route 
              path="/signupuser" 
              element={<SignupUser />}
            />
            
            <Route 
              path="/signinuser" 
              element={<SigninUser />}
            />
            
            <Route
              path='userdashboard'
              element={
                <ProtectedRoute roles={['user']}>
                  <Layout>
                    <UserDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
    
  );
}


export default App