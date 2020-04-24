import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || `http://localhost:8080/joke`;

const StyledBackground = styled.div`
  ${(props) => `
      background: linear-gradient(${props.degrees}deg, #ff000040, #0000ff10);
  `}
`;

function App() {
  const [currentJoke, setCurrentJoke] = useState({
    joke: "",
    joker: "",
  });
  const [newJoke, setNewJoke] = useState({
    joke: "",
    joker: "",
  });
  const [degrees, setDegrees] = useState(45);

  const getJoke = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      const newjoke = Object.assign({}, res.data.joke);
      newjoke.joke = newjoke.joke.replace(/\n/g, "<br />");
      console.log(newjoke);
      setCurrentJoke(newjoke);
      document.getElementById("current-joke").innerHTML = newjoke.joke;
      setDegrees(degrees === 360 ? 45 : degrees * 2);
    } catch (error) {
      console.error(error.message);
    }
  }, [degrees, setCurrentJoke, setDegrees]);

  useEffect(() => {
    getJoke();
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    await getJoke();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_BASE_URL, newJoke);
      alert(`Gracias por tu chiste ${res.data.joke.joker}!`);
      setNewJoke({
        joke: "",
        joker: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReaction = async (liked) => {
    try {
      await axios.put(`${API_BASE_URL}/${currentJoke._id}`, {
        liked,
      });
      await getJoke();
      alert("Gracias por tu voto!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledBackground degrees={degrees} id="main">
      <header align="center" id="app-header">
        <h1 className="centered">Premisa 3</h1>
      </header>
      <section id="joke">
        <div id="joke-data" className="centered">
          <h1 id="current-joke"></h1>
          <p>- {currentJoke.joker}</p>
        </div>
      </section>
      <section align="center" id="actions">
        <div>
          <div id="reactions">
            <button onClick={() => handleReaction(false)}>
              <span role="img" aria-label="poker">
                😐 {currentJoke.votes ? currentJoke.votes.dislike : null}
              </span>
            </button>
            <button onClick={() => handleReaction(true)}>
              <span role="img" aria-label="laugh">
                😂 {currentJoke.votes ? currentJoke.votes.like : null}
              </span>
            </button>
          </div>
          <button onClick={handleClick}>Otro!</button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            id="new-joke"
            placeholder="Ingrese su chiste aquí..."
            value={newJoke.joke}
            onChange={(e) => setNewJoke({ ...newJoke, joke: e.target.value })}
            autoComplete="off"
            required
          />
          <input
            id="new-joker"
            type="text"
            placeholder="Un nombre que mostrar..."
            value={newJoke.joker}
            onChange={(e) => setNewJoke({ ...newJoke, joker: e.target.value })}
            autoComplete="off"
            required
          />
          <input type="submit" value="Guardar" />
        </form>
      </section>
    </StyledBackground>
  );
}

export default App;
