
import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from "react-router-dom";
import "./App.css";
import ImpostorGame from "./impostorGame.jsx";

const games = [
  {
    slug: "impostor",
    icon: "🕵️",
    title: "O Impostor",
    description: "Descubra quem está blefando antes que seja tarde.",
    players: "3 a 10 jogadores",
    category: "Dedução"
  },
  {
    slug: "nota",
    icon: "⭐",
    title: "Dê uma Nota",
    description: "Avalie situações e compare suas opiniões com as dos amigos.",
    players: "2 ou mais jogadores",
    category: "Opinião"
  },
  {
    slug: "quem-e-mais-provavel",
    icon: "👀",
    title: "Quem é mais provável?",
    description: "Descubra quem do grupo tem mais chances de fazer cada coisa.",
    players: "3 ou mais jogadores",
    category: "Em grupo"
  },
  {
    slug: "palavra-secreta",
    icon: "💬",
    title: "Palavra Secreta",
    description: "Dê dicas, descubra palavras e tente não entregar a resposta.",
    players: "2 ou mais jogadores",
    category: "Raciocínio"
  },
  {
    slug: "desafio",
    icon: "⚡",
    title: "Desafio Relâmpago",
    description: "Responda perguntas e cumpra desafios contra o tempo.",
    players: "2 ou mais jogadores",
    category: "Diversão"
  },
  {
    slug: "verdade-ou-desafio",
    icon: "🎭",
    title: "Verdade ou Desafio",
    description: "Escolha entre revelar uma verdade ou encarar um desafio.",
    players: "2 ou mais jogadores",
    category: "Em grupo"
  }
];

function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>MINIGAMES</span>
        </div>
        <div className="topbar-label">
          DIVERSÃO EM GRUPO
        </div>
      </header>

      <section className="hero">
        <span className="eyebrow">SEU PONTO DE ENCONTRO</span>
        <h1>
          Jogue. Ria.
          <span>Repita.</span>
        </h1>
        <p>
          Uma coleção de minigames para reunir os amigos,
          criar momentos divertidos e descobrir quem
          realmente conhece o grupo.
        </p>

        <div className="hero-info">
          <span className="hero-info-icon">✦</span>
          Vários jogos, infinitas possibilidades.
        </div>
      </section>

      <section className="games-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ESCOLHA SUA DIVERSÃO</span>
            <h2>Explore os jogos</h2>
          </div>
          <span className="games-count">
            {String(games.length).padStart(2, "0")} JOGOS
          </span>
        </div>

        <div className="games-list">
          {games.map((game) => (
            <Link
              to={`/jogo/${game.slug}`}
              className="game-card"
              key={game.slug}
            >
              <div className="game-icon">{game.icon}</div>

              <div className="game-content">
                <div className="game-title-row">
                  <h3>{game.title}</h3>
                  <span className="game-category">{game.category}</span>
                </div>

                <p>{game.description}</p>

                <span className="game-players">
                  ♟ {game.players}
                </span>
              </div>

              <div className="card-arrow">↗</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-line"></div>
        <p>Feito para boas partidas. <span>✦</span></p>
      </footer>
    </main>
  );
}

function GamePage() {
  const { slug } = useParams();
  const game = games.find((item) => item.slug === slug);

  if (!game) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="app-shell game-page">
      <header className="topbar">
        <Link to="/" className="back-link">
          ← Voltar
        </Link>
        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>MINIGAMES</span>
        </div>
      </header>

      <section className="coming-card">
        <div className="coming-icon">{game.icon}</div>
        <span className="eyebrow">VOCÊ ESCOLHEU</span>
        <h1>{game.title}</h1>
        <p>
          Esse minigame ainda está sendo preparado.
          Em breve você poderá jogar por aqui!
        </p>
        <Link to="/" className="back-home">
          Escolher outro jogo
        </Link>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jogo/impostor" element={<ImpostorGame />} />
      <Route path="/jogo/:slug" element={<GamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
