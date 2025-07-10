import React from "react";

const Policy = ({ title, policies }) => {
  return (
    <div className="pt-[120px] md:pt-[160px] pb-32 px-6 flex justify-center">
      <div className="md:w-3/4 flex flex-col gap-14">
        <h2 className="text-4xl md:text-6xl font-oswald md:mb-7">{title}</h2>
        {policies.map((policy, index) => (
          <div className="space-y-8" key={index}>
            <h3 className="font-oswald text-2xl text-tg-orange2">
              {policy.heading}
            </h3>
            <div className="space-y-5">
              {policy.content.map((line, i) => (
                <div key={i}>
                  {line.contentT && (
                    <h4 className="font-semibold">{line.contentT}</h4>
                  )}
                  {line.contentP && (
                    <div dangerouslySetInnerHTML={{ __html: line.contentP }} />
                  )}
                  {line.list && (
                    <ul className="list-disc pl-6">
                      {line.list.map((listItem, listIndex) => (
                        <li key={listIndex}>{listItem}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policy;
