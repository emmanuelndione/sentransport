import { useState } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [compteur, setCompteur] = useState(0);

  const lignes = [
    {
      id: 1,
      numero: "7",
      depart: "Parcelles Assainies",
      arrivee: "Palais",
      arrets: 12,
      listeArrets: ["Parcelles Assainies", "Cambérène", "Yakhass", "Castors", "Patte d'Oie", "Grand Théâtre", "Palais"]
    },
    {
      id: 2,
      numero: "15",
      depart: "Pikine",
      arrivee: "Guédiawaye",
      arrets: 8,
      listeArrets: ["Pikine", "Djiddah Thiaroye", "Thiaroye", "Tivaouane", "Guédiawaye"]
    },
    {
      id: 3,
      numero: "23",
      depart: "Liberté 6",
      arrivee: "Médina",
      arrets: 10,
      listeArrets: ["Liberté 6", "Fann", "Mermoz", "Point E", "Médina"]
    },
    {
      id: 4,
      numero: "31",
      depart: "Fann",
      arrivee: "Liberté",
      arrets: 6,
      listeArrets: ["Fann", "Hann", "Liberté"]
    },
    {
      id: 5,
      numero: "42",
      depart: "HLM",
      arrivee: "Dieuppeul",
      arrets: 9,
      listeArrets: ["HLM", "Grand Yoff", "Dieuppeul"]
    },
    {
      id: 6,
      numero: "18",
      depart: "Médina",
      arrivee: "Sicap",
      arrets: 7,
      listeArrets: ["Médina", "Colobane", "Sicap"]
    }
  ];

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
    } else {
      setLigneSelectionnee(ligne);
    }
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p className="compteur-recherches">
          Vous avez effectué {compteur} recherche{compteur > 1 ? 's' : ''}
        </p>
        <Recherche 
          valeur={recherche} 
          onChange={(val) => {
            setRecherche(val);
            if (val !== "") setCompteur(c => c + 1);
          }}
        />
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        {lignesFiltrees.length === 0 ? (
          <p className="aucun-resultat">Aucune ligne trouvée</p>
        ) : (
          lignesFiltrees.map(ligne => (
            <LigneBus
              key={ligne.id}
              numero={ligne.numero}
              depart={ligne.depart}
              arrivee={ligne.arrivee}
              arrets={ligne.arrets}
              estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
              onClick={() => handleClickLigne(ligne)}
            />
          ))
        )}

        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;