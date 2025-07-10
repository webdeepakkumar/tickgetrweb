"use client"
import { useTranslations } from "next-intl";

export const CustomTooltip = ({ active, payload }) => {
  const t = useTranslations("graphhovershow")
  if (active && payload && payload.length) {
    const { month, year, revenue ,ticket} = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="text-white text-xs bg-orange-800 bg-opacity-40 text-center border-none rounded-md py-2 px-5 backdrop-filter backdrop-blur-sm">
        {`${t("revenue")}: €${revenue}`}<br />
        {`${t("ticket_sold")}: ${ticket}`}<br /> {`${month}-${year} `} 
        </p>
      </div>
    );
  }

  return null;
};

export const CustomTooltipAdmin = ({ active, payload }) => {
  const t = useTranslations("graphhovershow")
  if (active && payload && payload.length) {
    const { month, year, revenue, ticket } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="text-white text-xs bg-orange-300 bg-opacity-40 text-center border-none rounded-md py-2 px-5 backdrop-filter backdrop-blur-sm">
        {`${t("revenue")}: €${revenue}`}<br />
        {`${t("ticket_sold")}: ${ticket}`}<br /> {`${month}-${year} `} 
        </p>
      </div>
    );
  }

  return null;
};


export const CustomTooltipDaily = ({ active, payload }) => {
  const t = useTranslations("graphhovershow")
  if (active && payload && payload.length) {
    const {  revenue, ticket } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="text-white text-xs bg-orange-800 bg-opacity-40 text-center border-none rounded-md py-2 px-5 backdrop-filter backdrop-blur-sm">
        {`${t("revenue")}: €${revenue}`}<br />
          {`${t("ticket_sold")}: ${ticket}`}<br />

        </p>
      </div>
    );
  }

  return null;
};

export const CustomTooltipAdminDaily = ({ active, payload }) => {
  const t = useTranslations("graphhovershow")
  if (active && payload && payload.length) {
    const {  revenue, ticket} = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="text-white text-xs bg-orange-300 bg-opacity-40 text-center border-none rounded-md py-2 px-5 backdrop-filter backdrop-blur-sm">
        {`${t("revenue")}:: €${revenue}`}<br />
          {`${t("ticket_sold")}:: ${ticket}`}<br />
        </p>
      </div>
    );
  }

  return null;
};


export const CustomTooltipPaymentMethod = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-white text-xs bg-orange-800 bg-opacity-40 text-center border-none rounded-md py-2 px-5 backdrop-filter backdrop-blur-sm">
          {`${payload[0].name} : ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};
