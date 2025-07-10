import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CustomTooltipPaymentMethod } from "./tooltip";
import { PiEmpty } from "react-icons/pi";

const PaymentMethods = ({ paymentMethodsData, className }) => {
  const data =
    paymentMethodsData && paymentMethodsData.length > 0
      ? paymentMethodsData
      : [{ name: "No Data", value: 0, colors: "#f0f0f0" }];

  return (
    <div className="inline-flex lg:w-full md:w-2/3 w-full h-full items-center gap-2">
      {paymentMethodsData && paymentMethodsData.length > 0 ? (
        <>
          <div className="w-max">
            {paymentMethodsData.map((entry, index) => (
              <div key={index} className="flex text-xs md:text-sm">
                <span
                  className={`mr-5 inline-flex items-center justify-end ${className}`}
                >
                  <div
                    style={{ backgroundColor: entry.colors }}
                    className="h-1 w-2 mr-2 rounded-full"
                  ></div>
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltipPaymentMethod />} />
              <Pie
                data={data}
                innerRadius={"50%"}
                outerRadius={"90%"}
                stroke="none"
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.colors} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="flex flex-col w-full h-full font-oswald text-3xl justify-center items-center text-zinc-300 text-opacity-30 gap-3">
          No data yet
          <PiEmpty className="text-7xl" />
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
