import { capitalizeFirstLetter } from "../common/utils";

export default ({ selectedItem, setItem, items, labelStyles }) =>
  items.map((item) => {
    const name = item.name ?? item;

    return (
      <div key={name} className="d-flex align-items-center">
        <input
          type="radio"
          id={name}
          checked={selectedItem === name}
          onChange={() => setItem(name)}
          onKeyDown={(e) => e.key === "Enter" && setItem(name)}
        />
        <label htmlFor={name} style={labelStyles} className="input-option">
          {capitalizeFirstLetter(item.displayName ?? name)}
        </label>
      </div>
    );
  });
