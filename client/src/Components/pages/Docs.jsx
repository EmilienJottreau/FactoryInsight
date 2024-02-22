import React, { useState } from "react";
import { DownloadPdfButton } from "../base/DownloadPdfButton";

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
      <DownloadPdfButton
        name="Certificats de conformité et de qualité.pdf"
        loadPdf={loadPdf}
      />
      <DownloadPdfButton name="Fiche technique.pdf" loadPdf={loadPdf} />
      <DownloadPdfButton
        name="Guide d'entretien préventif.pdf"
        loadPdf={loadPdf}
      />
      <DownloadPdfButton name="Guide de dépannage.pdf" loadPdf={loadPdf} />
      <DownloadPdfButton name="Manuel de formation.pdf" loadPdf={loadPdf} />
      <DownloadPdfButton name="Schéma électrique.pdf" loadPdf={loadPdf} />

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
