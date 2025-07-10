import { useTranslations } from "next-intl";

const Modal = ({ isModalOpen, handleModalClose }) => {
    const t = useTranslations("compare");
   
    if (!isModalOpen) return null;
    return (
        <div
        id="modal-body"
        onClick={(e) => e.target.id === "modal-body" && handleModalClose()}
        className="w-full z-50 h-[100vh] fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]">
            <div className="con-card flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:h-auto mx-auto px-5 lg:py-0 py-5 max-w-screen-lg w-full md:w-[550px] lg:w-full">
                <div className="rounded-3xl no-scrollbar lg:h-auto max-h-[500px] lg:max-h-full overflow-y-scroll lg:overflow-y-visible flex lg:flex-row flex-col gap-4 ">
                    <div className="con-contentt min-h-min px-6 py-10 bg-white w-full max-w-7lg rounded-3xl">
                        <h3 className="text-xl font-semibold mb-6">{t("cheapest_competitor")}</h3>
                        <p className="text-sm mb-2 text-slate-600">{t("fixed_cost")}</p>
                        <p className="text-sm mb-2 text-slate-600">{t("percentage_cost")}</p>
                        <p className="text-sm mb-4 text-slate-600">{t("extra_costs")}
                        <ul>
                            <li>&#8226; {t("bancontact_payments")}</li>
                            <li>&#8226; {t("creditcard_payments")}</li>
                        </ul>
                        </p>
                        <p className="text-sm mb-4 text-slate-600">{t("you_want_to_sell")}</p>
                        <p className="text-sm mb-2 text-slate-600">{t("cost_for_using")}</p>
                        <p className="text-sm mb-2 text-slate-600">{t("for_bancontac")}</p>
                        <p className="text-sm mb-4 text-slate-600">{t("for_creditcard")}</p>

                        <p className="text-sm mb-2 text-slate-600">{t("including")}</p>
                        <p className="text-sm mb-2 text-slate-600">{t("including_for_bancontact")}</p>
                        <p className="text-sm mb-4 text-slate-600">{t("including_for_creditcard")}</p>

                        <p 
                            className="text-sm mb-0 text-slate-600"
                            dangerouslySetInnerHTML={{ __html: t.raw("so_it_costs") }}
                        />

                    </div>
                    <div className="con-contentt min-h-min px-6 py-10 bg-white w-full max-w-7lg rounded-3xl border-4 border-orange-500 shadow-[0_0_24px_-5px_orange] shadow-orange-500">
                        <h3 className="text-xl font-semibold mb-6">{t("tickgetr_example")}</h3>
                        <p className="text-sm mb-2 text-slate-600">{t("fixed_cost_tickgert")}</p>
                        <p className="text-sm mb-2 text-slate-600">{t("percentage_cost_tickgert")}</p>
                        <p className="text-sm mb-4 text-slate-600">{t("extra_costs")}
                        <ul>
                            <li>&#8226; {t("none")}</li>
                        </ul>
                        </p>
                        <p className="text-sm mb-2 text-slate-600">{t("you_want_to_sell_tickgetr")}</p>
                        <p className="text-sm mb-2 text-slate-600">{t("cost_for_using_tickgetr")}</p>
                        <p 
                            className="text-sm mb-0 text-slate-600"
                            dangerouslySetInnerHTML={{ __html: t.raw("so_it_costs_tickgetr") }}
                        />
                    </div> 
                </div>
            </div>
        
        </div>
    );
};

export default Modal;