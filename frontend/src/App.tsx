import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import { AuthProvider } from "./providers/auth.provider";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <AuthProvider>
        <Header />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
