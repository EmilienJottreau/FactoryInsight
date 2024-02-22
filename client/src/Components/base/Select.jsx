export function Select({ items, description, selected = "", setSelected }) {
  const handleChange = (value) => {
    console.log(value.target.value);
    setSelected(value.target.value);
  };

  return (
    <>
      <div className="form-floating">
        <select
          className="form-select"
          id="floatingSelect"
          aria-label="Floating label select example"
          value={selected || ""}
          onChange={(x) => handleChange(x)}
        >
          {items
            .sort((a, b) => {
              if (typeof a === "number" && typeof b === "number"){
                return a - b;
              }
              else {
                return a > b? 1: -1;
              }
            })
            .map((x, i) => (
              <option key={x} value={x}>
                {typeof x === "number"
                  ? x
                  : (x.charAt(0).toUpperCase() + x.slice(1)).replace("_", " ")}
              </option>
            ))}
        </select>
        <label htmlFor="floatingSelect">{description}</label>
      </div>
    </>
  );
}
