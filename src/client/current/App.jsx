import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import Header from "./Header";
import Footer from "./Footer";
import Media from "./Media";
import Alert from "./Alert";
import "./App.scss";
import SelectPlatform from "./SelectPlatform";
import SelectType from "./SelectType";
import SelectQuality from "./SelectQuality";
import HighlightGroups from "./HighlightGroups";
import { regex } from "./constants";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function () {
  const [platform, setPlatform] = useState("instagram");
  const [identifier, setIdentifier] = useState("");
  const [type, setType] = useState("post");
  const [quality, setQuality] = useState(2);
  const [items, setItems] = useState([]);
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setType("post");
    setQuality(2);
  }, [platform]);

  const fetchMedia = async () => {
    setAlert(null);
    try {
      // console.log(identifier)
      const reqRegex = regex[platform][type];
      if (!identifier.match(reqRegex.regex))
        return setAlert(
          <Alert message={"Provided " + reqRegex.name + " is not valid."} />
        );

      const tempIdentifier = identifier;

      if (type === "highlights") setType("highlightsGroups");
      setIdentifier("");
      setStep(2);

      let url = SERVER + "api/v1/" + platform + "/" + type;
      if (PROXY) url = PROXY + "/?url=" + url;

      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ identifier: tempIdentifier, quality }),
      });
      response = await response.json();
      // console.log(response)

      if (response.error) {
        setAlert(<Alert message={response.error} />);
        setStep(1);
      } else {
        setAlert(null);
        setItems(response.items);
        if (response.type === "highlightsGroups") {
          setType("highlights");
          setStep(4);
        }
        //
        else setStep(3);
      }
    } catch (e) {
      console.error(e);
      setAlert(<Alert message="API is not accessible." />);
      setStep(1);
    }
  };

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          <div className="p-3">
            {alert}
            <div className="py-3">
              <div className="row">
                <div>
                  <h5 className="card-title text-accent text-center">
                    Download Photos & Videos
                  </h5>
                  <p className="mt-2 mb-0 card-text text-accent text-center">
                    from Instagram & Threads
                  </p>
                  {step !== 4 && (
                    <>
                      <SelectPlatform
                        platform={platform}
                        setPlatform={setPlatform}
                      />
                      <input
                        type="text"
                        className="mt-2 form-control"
                        placeholder={capitalizeFirstLetter(
                          regex[platform][type]?.name || ""
                        )}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchMedia()}
                      />

                      <SelectType
                        type={type}
                        setType={setType}
                        platform={platform}
                      />
                    </>
                  )}
                  {step === 4 && (
                    <HighlightGroups
                      items={items}
                      identifier={identifier}
                      setIdentifier={setIdentifier}
                    />
                  )}
                  <SelectQuality quality={quality} setQuality={setQuality} />
                  {(step === 1 || step === 3 || step === 4) && (
                    <button
                      onClick={fetchMedia}
                      className="d-grid gap-2 col-6 col-sm-5 mx-auto btn btn-outline-accent mt-4"
                    >
                      Fetch Media
                    </button>
                  )}
                  {step === 2 && <Spinner />}
                  {step === 3 && <Media items={items} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
