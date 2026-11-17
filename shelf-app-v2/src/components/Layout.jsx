import { Outlet } from "react-router";

import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";

function Layout({ books }) {
  return (
    <div className="app">
      <Nav books={books} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
