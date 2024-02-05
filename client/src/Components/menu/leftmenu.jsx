export function LeftMenu({}) {
  return (
    <div className="left-menu">
      <button>
        <div>Synoptique</div>
      </button>
      <button>Detail Variables</button>
      <button>Historique</button>
      <button>Statistiques</button>
      <button className="signature">
        Mentions Legales
        {/* <div>Marguerite DIOUF</div>
        <div>Emilien JOTTREAU</div>
        <div>Adrien MICHAUT</div>
        <div>2023</div> */}
      </button>
    </div>
  );
}
