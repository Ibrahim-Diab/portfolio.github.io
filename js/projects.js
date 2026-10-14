// Single source of truth for every project on the page.
// Add a project by appending an object; the featured tiles, the app grid,
// the filters and the screenshot sheet are all rendered from this list.
//
// status:   "live" | "delisted" | "upcoming" | "delivered" (handed to the client,
//           no public App Store page). Live projects are listed first.
// category: one of the keys in CATEGORIES
// featured: optional { order, tagline, surface, highlights: [{ title, text }] }
//           surface: "dark" | "dark-2" | "dark-3" | "parchment" | "light".
//           Order featured tiles so surfaces alternate; two dark tiles in a row
//           must use different micro-steps (dark then dark-2).
// apps:     one entry per App Store binary (client, captain, provider, ...).
//           An app can override the project status (e.g. a captain app still in
//           progress next to a live client app). `shots` may be empty before launch.

const CATEGORIES = {
  mobility: "Mobility",
  commerce: "Commerce",
  services: "Services",
  business: "Business & Tools",
  media: "Media",
};

const shots = (folder, files) => files.map((f) => `Projects_Images/${folder}/${f}`);
const range = (n) => Array.from({ length: n }, (_, i) => i + 1);
const numbered = (folder, n) => shots(folder, range(n).map((i) => `shot-${i}.webp`));
const storeShots = (folder, pattern, n) =>
  shots(folder, range(n).map((i) => pattern.replace("{i}", i === 1 ? "" : `-${i}`)));

