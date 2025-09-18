import {useEffect, useState} from "react";
import logo from './logo.svg';
import './App.css';
// import List from './components/List'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://anturated-cnepggaggjegayfp.polandcentral-01.azurewebsites.net/api/TestFunction")
    .then((res) => res.text())
    .then((data) => setMessage(data));
  }, []);

  return (
    <div className="App">
      <h1>sample text</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
