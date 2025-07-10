import { format } from "date-fns";

export const lastUpdatedAtDate = () => {
  const lastUpdted = new Date('2025-06-15');
  return format(lastUpdted, "dd MMMM yyyy");
};

export const tickgetrCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    let totalAmount = 0;
    let creditcardPrice = 0;
    let paybybankPrice = 0;
    let bancontact = 0;
    let Paybybank = 0;
    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    // if (ticketPrice <= 20) {
    //   const fixedPrice = 0.45;
    //   creditcardPrice = fixedPrice*estimatedAmount;
    //   bancontact = fixedPrice*estimatedAmount;
    // } else {
    //   const percentageOfTicket = 0.02*ticketPrice;
    //   totalAmount = ticketPrice*estimatedAmount;
    //   creditcardPrice = percentageOfTicket*estimatedAmount;
    //   bancontact = percentageOfTicket*estimatedAmount;
    // }
    
    //fixed price
    const fixedPrice = 0.35;
    // creditcardPrice = fixedPrice * estimatedAmount;
    // bancontact = fixedPrice * estimatedAmount;
    paybybankPrice = fixedPrice * estimatedAmount;
     totalAmount = ticketPrice * estimatedAmount;
     creditcardPrice = null;
     bancontact = null;
    return {
      name: 'Tickgetr',
      Creditcard: creditcardPrice,
      Bancontact: bancontact,
      Paybybank : (paybybankPrice).toFixed(2),
      amt: totalAmount,
      total: parseInt(Paybybank),
      flag: '/icons/flags/belgische.png',
      icon: '/icons/favicon.ico',
    }
};

export const eventBriteCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    const fixedPrice = 0.99;
    const percentageOfTicket = 0.04;

    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;
  
    let bancontact = (ticketPrice + (fixedPrice + (percentageOfTicket*ticketPrice))*1.21)*estimatedAmount;
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);
  
    let creditcardPrice = (ticketPrice+(fixedPrice+(percentageOfTicket*ticketPrice))*1.21)*estimatedAmount;
    creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    creditcardPrice = creditcardPrice.toFixed(2);

      let paybybankPrice = null
    
    return {
      name: 'Eventbrite',
      Bancontact: Number(bancontact),
      Creditcard: Number(creditcardPrice),
      paybybank : paybybankPrice,
      amt: totalAmount,
      total: parseInt(bancontact),
      flag: '/icons/flags/amerikaanse.png',
      icon: '/icons/platforms/eventbrite.ico',
    }
};

export const weeztixCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    const fixedPrice = 0.83;
    const percentageOfTicket = 0;
    const paymentMethodPercentageCost = 0.018;
    

    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;
  
    let bancontact = ((ticketPrice+fixedPrice*1.21)*estimatedAmount)+((((ticketPrice+fixedPrice)*ticket)*paymentMethodPercentageCost)*(estimatedAmount/ticket))*1.21;
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);
  
    let creditcardPrice = ((ticketPrice+fixedPrice*1.21)*estimatedAmount)+((((ticketPrice+fixedPrice)*ticket)*paymentMethodPercentageCost)*(estimatedAmount/ticket))*1.21;
    creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    creditcardPrice = creditcardPrice.toFixed(2);

    let paybybankPrice = null;
    
    return {
      name: 'Weeztix',
      Bancontact: Number(bancontact),
      Creditcard: Number(creditcardPrice),
      paybybank : paybybankPrice,
      amt: totalAmount,
      total: parseInt(bancontact),
      flag: '/icons/flags/nederlandse.png',
      icon: '/icons/platforms/eventix.png',
    }
};

