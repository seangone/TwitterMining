import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Switch, Route, Redirect, NavLink} from "react-router-dom";
import TopicsEditor from './TopicsEditor';
import ScoresDashBoard from './ScoresDashboard';
import * as serviceWorker from './serviceWorker';


const Topics = () => <TopicsEditor/>;
const Sentiments = () => <ScoresDashBoard/>;
const AppRouter = () => (
    <Router>
        <div>
            {/* Navigation Bar*/}
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <NavLink className="navbar-brand" to="/">Twitter Mining</NavLink>
                <div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="nav-link active" to="/topics/">
                                Topics
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="nav-link active" to="/sentiments/">
                                Sentiments
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
            {/* Main Div */}
            <section className="justify-content-center align-items-center row mx-0 px-0 h-100 mw-100">
                <div className="col-12 col-lg-10 px-0 align-self-center" id="main">
                    <Switch>
                        <Route path="/topics/" component={Topics}/>
                        <Route path="/sentiments/" component={Sentiments}/>
                        <Redirect exact from="/" to="/topics/"/>
                    </Switch>
                </div>
            </section>
        </div>
    </Router>
);


ReactDOM.render(<AppRouter/>, document.getElementById('App'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();