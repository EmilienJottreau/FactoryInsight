import React, { useState } from "react";

export function Docs() {
  const [pdfData, setPdfData] = useState(null);

  async function loadPdf(fileName) {
    try {
      const { default: pdf } = await import(
        `../../assets/technical_docs/${fileName}`
      );
      setPdfData(pdf);
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  }

  return (
    <div className="docs">
      <ul>
        <div>
          <button>
            <li
              onClick={() =>
                loadPdf("Certificats de conformité et de qualité.pdf")
              }
            >
              Certificats de conformité et de qualité.pdf
            </li>
          </button>
        </div>
        <div>
          <button>
            <li onClick={() => loadPdf("Fiche technique.pdf")}>
              Fiche technique.pdf
            </li>
          </button>
        </div>
        <div>
          <button>
            <li onClick={() => loadPdf("Guide d'entretien préventif.pdf")}>
              Guide d'entretien préventif.pdf
            </li>
          </button>
        </div>
        <div>
          <button>
            <li onClick={() => loadPdf("Guide de dépannage.pdf")}>
              Guide de dépannage.pdf
            </li>
          </button>
        </div>
        <div>
          <button>
            <li onClick={() => loadPdf("Manuel de formation.pdf")}>
              Manuel de formation.pdf
            </li>
          </button>
        </div>
        <div>
          <button>
            <li onClick={() => loadPdf("Schéma électrique.pdf")}>
              Schéma électrique.pdf
            </li>
          </button>
        </div>
      </ul>
      {pdfData && (
        <div className="pdfContainer">
        <embed
          src={pdfData}
          type="application/pdf"
          width="100%"
          height="600px"
        />
        </div>
      )}
    </div>
  );
}