export const eventixCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    const fixedPrice = 0;
    const percentageOfTicket = 0.05;
    const maximum = 1.99;
    const paymentMethodFixedCostBancontact = 0.39;

    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;

    let bancontact = Math.min(((ticketPrice)*percentageOfTicket),maximum)*(estimatedAmount/ticket)*1.21+(ticketPrice*estimatedAmount)+(paymentMethodFixedCostBancontact*(estimatedAmount/ticket))*1.21;
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);

    const paymentMethodFixedCostCreditcard = 0.25;
    const paymentMethodPercentageCostCreditcard = 0.018;
  
    let creditcardPrice = Math.min(((ticketPrice*ticket)*percentageOfTicket),maximum)*(estimatedAmount/ticket)*1.21+(ticketPrice*estimatedAmount)+((paymentMethodFixedCostCreditcard*(estimatedAmount/ticket))+((ticketPrice*ticket+Math.min(((ticketPrice*ticket)*percentageOfTicket),maximum))*paymentMethodPercentageCostCreditcard)*(estimatedAmount/ticket)*1.21);
    creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    creditcardPrice = creditcardPrice.toFixed(2);
    
     let paybybankPrice = null;
  
    
    return {
      name: 'Wicket',
      Bancontact: Number(bancontact),
      Creditcard: Number(creditcardPrice),
      amt: totalAmount,
      paybybank:paybybankPrice,
      total: parseInt(bancontact),
      flag: '/icons/flags/belgische.png',
      icon: '/icons/platforms/Wicket.png',
    }
};

export const yourTicketsCal = (ticketPrice, estimatedAmount) => {
    const fixedPrice = 0.55;
    const percentageOfTicket = 0.01;
    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;

    let bancontact =(ticketPrice+(fixedPrice+percentageOfTicket*ticketPrice)*1.21)*estimatedAmount;
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);
  
    let creditcardPrice = null;
    // let creditcardPrice = (ticketPrice+(fixedPrice+(percentageOfTicket*ticketPrice))*1.21)*estimatedAmount;
    // creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    // creditcardPrice = creditcardPrice.toFixed(2);
    let paybybankPrice = null;
    
    return {
      name: 'Your-Tickets',
      Bancontact: Number(bancontact),
      Creditcard: creditcardPrice,
      paybybank : paybybankPrice,
      amt: totalAmount,
      total: parseInt(bancontact),
      flag: '/icons/flags/belgische.png',
      icon: '/icons/platforms/Your-Tickets.jpg',
    }
};

export const eventgooseCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    const fixedPrice = 1.00;
    const percentageOfTicket = 0.01;
    const paymentMethodFixedCostBancontact = 0.25;
    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;

    let bancontact = ((ticketPrice+fixedPrice)*estimatedAmount)+(((estimatedAmount/ticket)*paymentMethodFixedCostBancontact)*1.21);
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);
    
    const paymentMethodFixedCostCreditcard = 0.15;
    const paymentMethodPercentageCostCreditcard = 0.02;

    let creditcardPrice = ((ticketPrice+fixedPrice)*estimatedAmount)+((((((ticketPrice+fixedPrice)*ticket)*paymentMethodPercentageCostCreditcard)*(estimatedAmount/ticket)))+((estimatedAmount/ticket)*paymentMethodFixedCostCreditcard))*1.21;
    creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    creditcardPrice = creditcardPrice.toFixed(2);
    
    let paybybankPrice = null;
    
    return {
      name: 'Eventgoose',
      Bancontact: Number(bancontact),
      Creditcard: Number(creditcardPrice),
      paybybank : paybybankPrice,
      amt: totalAmount,
      total: parseInt(bancontact),
      flag: '/icons/flags/nederlandse.png',
      icon: '/icons/platforms/eventgoose.png',
    }
};

export const weTicketCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    const fixedPrice = 0.18;
    const percentageOfTicket = 0.01;
    const paymentMethodFixedCostBancontact = 0.12;
    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;

    let bancontact = ((ticketPrice+fixedPrice*1.21)*estimatedAmount)+((estimatedAmount/ticket)*paymentMethodFixedCostBancontact)*1.21;
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);
    
    const paymentMethodFixedCostCreditcard = 0.12;
    const paymentMethodPercentageCostCreditcard = 0.024;

    let creditcardPrice = ((ticketPrice+fixedPrice*1.21)*estimatedAmount)+(((estimatedAmount/ticket)*paymentMethodFixedCostCreditcard)+(((ticketPrice+fixedPrice)*ticket)*paymentMethodPercentageCostCreditcard)*(estimatedAmount/ticket))*1.21;
    creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    creditcardPrice = creditcardPrice.toFixed(2);
    
    let paybybankPrice = null;

    return {
      name: 'WeTicket',
      Bancontact: Number(bancontact),
      Creditcard: Number(creditcardPrice),
      paybybank : paybybankPrice,
      amt: totalAmount,
      total: parseInt(bancontact),
      flag: '/icons/flags/nederlandse.png',
      icon: '/icons/platforms/WeTicket.png',
    }
};

