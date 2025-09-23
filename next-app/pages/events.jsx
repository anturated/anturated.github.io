import { useEffect, useState, } from "react"
import "../styles/events.css"


const API_URL = "http://localhost:5000/api/events";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [debugText, setDebugText] = useState("DEBUG");

  useEffect(() => {
    fetch(`${API_URL}/get`)
      .then(res => res.text())
      .then(text => JSON.parse(text))
      .then(evs => setEvents(evs));
  }, []);

  const handleSpam = () => {
    for (let index = 0; index < 200; index++) {
      const response = fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: "019978c4-310e-7737-bd5e-7f4d84ae5e23",
          email: `email${index}`,
          name: "bobik"
        }),
      });
      console.log(`register number ${index} ` + response.ok ? "success" : "fail");
    }
  }

  const handleNuke = () => {
    fetch(`${API_URL}/nuke`);
  }

  const handleInit = () => {
    fetch(`${API_URL}/init`);
  }

  return (
    <>
      <form>
        <input placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input placeholder="name" onChange={e => setName(e.target.value)} />
      </form>

      <h3>{debugText}</h3>
      <button onClick={handleSpam}>spam </button>
      <button onClick={handleInit}>init</button>
      <button onClick={handleNuke}>Nuke</button>

      <ol>
        {events?.map((ev, index) =>
          <Event key={index} ev={ev}
            setEvents={setEvents}
            name={name} email={email}
            setDebugText={setDebugText}
          />
        )}
      </ol>
    </>
  )
}

function Event({ ev, setEvents, email, name, setDebugText }) {
  const handleRegister = async () => {
    console.log(`registering for event ${ev.name} ${ev.id}`);
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: ev.id,
        email: email,
        name: name
      }),
    });

    if (response.ok) {
      const newInfo = JSON.parse(await response.text());

      setEvents((prev) => prev.map(e => e.id === newInfo.id ? newInfo : e));

      setDebugText("registered for event");
    } else {
      setDebugText("error: " + await response.text() ?? "bruh");
    }
  };

  const handleSendEmail = async () => {
    const response = await fetch(`${API_URL}/mail?EventId=${ev.id}&addr=desantua20@gmail.com`);
    if (response.ok)
      setDebugText("email sent");
    else
      setDebugText("email fali");
  }

  const start = (new Date(ev.timeStart)).toLocaleString();
  const end = (new Date(ev.timeEnd)).toLocaleString();

  return <li>
    <p>{ev.name}</p>
    {/* <p>{ev.id}</p> */}
    <p>Start: {start}</p>
    <p>End: {end}</p>
    <p className="slots">{ev.slotsTaken}/{ev.slots}</p>
    <button onClick={ev.slotsTaken >= ev.slots ? handleSendEmail : handleRegister}>
      {ev.slotsTaken >= ev.slots ? "send email" : "register"}
    </button>
  </li>
} 
