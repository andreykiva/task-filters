import React from "react";
import Header from "./Header/Header";
import CallApi from "../api/api";
import Cookies from "universal-cookie";
import MoviesPage from "./pages/MoviesPage/MoviesPage";
import MoviePage from './pages/MoviePage/MoviePage';
import { BrowserRouter, Route } from "react-router-dom";

const cookies = new Cookies();

export const AppContext = React.createContext();

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: null,
      session_id: null,
      showModal: false,
      
    };
  }

  updateUser = (user) => {
    this.setState({
      user,
    });
  };

  updateSessionId = (session_id) => {
    cookies.set("session_id", session_id, {
      path: "/",
      maxAge: 2592000,
    });
    this.setState({
      session_id,
    });
  };

  onLogOut = () => {
    cookies.remove("session_id");

    this.setState({
      session_id: null,
      user: null,
      showModal: false,
    });
  };

  toggleModal = () => {
    this.setState((prev) => ({
      showModal: !prev.showModal,
    }));
  };

  componentDidMount() {
    const session_id = cookies.get("session_id");
    if (session_id) {
      CallApi.get("/account", {
        params: {
          session_id: session_id,
        },
      }).then((user) => {
        this.updateUser(user);
        this.updateSessionId(session_id);
      });
    }
  }

  render() {
    const {
      user,
      session_id,
      showModal,
    } = this.state;

    return (
      <BrowserRouter>
        <AppContext.Provider
          value={{
            user,
            session_id,
            showModal,
            updateUser: this.updateUser,
            updateSessionId: this.updateSessionId,
            onLogOut: this.onLogOut,
            toggleModal: this.toggleModal
          }}
        >
          <div>
            <Header />
            <Route exact path="/" component={MoviesPage} />
            <Route exact path="/movie/:id" component={MoviePage} />
          </div>
        </AppContext.Provider>
      </BrowserRouter>
    );
  }
}
