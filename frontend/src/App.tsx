import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignIn from './pages/Signin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';


function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/signin" element={<SignIn/>}></Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
    
  );
}


export default App