import { unstable_HistoryRouter as HistoryRouter,Routes, Route } from 'react-router-dom';
import { history } from './utils/history';
import { AuthComponent } from './compoents/AuthComponent';
import { lazy,Suspense } from 'react';
import './App.css'

//load when needed
const Layout = lazy(() => import('./pages/Layout'))
const Login = lazy(() => import('./pages/Login'))
const Home = lazy(() => import('./pages/Home'))
const Article = lazy(() => import('./pages/Article'))
const Publish = lazy(() => import('./pages/Publish'))


function App() {
  return (
    <HistoryRouter history={history}>
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{
                backgroundColor: '#2c3e50',
                color:'#00aac1',
                textAlign: 'center',
                marginTop: 0,
                padding:'30vh',
                fontSize:'10rem' ,
                height:'100vh',
              }}
            >
              CRYPTO
            </div>            
          }
        >
          <Routes>
            <Route path='/' element={<AuthComponent><Layout/></AuthComponent>}>
              <Route index element={<Home/>}></Route>
              <Route path='article' element={<Article/>}></Route>
              <Route path='publish' element={<Publish/>}></Route>

            </Route>
            <Route path='/login' element={<Login/>}></Route>
          </Routes>
        </Suspense>
      </div>
    </HistoryRouter>
    
  );
}

export default App;
