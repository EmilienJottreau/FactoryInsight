

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
          {items.map((x, i) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>
        <label htmlFor="floatingSelect">{description}</label>
      </div>
    </>
  );
}
