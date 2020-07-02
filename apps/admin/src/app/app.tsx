import React from 'react';

import './app.css';

import { Route, Link } from 'react-router-dom';

export const App = () => {
    /*
     * Replace the elements below with your own.
     *
     * Note: The corresponding styles are in the ./app.css file.
     */
    return (
        <div>
            <Route
                path="/"
                exact
                render={() => (
                    <div>
                        This is the generated root route.{' '}
                        <Link to="/page-2">Click here for page 2.</Link>
                    </div>
                )}
            />
            <Route
                path="/page-2"
                exact
                render={() => (
                    <div>
                        <Link to="/">Click here to go back to root page.</Link>
                    </div>
                )}
            />
            {/* END: routes */}
        </div>
    );
};

export default App;
