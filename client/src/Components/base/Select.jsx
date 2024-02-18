

export function Select({ items, description, selected="", setSelected }) {


  const handleChange = (value) => {
    console.log(value.target.value)
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
          {items.sort().map((x, i) => (
            <option key={x} value={x}>{(x.charAt(0).toUpperCase() + x.slice(1)).replace("_", " ")}</option>
          ))}
        </select>
        <label htmlFor="floatingSelect">{description}</label>
      </div>
    </>
  );
}