const PROJECTS = [
  {
    id: "beeb-beeb",
    name: "BEEB BEEB",
    icon: "App_Icons/BeebBeeb.webp",
    category: "mobility",
    status: "live",
    summary:
      "E-scooter rental for Saudi Arabia: a live map of nearby scooters, QR scan-to-unlock, per-minute billing, a prepaid wallet and ride packages.",
    featured: {
      order: 1,
      tagline: "Find it. Scan it. Ride it.",
      surface: "dark",
      highlights: [
        { title: "Scan to unlock", text: "Camera QR scanning built on AVFoundation unlocks a scooter in one step." },
        { title: "Live ride tracking", text: "Real-time scooter availability and trip progress over Socket.IO on Google Maps." },
        { title: "Wallet and packages", text: "Prepaid top-ups, pay-per-minute pricing and subscription ride packages." },
      ],
    },
    apps: [
      { label: "iOS app", url: "https://apps.apple.com/sa/app/beeb-beeb/id6794843707", shots: numbered("BeebBeeb", 6) },
    ],
  },
  {
    id: "noh",
    name: "NOH",
    icon: "App_Icons/NOH.webp",
    category: "mobility",
    status: "live",
    summary:
      "Livestock and goods transport. Customers create a shipment, follow the trip live, message the driver and pay from an in-app wallet; drivers manage requests, trips and settlements in their own app.",
    apps: [
      { label: "Client", url: "https://apps.apple.com/sa/app/noh/id6783436851", shots: numbered("NOH", 6) },
      { label: "Driver", url: "https://apps.apple.com/sa/app/noh-driver/id6783720619", shots: numbered("NOHDriver", 6) },
    ],
  },
  {
    id: "ladygo",
    name: "LadyGO",
    icon: "App_Icons/LadyGo.webp",
    category: "mobility",
    status: "live",
    summary:
      "Women-only ride-hailing and light-parcel delivery with female captains. Instant or scheduled rides, live tracking, chat, wallet and rewards.",
    apps: [
      { label: "Client", url: "https://apps.apple.com/sa/app/ladygo/id6776451794", shots: numbered("LadyGo", 5) },
      { label: "Captain", url: "https://apps.apple.com/sa/app/lady-go-captain/id6808168282", shots: numbered("LadyGoCaptain", 5) },
    ],
  },
  {
    id: "fazma",
    name: "Fazma",
    icon: "App_Icons/Fazma.webp",
    category: "commerce",
    status: "live",
    summary:
      "Video-first shopping. Shoppers browse products as vertical reels, see the price and merchant, and add to cart without leaving the video.",
    apps: [
      { label: "iOS app", url: "https://apps.apple.com/sa/app/fazma/id6776164030", shots: numbered("Fazma", 6) },
    ],
  },
  {
    id: "sast",
    name: "SAST",
    icon: "App_Icons/SAST.webp",
    category: "mobility",
    status: "live",
    summary:
      "School and university bus subscriptions. A client app for booking trips and subscriptions, and a Captain app for drivers with stop-by-stop routes and attendance.",
    featured: {
      order: 4,
      tagline: "Every stop, on time.",
      surface: "dark",
      highlights: [
        { title: "Two apps, one foundation", text: "Client and Captain apps built on the same Swift 6 base project." },
        { title: "Stop-by-stop routes", text: "Morning and evening trips with live tracking and per-stop attendance." },
        { title: "Real-time updates", text: "Trip and schedule changes pushed instantly with Firebase and Socket.IO." },
      ],
    },
    apps: [
      { label: "Client", url: "https://apps.apple.com/sa/app/%D8%B3%D8%A7%D8%B3%D8%AA/id6765976850", shots: numbered("SAST", 7) },
      { label: "Captain", url: "https://apps.apple.com/sa/app/%D8%B3%D8%A7%D8%B3%D8%AA-%D9%83%D8%A7%D8%A8%D8%AA%D9%86/id6765917072", shots: numbered("SASTCaptain", 7) },
    ],
  },
  {
    id: "sakan",
    name: "Sakan",
    icon: "App_Icons/Sakan.webp",
    category: "services",
    status: "live",
    summary:
      "Real estate platform connecting property seekers with agents. Seekers post requirements, receive matching offers and talk to agents through chat, calls or WhatsApp.",
    featured: {
      order: 3,
      tagline: "The right home, matched to you.",
      surface: "parchment",
      highlights: [
        { title: "Request-driven matching", text: "Seekers describe what they need; agents reply with matching offers." },
        { title: "Real-time chat", text: "In-app messaging over sockets, plus one-tap calls and WhatsApp." },
        { title: "Reactive architecture", text: "SwiftUI with Clean Architecture, MVVM + Coordinator and Combine." },
      ],
    },
    apps: [
      { label: "iOS app", url: "https://apps.apple.com/eg/app/sakan-%D8%B3%D9%83%D9%86/id6753960709", shots: storeShots("Sakan", "460x996bb{i}.webp", 6) },
    ],
  },
  {
    id: "torequest",
    name: "ToRequest",
    icon: "App_Icons/ToR.png",
    category: "commerce",
    status: "live",
    summary:
      "Dual-role marketplace. Customers order from local stores and delegates pick up and deliver, all within a single app.",
    apps: [
      { label: "iOS app", url: "https://apps.apple.com/eg/app/torequest/id6744581523", shots: storeShots("ToRequest", "460x996bb{i}.webp", 7) },
    ],
  },
  {
    id: "mytaxi",
    name: "MyTaxi",
    icon: "App_Icons/MyTaxi_Client.png",
    category: "mobility",
    status: "live",
    summary:
      "Ride-hailing and delivery with live trip tracking, a rewards program and multiple payment methods, plus a driver app for accepting trips in real time.",
    apps: [
      { label: "Client", url: "https://apps.apple.com/eg/app/my-taxi/id6717596448", shots: storeShots("MyTaxiClient", "460x996bb{i}.webp", 6) },
      { label: "Driver", url: "https://apps.apple.com/eg/app/mytaxidelegate/id6720725822", shots: storeShots("MyTaxiDriver", "460x996bb{i}.webp", 5) },
    ],
  },
  {
    id: "easy-wash",
    name: "Easy Wash KSA",
    icon: "App_Icons/EasyWash.webp",
    category: "services",
    status: "live",
    summary:
      "On-demand laundry across three apps. Customers book regular or express service, laundries manage orders, and delegates handle pickup and delivery.",
    apps: [
      { label: "Client", url: "https://apps.apple.com/eg/app/%D8%BA%D8%B3%D9%8A%D9%84%D9%83-%D8%B3%D9%87%D9%84-easy-wash-ksa/id6739170279", shots: storeShots("EasyWashClient", "400x800bb{i}.png", 5) },
      { label: "Provider", url: "https://apps.apple.com/sa/app/%D8%BA%D8%B3%D9%8A%D9%84%D9%83-%D8%B3%D9%87%D9%84-%D9%85%D9%82%D8%AF%D9%85-easy-wash-ksa/id6738728296", shots: storeShots("EasyWashProvider", "400x800bb{i}.png", 5) },
      { label: "Delegate", url: "https://apps.apple.com/sa/app/%D8%BA%D8%B3%D9%8A%D9%84%D9%83-%D8%B3%D9%87%D9%84-%D9%85%D9%86%D8%AF%D9%88%D8%A8-easy-wash-ksa/id6738771878", shots: numbered("EasyWashDelegate", 5) },
    ],
  },
  {
    id: "nujdiak",
    name: "Nujdiak",
    icon: "App_Icons/Nujdik.png",
    category: "commerce",
    status: "live",
    summary:
      "Livestock marketplace with location-aware listings, maps and real-time updates between buyers and sellers.",
    apps: [
      { label: "iOS app", url: "https://apps.apple.com/eg/app/nujdiak/id6739465906", shots: storeShots("Nujdik", "460x998bb{i}.webp", 6) },
    ],
  },
  {
    id: "cylinder",
    name: "Cylinder",
    icon: "App_Icons/Cylinder.jpg",
    category: "services",
    status: "live",
    summary:
      "Gas cylinder delivery. Customers pin a location, order now or schedule for later, and pay the way they prefer.",
    apps: [
      { label: "iOS app", url: "https://apps.apple.com/eg/app/cylinder-%D8%A7%D8%B3%D8%B7%D9%88%D8%A7%D9%86%D8%A9/id6708238179", shots: storeShots("Cylinder", "400x800bb{i}.png", 8) },
    ],
  },
  {
    id: "teachernow",
    name: "TeacherNow",
    icon: "App_Icons/TNClient.png",
    category: "services",
    status: "live",
    summary:
      "Education platform connecting students with teachers through content subscriptions and in-app payments, with a separate app for teachers.",
    apps: [
      { label: "Student", url: "https://apps.apple.com/us/app/teachernow/id6502044672", shots: shots("TeacherNow", range(6).map((i) => `0x0ss-${i + 8}.webp`)) },
      { label: "Teacher", url: "https://apps.apple.com/eg/app/teachernowprovider/id6502042966", shots: shots("TeacherNowProvider", range(3).map((i) => `0x0ss-${i + 14}.webp`)) },
    ],
  },
  {
    id: "mesllah",
    name: "Mesllah",
    icon: "App_Icons/Mesllah.webp",
    category: "business",
    status: "delisted",
    summary:
      "Farm ERP for livestock that tracks production, feed, medication, vaccinations and trading, with offline support backed by Core Data.",
    featured: {
      order: 2,
      tagline: "The whole herd, on the record.",
      surface: "dark-2",
      highlights: [
        { title: "Every animal tracked", text: "Production, feed, medication, vaccination and trading history per animal." },
        { title: "Works offline", text: "Core Data storage on device that syncs back to the server when a connection returns." },
        { title: "Built to grow", text: "Modular UIKit codebase with MVVM + Coordinator and Combine data binding." },
      ],
    },
    apps: [
      { label: "iOS app", shots: storeShots("Mesllah", "460x996bb{i}.webp", 6) },
    ],
  },
  {
    id: "bily-abaya",
    name: "Bily Abaya",
    icon: "App_Icons/Bily.webp",
    category: "commerce",
    status: "delisted",
    summary:
      "Premium abaya shopping for Saudi Arabia. Shoppers browse designs, choose a designer or tailor, and pay securely.",
    apps: [
      { label: "iOS app", shots: storeShots("BillyAbayat", "0x0ss{i}.webp", 8) },
    ],
  },
  {
    id: "pikrose",
    name: "Pikrose",
    icon: "App_Icons/PickRose_Client.png",
    category: "commerce",
    status: "delisted",
    summary:
      "Gifting for every occasion. Customers pick items and the team prepares and delivers them, with a delegate app for fulfilment.",
    apps: [
      { label: "Client", shots: storeShots("PikroseClient", "460x996bb{i}.webp", 6) },
      { label: "Delegate", shots: storeShots("PikroseDelegate", "460x996bb{i}.webp", 6) },
    ],
  },
  {
    id: "mowsel",
    name: "Mowsel",
    icon: "App_Icons/Mowsel.webp",
    category: "mobility",
    status: "live",
    summary:
      "Peer-to-peer parcel delivery between Saudi cities. Senders post a shipment, captains already travelling that route make offers, and each handover is confirmed with a one-time code.",
    apps: [
      { label: "Client", url: "https://apps.apple.com/sa/app/mowsel/id6807456435", shots: numbered("Mowsel", 5) },
      { label: "Captain", status: "upcoming", shots: [] },
    ],
  },
  {
    id: "fifty-five-seconds",
    name: "55 Seconds",
    icon: "App_Icons/FiftyFiveSeconds.webp",
    category: "media",
    status: "live",
    summary:
      "A short-video feed where people react with their voice: watch clips, record a voice comment and listen to everyone else's.",
    apps: [
      { label: "iOS app", url: "https://apps.apple.com/sa/app/55-seconds/id1663091325", shots: numbered("FiftyFiveSeconds", 6) },
    ],
  },
  {
    id: "oote",
    name: "OOTE",
    icon: "App_Icons/OOTE.webp",
    category: "mobility",
    status: "upcoming",
    summary:
      "School and student transport. Parents subscribe to a plan and sign the contract in the app, then follow every ride live; captains run their routes from a dedicated app.",
    apps: [
      { label: "Client", shots: [] },
      { label: "Captain", shots: [] },
    ],
  },
  {
    id: "lets-go",
    name: "Lets Go",
    icon: "App_Icons/LetsGo.webp",
    category: "mobility",
    status: "upcoming",
    summary:
      "Ride-hailing for Saudi Arabia (مشينا): book a trip, track the order and chat with the captain. The captain app also handles goods delivery and flatbed trucking.",
    apps: [
      { label: "Client", shots: [] },
      { label: "Captain", shots: [] },
    ],
  },
  {
    id: "rowha",
    name: "Rowha",
    icon: "App_Icons/Rowha.webp",
    category: "mobility",
    status: "upcoming",
    summary:
      "Intercity ride sharing. Captains publish rides with seats and a price, passengers request a seat, pay once approved and follow the trip live. Sign-up is verified through Nafath.",
    apps: [
      { label: "iOS app", shots: [] },
    ],
  },
  {
    id: "hmml",
    name: "Hmml",
    icon: "App_Icons/Hmml.webp",
    category: "mobility",
    status: "upcoming",
    summary:
      "Freight marketplace. Shippers describe the load, weight and route in a guided flow and choose a truck; providers manage their trucks, drivers and orders.",
    apps: [
      { label: "Client", shots: [] },
      { label: "Provider", shots: [] },
    ],
  },
  {
    id: "mashawir",
    name: "Mashawir",
    icon: "App_Icons/Mashawir.webp",
    category: "mobility",
    status: "delivered",
    summary:
      "Ride-hailing with the full trip cycle: pick locations, get a quote, follow the trip, chat and pay from a wallet. Drivers manage trips, availability and earnings in the provider app.",
    apps: [
      { label: "Client", shots: [] },
      { label: "Provider", shots: [] },
    ],
  },
  {
    id: "smartrecord",
    name: "SmartRecord",
    icon: "App_Icons/SmartRecord.png",
    category: "business",
    status: "upcoming",
    summary:
      "High-quality audio recording with trimming, noise reduction and cloud backup.",
    apps: [
      { label: "iOS app", shots: storeShots("SmartRecord", "0x0ss{i}.webp", 9) },
    ],
  },
];
