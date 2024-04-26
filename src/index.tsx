import React from 'react';
import ReactDOM from 'react-dom/client';

import { store } from './app/store';
// import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import HomePage  from './pages/HomePage';
import ProfilesPage from './pages/ProfilesPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    children: [
      {
        path: '/profile/:profileId',
      },
    ],
  },
  {
    path: "/profiles",
    element: <ProfilesPage />,
    children: [
      {
        path: '/profiles/:profileId',
        element: <ProfilePage />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    {/* <React.StrictMode> */}
      {/* <Provider store={store}> */}
        <RouterProvider router= {router} />
        {/* <App /> */}
      {/* </Provider> */}
    {/* </React.StrictMode> */}
  </>
);