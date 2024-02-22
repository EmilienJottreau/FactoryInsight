export function DownloadPdfButton({ name, loadPdf }) {
  return (
    <>
      <div>
        {name.split(".")[0]}
        <button style={{marginInline: "20px"}} onClick={() => loadPdf(name)}>Visualiser</button>
      </div>
      
    </>
  );
}
