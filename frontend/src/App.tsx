import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { NavigationHeader } from './components/NavigationHeader';
import { LandingPage } from './components/LandingPage';
import { SearchResults } from './components/SearchResults';
import { ListingDetails } from './components/ListingDetails';
import { Messages } from './components/Messages';
import { RoommateMatching } from './components/RoommateMatching';
import { OwnerDashboard } from './components/OwnerDashboard';
import { LoginRegister } from './components/LoginRegister';
import { Verification } from './components/Verification';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider

/**
 * MainApp component
 * We create this sub-component so it has access to the `useAuth` hook,
 * which it wouldn't have if it were in the `App` component itself
 * (since AuthProvider needs to be its parent).
 */
function MainApp() {
  const { isLoggedIn, user, login } = useAuth(); // Get auth state from context
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page: string, propertyId?: string) => {
    // This function is now simpler.
    // The LoginRegister component will call `login()` directly.
    // We just handle navigation.

    let path = `/${page}`;
    if (propertyId) {
      path = `/${page}/${propertyId}`;
    }

    navigate(path);
    window.scrollTo(0, 0);
  };

  const currentPagePath = location.pathname;
  const showHeader =
    currentPagePath !== '/login' &&
    currentPagePath !== '/register' &&
    currentPagePath !== '/verification';

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <NavigationHeader
          onNavigate={handleNavigate}
          currentPage={currentPagePath}
          // Pass real auth state from context
          isLoggedIn={isLoggedIn}
          userType={user?.role}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={<LandingPage onNavigate={handleNavigate} />}
        />
        <Route
          path="/landing"
          element={<LandingPage onNavigate={handleNavigate} />}
        />
        <Route
          path="/search"
          element={<SearchResults onNavigate={handleNavigate} />}
        />
        <Route
          path="/listing/:id"
          element={<ListingDetails onNavigate={handleNavigate} />}
        />
        <Route path="/messages" element={<Messages />} />
        <Route
          path="/roommate"
          element={<RoommateMatching onNavigate={handleNavigate} />}
        />
        <Route
          path="/dashboard"
          element={<OwnerDashboard onNavigate={handleNavigate} />}
        />
        <Route
          path="/login"
          // We pass the `login` function to LoginRegister
          element={<LoginRegister onNavigate={handleNavigate} mode="login" />}
        />
        <Route
          path="/register"
          element={<LoginRegister onNavigate={handleNavigate} mode="register" />}
        />
        <Route
          path="/verification"
          element={<Verification onNavigate={handleNavigate} />}
        />
        <Route
          path="/users/verify/:uid/:token"
          element={
            <div className="text-center p-8">
              <h2 className="text-2xl">Verifying your email...</h2>
              <p>Please wait.</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

/**
 * App component
 * This is now just the entry point that provides the AuthContext.
 * Make sure AuthProvider WRAPS MainApp.
 */
export default function App() {
  return (
    <AuthProvider children={undefined}>
      <MainApp />
    </AuthProvider>
  );
}