import { useReducer, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Media from "../common/components/Media";
import Spinner from "../common/components/Spinner";
import SelectType from "../common/components/SelectType";
import SelectQuality from "../common/components/SelectQuality";
import HighlightGroups from "../common/components/HighlightGroups";
import { regex } from "../common/constants";
import { makeBackendUrl, capitalizeFirstLetter } from "../common/utils";
import Toggle from "./Toggle";
import formatString from "../../server/utils/formatString";

export default function ({ platform, global }) {
  global.current[platform] ??= {
    identifier: "",
    quality: 1,
    items: [],
    step: 1,
    type: "post",
  };

  function reducer(state, action) {
    return { ...state, [action.type]: action.payload };
  }

  const [{ identifier, quality, items, step, type }, dispatch] = useReducer(
    reducer,
    global.current[platform]
  );

  function intercept(action) {
    dispatch(action);
    global.current[platform][action.type] = action.payload;
  }

  const setIdentifier = (payload) => intercept({ type: "identifier", payload });
  const setQuality = (payload) => intercept({ type: "quality", payload });
  const setItems = (payload) => intercept({ type: "items", payload });
  const setStep = (payload) => intercept({ type: "step", payload });
  const setType = (payload) => intercept({ type: "type", payload });

  function toaster(message, type) {
    if (toast.isActive(message)) return;
    toast[type ?? "info"](message, { toastId: message });
  }

  const range = useRef(null);

  useEffect(() => {
    const progress = (range.current.value / range.current.max) * 100;
    range.current.style.background = formatString(
      "linear-gradient(to right, #fff {0}%, #fff8 {1}%)",
      progress,
      progress
    );
  }, [quality]);

  const fetchMedia = async () => {
    try {
      const reqRegex = regex[platform][type];
      if (!identifier.match(reqRegex.regex))
        return toaster("Provided " + reqRegex.name + " is not valid.", "warn");

      if (type === "highlights") {
        setType("highlightsGroups");
        setIdentifier("");
      }
      setStep(2);

      const url = makeBackendUrl("api/v1/" + platform + "/" + type);

      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ identifier, quality: Number(quality) }),
      });
      response = await response.json();
      // console.log(response)

      if (response.error) {
        toaster(response.error, "error");
        setStep(1);
      } else {
        setItems(response.items);
        if (response.type === "highlightsGroups") {
          setIdentifier("");
          setType("highlights");
          setStep(4);
        }
        //
        else setStep(3);
      }
    } catch (e) {
      console.error(e);
      toaster("API is not accessible.", "error");
      setStep(1);
    }
  };

  const mediaType = {
    instagram: [
      "post",
      "stories",
      { name: "highlightsGroups", displayName: "highlights" },
      "audio",
    ],
    threads: ["post"],
  }[platform];

  return (
    <>
      <input
        type="text"
        className="mt-4 form-control"
        placeholder={(regex[platform]?.[type]?.name ?? "")
          .split(" ")
          .map(capitalizeFirstLetter)
          .join(" ")}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchMedia()}
      />
      {step !== 4 && (
        <SelectType>
          <Toggle
            selectedItem={type}
            setItem={setType}
            items={mediaType}
            maxCoulmns={2}
            gap={8}
          />
        </SelectType>
      )}
      {step === 4 && (
        <HighlightGroups
          items={items}
          identifier={identifier}
          setIdentifier={setIdentifier}
          activeBorderColor={"white"}
        />
      )}
      <SelectQuality
        quality={quality}
        setQuality={setQuality}
        reference={range}
      />
      {(step === 1 || step === 3 || step === 4) && (
        <button
          onClick={fetchMedia}
          className="d-grid gap-2 col-6 col-sm-5 mx-auto mt-4 btn btn-light"
        >
          Fetch Media
        </button>
      )}
      {step === 2 && <Spinner />}
      {step === 3 && (
        <Media
          items={items}
          downloadBtnClass={"btn-light"}
          extraImageStyles={{ border: "1px solid #fff9" }}
          extraVideoStyles={{ border: "1px solid #fff9" }}
        />
      )}
    </>
  );
}