export const goTicketsCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    const fixedPrice = 1.00;
    const percentageOfTicket = 0;
    const paymentMethodFixedCostBancontact = 0;
    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;
    
    let bancontact = ((ticketPrice+fixedPrice*1.21)*estimatedAmount);
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);
    
    const paymentMethodFixedCostCreditcard = 0.0;
    const paymentMethodPercentageCostCreditcard = 0.018;

    let creditcardPrice = ((ticketPrice+fixedPrice*1.21)*estimatedAmount)+(((ticketPrice+fixedPrice)*ticket)*paymentMethodPercentageCostCreditcard)*(estimatedAmount/ticket)*1.21;
    creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    creditcardPrice = creditcardPrice.toFixed(2);

    let paybybankPrice = null;
    
    return {
      name: 'Go-Tickets',
      Bancontact: Number(bancontact),
      Creditcard: Number(creditcardPrice),
      paybybank : paybybankPrice,
      amt: totalAmount,
      total: parseInt(bancontact),
      flag: '/icons/flags/nederlandse.png',
      icon: '/icons/platforms/GO-tickets.png',
    }
};

export const ticketApplyCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    const fixedPrice = 0.55;
    const percentageOfTicket = 0;
    const paymentMethodFixedCostBancontact = 0.73;
    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;
    
    let bancontact = (((ticketPrice*ticket)+fixedPrice*1.21)*(estimatedAmount/ticket))+(((estimatedAmount/ticket)*paymentMethodFixedCostBancontact))*1.21;
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);
    
    const paymentMethodFixedCostCreditcard = 0;
    const paymentMethodPercentageCostCreditcard = 0;

    let creditcardPrice = null;
    // let creditcardPrice = ((ticketPrice+fixedPrice*1.21)*estimatedAmount)+((estimatedAmount/ticket)*paymentMethodFixedCostCreditcard)*1.21;
    // creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    // creditcardPrice = creditcardPrice.toFixed(2);

    let paybybankPrice = null;
    
    return {
      name: 'Ticketapply',
      Bancontact: Number(bancontact),
      Creditcard: creditcardPrice,
      paybybank : paybybankPrice,
      amt: totalAmount,
      total: parseInt(bancontact),
      flag: '/icons/flags/nederlandse.png',
      icon: '/icons/platforms/Ticketapply.jpeg',
    }
};

export const ticketKantoorCal = (ticketPrice, estimatedAmount) => {
    const ticket = 1;
    const fixedPrice = 0.80;
    const percentageOfTicket = 0;
    const paymentMethodFixedCostBancontact = 0;
    ticketPrice = parseInt(ticketPrice);
    estimatedAmount = parseInt(estimatedAmount);
  
    const totalAmount = ticketPrice*estimatedAmount;
    
    let bancontact = ((ticketPrice+fixedPrice)*estimatedAmount);
    bancontact = bancontact - ticketPrice*estimatedAmount;
    bancontact = bancontact.toFixed(2);
    
    const paymentMethodFixedCostCreditcard = 0;
    const paymentMethodPercentageCostCreditcard = 0.03;


    let creditcardPrice = ((ticketPrice+fixedPrice)*estimatedAmount)+((((ticketPrice+fixedPrice)*ticket)*paymentMethodPercentageCostCreditcard)*(estimatedAmount/ticket))*1.21;
    creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
    creditcardPrice = creditcardPrice.toFixed(2);

    let paybybankPrice = null;
    
    return {
      name: 'Ticketkantoor',
      Bancontact: Number(bancontact),
      Creditcard: Number(creditcardPrice),
      paybybank : paybybankPrice,
      amt: totalAmount,
      total: parseInt(bancontact),
      flag: '/icons/flags/nederlandse.png',
      icon: '/icons/platforms/Ticketkantoor.png',
    }
};

