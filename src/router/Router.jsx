import { Form, Link, Outlet, useFetcher, useRouteLoaderData } from "react-router-dom";
import {
  RouterProvider, createBrowserRouter,
  redirect,
  useActionData,
  useLocation,
  useNavigation
} from 'react-router-dom';

import NotFoundPage from '../pages/NotFoundPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import ProfilesPage from '../pages/ProfilesPage';
import { fakeAuthProvider } from '../auth/Auth';

    
export default function Router() {
    const router = createBrowserRouter([
          { id: "root",
            path: "/",
            element: <HomePage />,
            loader() {
              // Our root route always provides the user, if logged in
              return { user: fakeAuthProvider.username };
            },
            Component: Layout,
            errorElement: <NotFoundPage />,
            children: [
                  {
                    index: true,
                    Component: PublicPage,
                  },
                  {
                    path: "login",
                    action: loginAction,
                    loader: loginLoader,
                    Component: LoginPage,
                  },
                  {
                    path: "protected",
                    loader: protectedLoader,
                    Component: ProtectedPage,
                  }, 

            ],
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
          },
          {
            path: "/logout",
            async action() {
              // We signout in a "resource route" that we can hit from a fetcher.Form
              await fakeAuthProvider.signout();
              return redirect("/");
            },
          },
      ]);
    
    return (
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>}/>
      )
}

function Layout() {
  return (
    <div>
      <h1>Auth Example using RouterProvider</h1>

      <p>
        Ví dụ này minh họa luồng đăng nhập đơn giản với ba trang: trang công khai,
        trang được bảo vệ và trang đăng nhập. Để xem trang được bảo vệ, trước tiên
        bạn phải đăng nhập. Pretty standard stuff.
      </p>

      <p>
        Đầu tiên, hãy truy cập trang công khai. Sau đó, hãy truy cập trang được bảo vệ.
        Bạn chưa đăng nhập nên bạn được chuyển hướng đến trang đăng nhập.
        Sau khi đăng nhập, bạn sẽ được chuyển hướng trở lại trang được bảo vệ.
      </p>

      <p>
        Chú ý sự thay đổi URL mỗi lần. Nếu bạn nhấp vào nút quay lại vào thời điểm này,
        bạn có muốn quay lại trang đăng nhập không? KHÔNG! Bạn đã đăng nhập.
        Hãy dùng thử và bạn sẽ thấy mình quay lại trang bạn đã truy cập ngay *trước khi*
        đăng nhập, trang công khai.
      </p>

      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

function AuthStatus() {
  // Get our logged in user, if they exist, from the root route loader data
  let { user } = useRouteLoaderData("root");
  let fetcher = useFetcher();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  let isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <p>Welcome {user}!</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
    </div>
  );
}

async function loginAction({ request }) {
  let formData = await request.formData();
  let username = formData.get("username");

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await fakeAuthProvider.signin(username);
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
    return {
      error: "Invalid login attempt",
    };
  }

  let redirectTo = formData.get("redirectTo") ;
  return redirect(redirectTo || "/");
}

async function loginLoader() {
  if (fakeAuthProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}

function LoginPage() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get("from") || "/";

  let navigation = useNavigation();
  let isLoggingIn = navigation.formData?.get("username") != null;

  let actionData = useActionData() ;

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={from} />
        <label>
          Username: <input name="username" />
        </label>{" "}
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function protectedLoader({ request }) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!fakeAuthProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}