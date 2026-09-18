import type { FAQ } from "./types";

export interface Terminal {
  name: string;
  quay: string;
  usedBy: string;
  cityAccess: string;
}

export interface PortGuideSection {
  heading: string;
  paragraphs: string[];
}

export const portGuideContent = {
  title: "Livorno Cruise Port Guide",
  subtitle: "Cruise terminal, train station access, coaches to Florence and Cinque Terre, and return-to-ship timing.",
  terminals: [
    {
      name: "Livorno Cruise Terminal",
      quay: "Commercial cruise terminal adjacent to Livorno Centrale",
      usedBy: "Most large ships — MSC, Costa, Celebrity, Norwegian and others on Western Mediterranean itineraries",
      cityAccess: "10–15 min walk to Livorno Centrale; coaches meet at terminal exit; Florence 90–120 min by coach; Cinque Terre 10–20 min by train",
    },
    {
      name: "Tender operations",
      quay: "Anchorage in the Gulf of Livorno",
      usedBy: "Occasional overflow when berths are full or for very large vessels",
      cityAccess: "Tender to terminal area then coach or train — add 30–45 minutes to inland Tuscany planning",
    },
    {
      name: "Livorno Centrale station",
      quay: "Regional rail hub 10–15 min walk from cruise terminal",
      usedBy: "Cinque Terre Express to Manarola, Vernazza and Riomaggiore — the fastest DIY coastal option",
      cityAccess: "Walk from terminal or short taxi; trains to Cinque Terre villages every 15–30 minutes in season",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Where cruise ships dock in Livorno",
      paragraphs: [
        "Cruise ships dock at Livorno's commercial cruise terminal, a short walk from Livorno Centrale train station — the gateway to Tuscany and Cinque Terre.",
        "Livorno is the closest major cruise port to Cinque Terre (10–20 minutes by train). Florence is 90 km inland (90–120 minutes by coach). Pisa is 70 km (60–75 minutes). Portovenere, at the tip of the Gulf of Livorno, is 20 minutes by boat or 30 minutes by road.",
        "Livorno appears on Western Mediterranean, Grand Voyage and Italy-intensive itineraries from April through October, with heaviest traffic May to September.",
      ],
    },
    {
      heading: "Getting from Livorno to Tuscany and Cinque Terre",
      paragraphs: [
        "Florence is 90–120 minutes by coach or private transfer along the A12 and A11 motorways — the standard option for Renaissance Florence shore excursions.",
        "Cinque Terre is 10–20 minutes by regional train from Livorno Centrale to Manarola or Vernazza — the closest and often most relaxed cruise-day option.",
        "Pisa and Lucca are 60–75 minutes by coach — ideal for shorter port calls or best-value sightseeing.",
        "Portovenere is reached by ferry from Livorno harbour (seasonal) or by coach along the coast — a quieter alternative to the main Cinque Terre villages.",
      ],
    },
    {
      heading: "Facilities and practicalities",
      paragraphs: [
        "The cruise terminal offers toilets, seating and tourist information. Livorno Centrale has ATMs, cafés and ticket machines for Cinque Terre trains.",
        "Currency is the euro. Italian is the local language; English is widely spoken on excursions. Download offline maps — terminal Wi-Fi is unreliable.",
        "Livorno and the surrounding region are generally safe. Watch belongings on crowded trains to Cinque Terre during cruise season.",
      ],
    },
    {
      heading: "Return-to-ship timing",
      paragraphs: [
        "Confirm all-aboard time — usually 30–60 minutes before departure. Keep a 60–90 minute buffer beyond expected travel time, especially returning from Florence on the motorway.",
        "Summer afternoon traffic returning from Florence can add 20–30 minutes. Cinque Terre train services are frequent but village queues can delay afternoon returns.",
        "Independent travellers should plan return trains with margin — the ship will not wait if you miss all-aboard on non-ship excursions.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "How far is Florence from Livorno cruise port?",
      answer: "About 90 km — 90–120 minutes by coach along the A12 and A11. Allow a full day for Florence; combining with Pisa needs 10+ usable hours ashore.",
    },
    {
      question: "Can I walk to Livorno Centrale from the cruise terminal?",
      answer: "Yes — 10–15 minutes on foot. This is the station for Cinque Terre regional trains.",
    },
    {
      question: "Do cruise ships tender in Livorno?",
      answer: "Occasionally when berths are full. Tendering adds 30–45 minutes — confirm on your cruise app the evening before.",
    },
    {
      question: "How much time to return from Florence?",
      answer: "Allow 90–120 minutes coach transfer plus 60–90 minutes before all-aboard. Summer motorway traffic can add 20–30 minutes.",
    },
    {
      question: "Is Livorno worth exploring on its own?",
      answer: "The waterfront promenade and historic centre suit a relaxed half-day, but most passengers use Livorno as a gateway to Florence, Cinque Terre or Pisa.",
    },
  ] as FAQ[],
};

export const terminals = portGuideContent.terminals;
export const portGuideSections = portGuideContent.sections;
export const portGuideFaqs = portGuideContent.faqs;
