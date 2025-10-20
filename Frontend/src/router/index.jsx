import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ChangePassword from '../pages/ChangePassword';
import Booking from '../pages/Booking';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Services from '../pages/Services';
import ServiceDetail from '../pages/ServiceDetail';

// Customer pages
import BookingHistory from '../pages/customer/BookingHistory';
import RateService from '../pages/customer/RateService';

// Admin pages
import ManageServices from '../pages/admin/ManageServices';
import ManageEmployees from '../pages/admin/ManageEmployees';

// Employee pages
import BookingList from '../pages/employee/BookingList';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'services',
                element: <Services />
            },
            {
                path: 'services/:id',
                element: <ServiceDetail />
            },
            {
                path: 'about',
                element: <About />
            },
            {
                path: 'contact',
                element: <Contact />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'booking/:serviceId',
                element: (
                    <ProtectedRoute>
                        <Booking />
                    </ProtectedRoute>
                ),
                errorElement: <ErrorBoundary />
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                )
            },
            {
                path: 'change-password',
                element: (
                    <ProtectedRoute>
                        <ChangePassword />
                    </ProtectedRoute>
                )
            },
            // Customer routes
            {
                path: 'booking-history',
                element: (
                    <ProtectedRoute requiredRole={0}>
                        <BookingHistory />
                    </ProtectedRoute>
                )
            },
            {
                path: 'rate-service/:bookingId',
                element: (
                    <ProtectedRoute requiredRole={0}>
                        <RateService />
                    </ProtectedRoute>
                )
            },
            // Admin routes
            {
                path: 'admin/services',
                element: (
                    <ProtectedRoute requiredRole={1}>
                        <ManageServices />
                    </ProtectedRoute>
                )
            },
            {
                path: 'admin/employees',
                element: (
                    <ProtectedRoute requiredRole={1}>
                        <ManageEmployees />
                    </ProtectedRoute>
                )
            },
            // Employee routes
            {
                path: 'employee/bookings',
                element: (
                    <ProtectedRoute requiredRole={2}>
                        <BookingList />
                    </ProtectedRoute>
                )
            }
        ]
    }
]);

export default router;
