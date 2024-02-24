import { capitalizeFirstLetter } from "../common/utils";

export default ({ selectedItem, setItem, items, labelStyles }) =>
  items.map((item) => {
    const name = item.name ?? item;

    return (
      <div key={name} style={{ display: "flex", alignItems: "center" }}>
        <input
          type="radio"
          id={name}
          checked={selectedItem === name}
          onChange={(e) => setItem(e.target.id)}
        />
        <label htmlFor={name} style={labelStyles}>
          {capitalizeFirstLetter(item.displayName ?? name)}
        </label>
      </div>
    );
  });
