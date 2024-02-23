import { Link } from "react-router-dom";
import classNames from "classnames";
import { capitalizeFirstLetter } from "../common/utils";

export default function ({ selectedItem, items, setItem, maximumCoulmns }) {
  const totalCoulmnsGap = (maximumCoulmns - 1) * 6;
  const itemNames = [];

  const toggleItems = items.map((item) => {
    const name = item.name ?? item;
    itemNames.push(name);

    const classes = classNames(
      "nav-link text-decoration-none text-center z-1",
      name === selectedItem && "active"
    );

    const width = `calc((100% - ${totalCoulmnsGap}px) / ${maximumCoulmns})`;

    if (item.path)
      return (
        <Link key={name} className={classes} to={item.path} style={{ width }}>
          {capitalizeFirstLetter(item.displayName ?? name)}
        </Link>
      );

    return (
      <div
        key={name}
        className={classes}
        onClick={() => setItem(name)}
        style={{ width }}
      >
        {capitalizeFirstLetter(item.displayName ?? name)}
      </div>
    );
  });

  const totalItems = itemNames.length;
  const totalRows = Math.ceil(totalItems / maximumCoulmns);
  // console.log({ totalItems, totalRows });

  const itemIndex = itemNames.indexOf(selectedItem);
  const coulmnsInLastRow = totalItems % maximumCoulmns || maximumCoulmns;
  const isItemInLastRow = totalItems - itemIndex <= coulmnsInLastRow;
  const totalCoulmns = isItemInLastRow ? coulmnsInLastRow : maximumCoulmns;
  // console.log({ itemIndex, coulmnsInLastRow, isItemInLastRow, totalCoulmns });

  const itemWidth = 100 / totalCoulmns;
  const currentCoulmn = itemIndex % maximumCoulmns;
  const sliderLeft = itemWidth * currentCoulmn;
  // console.log({ itemWidth, sliderLeft });

  const itemHeight = 100 / totalRows;
  const currentRow = Math.floor(itemIndex / maximumCoulmns);
  const sliderTop = itemHeight * currentRow;
  // console.log({ itemHeight, sliderTop });

  // console.log({ currentCoulmn, currentRow });

  return (
    <div className="p-1 small toggle">
      <ul className="nav nav-fill">
        <div
          className="slider"
          // prettier-ignore
          style={{
            width: `calc((100%  - ${(totalCoulmns - 1) * 6}px) / ${totalCoulmns})`,
            height: `calc((100%  - ${(totalRows - 1) * 6}px) / ${totalRows})`,
            left: `calc(${sliderLeft}% + ${(currentCoulmn * 6) / totalCoulmns}px)`,
            top: `calc(${sliderTop}% + ${(currentRow * 6) / totalRows}px)`,
          }}
        ></div>
        {toggleItems}
      </ul>
    </div>
  );
}
