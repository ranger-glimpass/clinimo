// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Layout from './components/Layout';
import Assistants from './components/Assistants';
import ProtectedRoute from './auth/ProtectedRoute'; // Import ProtectedRoute
import CallLogs from './components/CallLogs';
import Account from './components/Account';
import CallDetails from './components/CallDetails';
import Staff from './components/Staff';
import MakeCall from './components/MakeCall';
import Registration from './components/Registration';
import CallReport from './components/CallReport';
import CreateIVR from './components/CreateIVR';
import MakeExoCall from './components/MakeExoCall';
import CallExoReport from './components/CallExoReport'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/assistants" element={
                    <ProtectedRoute>
                        <Layout>
                            <Assistants />
                        </Layout>
                    </ProtectedRoute>
                } />
                {/* // In your App.js or where you manage routing */}
                <Route path="/call-logs" element={
                    <ProtectedRoute>
                        <Layout>
                            <CallLogs />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/call-reports" element={
                    <ProtectedRoute>
                        <Layout>
                            <CallReport />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/account" element={
                    <ProtectedRoute>
                        <Layout>
                            <Account />
                        </Layout>
                    </ProtectedRoute>
                } />
                 <Route path="/staff" element={
                    <ProtectedRoute>
                        <Layout>
                            <Staff />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/make-call" element={
                    <ProtectedRoute>
                        <Layout>
                            <MakeCall />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/make-exo-call" element={
                    <ProtectedRoute>
                        <Layout>
                            <MakeExoCall />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/get-exo-call" element={
                    <ProtectedRoute>
                        <Layout>
                            <CallExoReport />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/create-ivr" element={
                    <ProtectedRoute>
                        <Layout>
                            <CreateIVR />
                        </Layout>
                    </ProtectedRoute>
                } />
 <Route path="/call-details/:callId" element={
                    <ProtectedRoute>
                        <Layout>
                            <CallDetails />
                        </Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
