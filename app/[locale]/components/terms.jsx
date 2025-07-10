"use client";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Terms = ({ faqs, title }) => {
  const [expandedIndices, setExpandedIndices] = useState([]);

  const toggleExpanded = (index) => {
    if (expandedIndices.includes(index)) {
      setExpandedIndices(expandedIndices.filter((i) => i !== index));
    } else {
      setExpandedIndices([...expandedIndices, index]);
    }
  };

  return (
    <div className="w-full h-auto flex flex-col justify-center items-center text-zinc-700">
      <div className="justify-center items-center w-full">
        <div className="text-2xl lg:text-3xl font-oswald w-full text-left mb-7 text-tg-orange2">
          {title}
        </div>
        {Array.isArray(faqs) &&
          faqs.map((faq, index) => (
            <div
              key={index}
              className="cursor-pointer bg-zinc-100 rounded-lg mb-3 px-3"
              onClick={() => toggleExpanded(index)}
            >
              <div className="lg:px-2 text-left items-center h-20 select-none flex justify-between flex-row">
                <h5 className="flex-1 font-medium lg:text-lg">{faq.title}</h5>
                <div className="flex-none pl-2">
                  <IoIosArrowDown
                    className={`text-tg-orange2 md:text-lg ${
                      expandedIndices.includes(index)
                        ? "rotate-180"
                        : "rotate-0"
                    } transition`}
                  />
                </div>
              </div>
              <div
                className={`lg:px-2 pt-0 overflow-hidden transition-[max-height] duration-300 ease text-zinc-500 ${
                  expandedIndices.includes(index) ? "max-h-max" : "max-h-0"
                }`}
              >
                <div
                  className="pb-7 text-left"
                  dangerouslySetInnerHTML={{ __html: faq.content }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Terms;
