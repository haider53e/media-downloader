import { useRef, useEffect } from "react";
import Form from "./Form";
import Toggle from "./Toggle";
import { capitalizeFirstLetter } from "../common/utils";

export default function ({ selectedPlatform, platforms }) {
  const global = useRef({});

  useEffect(() => {
    document.body.classList.add(selectedPlatform);
    return () => document.body.classList.remove(selectedPlatform);
  }, [selectedPlatform]);

  return (
    <div className="download">
      <div className="container">
        <div className="p-3">
          <div className="py-3">
            <div className="row">
              <div>
                <div className="d-grid gap-2 col-md-6 mx-auto mt-3 mb-4">
                  <Toggle
                    selectedItem={selectedPlatform}
                    items={platforms.map((platform) => ({
                      name: platform,
                      path: BASE + platform,
                    }))}
                    maximumCoulmns={2}
                  />
                </div>
                <h3 className="card-title text-center">
                  Download Photos & Videos
                </h3>
                <p
                  className="mt-2 mb-0 card-text text-center"
                  style={{ fontSize: "20px" }}
                >
                  {"from " + capitalizeFirstLetter(selectedPlatform)}
                </p>
                <Form
                  platform={selectedPlatform}
                  global={global}
                  key={selectedPlatform}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