export const tickowebCal = (ticketPrice, estimatedAmount) => {
  const ticket = 1;
  const fixedPrice = 0.70;
  const percentageOfTicket = 0.01;
  const paymentMethodFixedCostBancontact = 0;
  ticketPrice = parseInt(ticketPrice);
  estimatedAmount = parseInt(estimatedAmount);

  const totalAmount = ticketPrice*estimatedAmount;
  
  let bancontact = (ticketPrice+(fixedPrice+(percentageOfTicket*ticketPrice))*1.21)*estimatedAmount;
  bancontact = bancontact - ticketPrice*estimatedAmount;
  bancontact = bancontact.toFixed(2);
  
  const paymentMethodFixedCostCreditcard = 0;
  const paymentMethodPercentageCostCreditcard = 0.03;

  let creditcardPrice = (ticketPrice+(fixedPrice+(percentageOfTicket*ticketPrice))*1.21)*estimatedAmount;
  creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
  creditcardPrice = creditcardPrice.toFixed(2);

  let paybybankPrice = null;
  
  return {
    name: 'Tickoweb',
    Bancontact: Number(bancontact),
    Creditcard: Number(creditcardPrice),
    paybybank : paybybankPrice,
    amt: totalAmount,
    total: parseInt(bancontact),
    flag: '/icons/flags/belgische.png',
    icon: '/icons/platforms/Tickoweb.jpeg',
  }
};

export const flexticketsCal = (ticketPrice, estimatedAmount) => {
  const ticket = 1;
  const fixedPrice = 1;
  const percentageOfTicket = 0;
  const paymentMethodFixedCostBancontact = 0.39;
  ticketPrice = parseInt(ticketPrice);
  estimatedAmount = parseInt(estimatedAmount);

  const totalAmount = ticketPrice*estimatedAmount;
  
  let bancontact = (((ticketPrice*ticket)+fixedPrice*1.21)*(estimatedAmount/ticket))+(((estimatedAmount/ticket)*paymentMethodFixedCostBancontact))*1.21;
  bancontact = bancontact - ticketPrice*estimatedAmount;
  bancontact = bancontact.toFixed(2);
  
  const paymentMethodFixedCostCreditcard = 0.25;
  const paymentMethodPercentageCostCreditcard = 0.029;

  let creditcardPrice = (((ticketPrice*ticket)+fixedPrice*1.21)*(estimatedAmount/ticket))+(((estimatedAmount/ticket)*paymentMethodFixedCostCreditcard)+(((ticketPrice*ticket)+fixedPrice)*paymentMethodPercentageCostCreditcard)*(estimatedAmount/ticket))*1.21;
  creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
  creditcardPrice = creditcardPrice.toFixed(2);

  let paybybankPrice = null;
  
  return {
    name: 'Flextickets',
    Bancontact: Number(bancontact),
    Creditcard: Number(creditcardPrice),
    paybybank : paybybankPrice,
    amt: totalAmount,
    total: parseInt(bancontact),
    flag: '/icons/flags/nederlandse.png',
    icon: '/icons/platforms/flextickets.png',
  }
};

export const weezEventCal = (ticketPrice, estimatedAmount) => {
  const ticket = 1;
  const fixedPrice = 0;
  const percentageOfTicket = 0.025;
  const minimum = 0.99;
  const paymentMethodFixedCostBancontact = 0;
  
  ticketPrice = parseInt(ticketPrice);
  estimatedAmount = parseInt(estimatedAmount);

  const totalAmount = ticketPrice*estimatedAmount;
  
  let bancontact = ((Math.max(percentageOfTicket*ticketPrice,minimum))*1.21+ticketPrice)*estimatedAmount;
  bancontact = bancontact - ticketPrice*estimatedAmount;
  bancontact = bancontact.toFixed(2);
  
  const paymentMethodFixedCostCreditcard = 0.25;
  const paymentMethodPercentageCostCreditcard = 0.029;

  let creditcardPrice = ((Math.max(percentageOfTicket*ticketPrice,minimum))*1.21+ticketPrice)*estimatedAmount;
  creditcardPrice = creditcardPrice - ticketPrice*estimatedAmount;
  creditcardPrice = creditcardPrice.toFixed(2);
  
  let paybybankPrice = null;

  return {
    name: 'Weezevent',
    Bancontact: Number(bancontact),
    Creditcard: Number(creditcardPrice),
    paybybank : paybybankPrice,
    amt: totalAmount,
    total: parseInt(bancontact),
    flag: '/icons/flags/franse.png',
    icon: '/icons/platforms/Weezevent.jpeg',
  }
};


