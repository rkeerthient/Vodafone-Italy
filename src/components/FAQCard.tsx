import { CardProps } from "@yext/search-ui-react";
import * as React from "react";
import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import RTF from "./RTF";

const FAQCard = (props: any): JSX.Element => {
  const { data } = props;
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="w-full border-b border-gray-300 p-4 my-4 ">
      <div className="text-lg font-light">
        <div onClick={() => setIsActive(!isActive)}>
          <div className="   hover:cursor-pointer  ">
            <span>{data.name}</span>
            <div style={{ float: "right" }}>
              {isActive ? (
                <ChevronUpIcon className="w-7 text-[#083b3a]" />
              ) : (
                <ChevronDownIcon className="w-7 text-[#083b3a]" />
              )}
            </div>
          </div>
        </div>
        {isActive && (
          <div className="mt-3  ">
            <RTF>{data.bodyV2.markdown}</RTF>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQCard;
