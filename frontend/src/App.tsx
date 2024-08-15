import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignIn from './pages/Signin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import ProtectedRoute from './components/general/ProtectedRoute';
import Layout from './layout/Layout';
import Admins from './pages/Admins';
import Events from './pages/Events';
import SignupUser from './pages/SignupUser';
import { Link } from 'react-router-dom';
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
            <Route path="/" element={<Home />} /> {/* Add the Home route */}
            <Route path="/signin" element={<SignIn />} />
            <Route 
              path="/admins" 
              element={<ProtectedRoute roles={['superAdmin']}>
                          <Layout>
                            <Admins />
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
            <Route path="/signupuser" element={<SignupUser />} />
            <Route path="/signinuser" element={<SigninUser />} />
            <Route
              path="/userdashboard"
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


const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  bg-blue-500  p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="sm:flex sm:flex-row">
          <div className="sm:w-1/2 p-6 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to <span className='text-blue-800'>Training and Placement Cell</span>  </h1>
            <p className="text-gray-600 mb-8">
              Join us and take the next step in your career. Sign up or sign in to explore opportunities.
            </p>
            <div className="flex space-x-4">
              <Link to="/signinuser" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</Link>
              <Link to="/signupuser" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App