export const platformsPriceList = [
  { 
    name: "Eventbrite",
    model: "PER TICKET",
    pricing_of_platform: "€0,49 + 3% per ticket",
    vat: "excl",
    payment_methods: {
      Bancontact: "Free",
      Creditcard: "Free",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/eventbrite.ico',
  },
  { 
    name: "Weeztix",
    model: "PER TICKET",
    pricing_of_platform: "€0,83 per ticket",
    vat: "excl",
    payment_methods: {
      Bancontact: "1.80%",
      Creditcard: "1.80%"
    },
    icon: '/icons/platforms/eventix.png',
  },
  { 
    name: "Wicket",
    model: "PER TRANSACTION",
    pricing_of_platform: "5% with a max of €1,99 per transaction",
    vat: "excl",
    payment_methods: {
      Bancontact: "€0,39" ,
      Creditcard: "€0,25 + 1,8%",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/Wicket.png',
  },
  { 
    name: "Your-Tickets",
    model: "PER TICKET",
    pricing_of_platform: "€0,55 + 1%",
    vat: "excl",
    payment_methods: {
      Bancontact: "Free" ,
      Creditcard: "NOT AVAILABLE",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/Your-Tickets.jpg',
  },
  { 
    name: "Eventgoose",
    model: "PER TICKET",
    pricing_of_platform: "€1 per ticket",
    vat: "incl",
    payment_methods: {
      Bancontact: "€0.25" ,
      Creditcard: "€0,15 + 2%",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/eventgoose.png',
  },
  { 
    name: "WETicket",
    model: "PER TICKET",
    pricing_of_platform: "€0,18 per ticket",
    vat: "excl",
    payment_methods: {
      Bancontact: "€0.12" ,
      Creditcard: "€0,12 + 2,4%",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/WeTicket.png',
  },
  { 
    name: "Go-Tickets",
    model: "PER TICKET",
    pricing_of_platform: "€1 per ticket",
    vat: "excl",
    payment_methods: {
      Bancontact: "Free" ,
      Creditcard: "1,8%",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/GO-tickets.png',
  },
  { 
    name: "Ticketapply",
    model: "PER TRANSACTION",
    pricing_of_platform: "€0,55 per transaction",
    vat: "excl",
    payment_methods: {
      Bancontact: "€0.73" ,
      Creditcard: "NOT AVAILABLE",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/Ticketapply.jpeg',
  },
  { 
    name: "Ticketkantoor",
    model: "PER TICKET",
    pricing_of_platform: "€0,8 All in",
    vat: "incl",
    payment_methods: {
      Bancontact: "Free" ,
      Creditcard: "3.00%",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/Ticketkantoor.png',
  },
  { 
    name: "Tickoweb",
    model: "PER TICKET",
    pricing_of_platform: "€0.70 + 1% All in",
    vat: "excl",
    payment_methods: {
      Bancontact: "Free" ,
      Creditcard: "Free",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/Tickoweb.jpeg',
  },
  { 
    name: "Flextickets",
    model: "PER TRANSACTION",
    pricing_of_platform: "€1 per transaction",
    vat: "excl",
    payment_methods: {
      Bancontact: "€0.39" ,
      Creditcard: "2,90% + €0,25",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/flextickets.png',
  },
  { 
    name: "Weezevent",
    model: "PER TICKET",
    pricing_of_platform: "2,5% per ticket with a minimum of €0,99",
    vat: "incl",
    payment_methods: {
      Bancontact: "Free" ,
      Creditcard: "Free",
      Paybybank : "NOT AVAILABLE"
    },
    icon: '/icons/platforms/Weezevent.jpeg',
  }
];
