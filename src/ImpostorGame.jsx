
import { useState } from "react";
import { Link } from "react-router-dom";
import { impostorWordBank } from "./data/impostorWords";
import "./ImpostorGame.css";

function ImpostorGame() {
  const [playerCount, setPlayerCount] = useState(3);
  const [names, setNames] = useState(["", "", ""]);
  const [withHints, setWithHints] = useState(true);
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(null);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [stage, setStage] = useState("setup");
  const [confirmed, setConfirmed] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [starterIndex, setStarterIndex] = useState(0);
  const [showImpostor, setShowImpostor] = useState(false);
  const [error, setError] = useState("");

  const changePlayerCount = (value) => {
    const newCount = Math.min(10, Math.max(3, value));

    setPlayerCount(newCount);
    setNames((previous) =>
      Array.from(
        { length: newCount },
        (_, index) => previous[index] || ""
      )
    );
    setError("");
  };

  const changeName = (index, value) => {
    setNames((previous) =>
      previous.map((name, i) => i === index ? value : name)
    );
  };

  const startRound = (selectedPlayers) => {
    const themes = Object.keys(impostorWordBank);
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const words = impostorWordBank[theme];
    const selectedWord = words[Math.floor(Math.random() * words.length)];

    const hint = selectedWord.hints[
      Math.floor(Math.random() * selectedWord.hints.length)
    ];

    const impostorIndex = Math.floor(
      Math.random() * selectedPlayers.length
    );

    setPlayers(selectedPlayers);

    setRound({
      theme,
      word: selectedWord.word,
      hint,
      impostorIndex
    });

    setPlayerIndex(0);
    setConfirmed(false);
    setIsRevealed(false);
    setHasViewed(false);
    setStarterIndex(Math.floor(Math.random() * selectedPlayers.length));
    setShowImpostor(false);
    setStage("reveal");
  };

  const handleStartGame = (event) => {
    event.preventDefault();

    const finalNames = names
      .slice(0, playerCount)
      .map((name) => name.trim());

    if (finalNames.some((name) => !name)) {
      setError("Preencha o nome de todos os jogadores.");
      return;
    }

    const uniqueNames = new Set(
      finalNames.map((name) => name.toLowerCase())
    );

    if (uniqueNames.size !== finalNames.length) {
      setError("Cada jogador precisa ter um nome diferente.");
      return;
    }

    startRound(finalNames);
  };

  const handleRevealStart = (event) => {
    event.preventDefault();

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    setHasViewed(true);
    setIsRevealed(true);
  };

  const handleRevealEnd = () => {
    setIsRevealed(false);
  };

  const nextPlayer = () => {
    if (playerIndex < players.length - 1) {
      setPlayerIndex((previous) => previous + 1);
      setConfirmed(false);
      setIsRevealed(false);
      setHasViewed(false);
    } else {
      setStage("discussion");
    }
  };

  const playAgain = () => {
    startRound(players);
  };

  const currentPlayerIsImpostor =
    round && playerIndex === round.impostorIndex;

  return (
    <main className="app-shell impostor-app">
      <header className="topbar">
        <Link to="/" className="impostor-home-link">
          ← Início
        </Link>

        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>MINIGAMES</span>
        </div>
      </header>

      {stage === "setup" && (
        <>
          <section className="impostor-intro">
            <span className="eyebrow">MINIGAME</span>
            <h1>
              O <span>Impostor</span>
            </h1>
            <p>
              Todos recebem uma palavra, menos o impostor.
              Descubra quem está fingindo saber qual é!
            </p>
          </section>

          <form className="impostor-panel" onSubmit={handleStartGame}>
            <div className="impostor-panel-heading">
              <h2>Quem vai jogar?</h2>
              <span>3 a 10 jogadores</span>
            </div>

            <div className="player-counter">
              <button
                type="button"
                className="counter-button"
                disabled={playerCount === 3}
                onClick={() => changePlayerCount(playerCount - 1)}
              >
                −
              </button>

              <div className="counter-value">
                <strong>{playerCount}</strong>
                <span>jogadores</span>
              </div>

              <button
                type="button"
                className="counter-button"
                disabled={playerCount === 10}
                onClick={() => changePlayerCount(playerCount + 1)}
              >
                +
              </button>
            </div>

            <div className="player-fields">
              {names.slice(0, playerCount).map((name, index) => (
                <label className="player-field" key={index}>
                  <span>JOGADOR {index + 1}</span>
                  <input
                    type="text"
                    placeholder={`Nome do jogador ${index + 1}`}
                    value={name}
                    maxLength={20}
                    onChange={(event) =>
                      changeName(index, event.target.value)
                    }
                  />
                </label>
              ))}
            </div>

            <label className="hint-option">
              <span className="hint-option-copy">
                <strong>Usar dicas?</strong>
                <small>
                  O impostor recebe uma dica vaga sobre a palavra.
                </small>
              </span>

              <input
                className="hint-checkbox"
                type="checkbox"
                checked={withHints}
                onChange={(event) => setWithHints(event.target.checked)}
              />

              <span className="hint-switch"></span>
            </label>

            {error && (
              <p className="impostor-error">{error}</p>
            )}

            <button type="submit" className="primary-button">
              Começar jogo <span>→</span>
            </button>
          </form>
        </>
      )}

      {stage === "reveal" && round && (
        <>
          <section className="game-progress">
            <div className="progress-heading">
              <span>DISTRIBUIÇÃO DAS PALAVRAS</span>
              <strong>{playerIndex + 1}/{players.length}</strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${((playerIndex + 1) / players.length) * 100}%`
                }}
              ></div>
            </div>
          </section>

          {!confirmed ? (
            <section className="turn-card">
              <div className="turn-icon">👤</div>

              <span className="eyebrow">VEZ DE</span>
              <h2>{players[playerIndex]}</h2>

              <p>
                Passe o celular para essa pessoa.
                Confirme sua identidade antes de revelar a informação.
              </p>

              <button
                className="primary-button"
                onClick={() => setConfirmed(true)}
              >
                Sou {players[playerIndex]} <span>→</span>
              </button>
            </section>
          ) : (
            <section className="turn-card">
              <span className="eyebrow">AGORA É COM VOCÊ</span>
              <h2>{players[playerIndex]}</h2>

              <p>
                Segure o botão abaixo para revelar sua informação.
                Solte para escondê-la.
              </p>

              <button
                type="button"
                className={`reveal-button ${isRevealed ? "is-revealed" : ""}`}
                onPointerDown={handleRevealStart}
                onPointerUp={handleRevealEnd}
                onPointerCancel={handleRevealEnd}
                onLostPointerCapture={handleRevealEnd}
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Segure para revelar sua informação"
              >
                {isRevealed ? (
                  <div className="secret-content">
                    {currentPlayerIsImpostor ? (
                      <>
                        <span className="role-label impostor-label">
                          VOCÊ É O IMPOSTOR
                        </span>

                        <span className="secret-theme">
                          Tema: {round.theme}
                        </span>

                        {withHints && (
                          <span className="secret-hint">
                            Dica: {round.hint}
                          </span>
                        )}

                        {!withHints && (
                          <span className="secret-hint">
                            Descubra a palavra observando os outros jogadores.
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="role-label">
                          SUA PALAVRA SECRETA
                        </span>
                        <strong className="secret-word">
                          {round.word}
                        </strong>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="reveal-prompt">
                    <span>👆</span>
                    <strong>Aperte e segure para revelar</strong>
                    <small>Solte para esconder</small>
                  </div>
                )}
              </button>

              {hasViewed && !isRevealed && (
                <button
                  className="primary-button next-player-button"
                  onClick={nextPlayer}
                >
                  {playerIndex === players.length - 1
                    ? "Finalizar revelações"
                    : "Passar para o próximo"}
                  <span>→</span>
                </button>
              )}

              <p className="private-note">
                Não deixe os outros jogadores verem sua informação!
              </p>
            </section>
          )}
        </>
      )}

      {stage === "discussion" && (
        <section className="discussion-screen">
          {!showImpostor ? (
            <>
              <div className="discussion-icon">🗣️</div>

              <span className="eyebrow">TODOS JÁ RECEBERAM SUAS PALAVRAS</span>
              <h1>
                Hora de <span>discutir!</span>
              </h1>

              <p>
                Cada jogador deve dar suas pistas sem revelar
                diretamente a palavra. Tentem descobrir quem está
                fingindo saber!
              </p>

              <div className="starter-box">
                <span>QUEM COMEÇA FALANDO?</span>
                <strong>{players[starterIndex]}</strong>
                <small>O primeiro a dar uma pista será essa pessoa.</small>
              </div>

              <button
                className="primary-button reveal-impostor-button"
                onClick={() => setShowImpostor(true)}
              >
                Revelar o impostor <span>→</span>
              </button>
            </>
          ) : (
            <>
              <div className="discussion-icon">🎭</div>

              <span className="eyebrow">FIM DA RODADA</span>
              <h1>
                O impostor <span>era...</span>
              </h1>

              <div className="result-box">
                <strong className="result-name">
                  {players[round.impostorIndex]}
                </strong>

                <span>A palavra secreta era</span>
                <strong className="result-word">{round.word}</strong>

                <small>Tema: {round.theme}</small>
              </div>

              <button className="primary-button" onClick={playAgain}>
                Jogar novamente <span>↻</span>
              </button>
            </>
          )}

          <Link to="/" className="return-home-link">
            Voltar para a página inicial
          </Link>
        </section>
      )}
    </main>
  );
}

export default ImpostorGame;
