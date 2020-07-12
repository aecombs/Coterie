import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

// function App() {
const App = () => {
  useEffect(() => {
    document.title = "Coterie"
  }, []);

    return (
      <section className="">
        <ReactNotification />
        <Header />
        <Footer />
      </section>
    );
}

export default App;
