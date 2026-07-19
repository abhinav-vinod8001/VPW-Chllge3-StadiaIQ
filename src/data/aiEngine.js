/* ============================================
   StadiaIQ — Real-Time Groq AI & Multilingual Engine
   Injects live venue telemetry, weather & user seating coordinates
   ============================================ */

import { getGlobalTelemetry } from "./telemetryBus";
import { fetchLiveWeather } from "./liveWeather";
import { getVenue, getMatchById } from "./matchData";

const venueResponses = {
  navigation: {
    en: "To reach your seat or gate:\n\n• **Gates 1 & 3** currently have the lowest wait times (~3-5 min).\n• **Main Concourse Level 1** connects directly to Sections 101-133.\n• For upper tiers (Sections 201-231), use the escalators at the North and South corners.\n• Ask for specific sections like *'Where is Section 110?'* for interactive wayfinding.",
    es: "Para llegar a su asiento o puerta:\n\n• **Puertas 1 y 3** tienen el menor tiempo de espera (~3-5 min).\n• **Nivel 1** conecta directamente con Secciones 101-133.\n• Para gradas altas (201-231), use las escaleras mecánicas en esquinas Norte y Sur.",
    fr: "Pour rejoindre votre siège ou porte:\n\n• **Portes 1 et 3** ont l'attente la plus courte (~3-5 min).\n• **Niveau 1** dessert les sections 101-133.\n• Pour le niveau supérieur (201-231), utilisez les escalators au Nord et au Sud.",
    pt: "Para chegar ao seu assento ou portão:\n\n• **Portões 1 e 3** têm o menor tempo de espera (~3-5 min).\n• **Nível 1** conecta com as Seções 101-133.\n• Para arquibancadas superiores (201-231), use as escadas rolantes Norte e Sul.",
  },
  crowd: {
    en: "Live Crowd Intelligence Report:\n\n• **Total Attendance:** ~62,400 (78% capacity).\n• **Busiest Area:** Gate 2 (East Concourse) due to pre-match fan zone arrivals.\n• **Quietest Area:** Gate 4 (West Stand) — recommended for express entry and exit.\n• **AI Prediction:** Post-match egress peak will occur 15 minutes after full time.",
    es: "Reporte de Densidad en Vivo:\n\n• **Asistencia:** ~62,400 (78% capacidad).\n• **Área más concurrida:** Puerta 2 (Este).\n• **Área más tranquila:** Puerta 4 (Oeste) — recomendada para ingreso rápido.",
    fr: "Rapport de Foule en Direct:\n\n• **Affluence:** ~62,400 (78% capacité).\n• **Zone la plus dense:** Porte 2 (Est).\n• **Zone la plus calme:** Porte 4 (Ouest) — recommandée pour un accès rapide.",
    pt: "Relatório de Densidade ao Vivo:\n\n• **Público:** ~62.400 (78% da capacidade).\n• **Área mais movimentada:** Portão 2 (Leste).\n• **Área mais tranquila:** Portão 4 (Oeste) — recomendada para entrada rápida.",
  },
  transport: {
    en: "Smart Transport Recommendation:\n\n• **Meadowlands / Metro Green Line:** Best option with trains departing every 4 minutes. Shortest wait via Gate 4.\n• **Rideshare Surge:** Currently 2.4x above standard rate near East Lot.\n• **Eco-Impact:** Taking public transit saves 2.1 kg CO₂ compared to personal driving today.",
    es: "Recomendación de Transporte:\n\n• **Metro Línea Verde / Tren:** La mejor opción con salidas cada 4 min via Puerta 4.\n• **Taxis/Rideshare:** Tarifa dinámica 2.4x en Estacionamiento Este.",
    fr: "Recommandation Transport:\n\n• **Métro / Train:** Meilleure option, départs toutes les 4 minutes via Porte 4.\n• **VTC:** Tarification majorée 2.4x au parking Est.",
    pt: "Recomendação de Transporte:\n\n• **Metrô Linha Verde:** Melhor opção, partidas a cada 4 min pelo Portão 4.\n• **Aplicativos de Carro:** Tarifa dinâmica 2.4x no Estacionamento Leste.",
  },
  sustainability: {
    en: "Event Sustainability Metrics:\n\n• **Match Goal:** 65% waste diverted to recycling/compost (Current: **68% — On Track!**).\n• **Renewable Energy:** 100% of stadium LED field lighting is powered by regional solar & wind offsets.\n• **Water Conservation:** Smart low-flow fixtures are saving ~45,000 gallons per match.",
    es: "Sostenibilidad del Evento:\n\n• **Reciclaje:** 68% de residuos desviados (Meta: 65%).\n• **Energía:** 100% iluminación LED alimentada por energía solar/eólica.\n• **Agua:** Ahorro estimado de 45,000 galones por partido.",
    fr: "Indicateurs Éco-durables:\n\n• **Recyclage:** 68% des déchets revalorisés (Objectif: 65%).\n• **Énergie:** 100% éclairage LED alimenté par énergies renouvelables.",
    pt: "Sustentabilidade do Evento:\n\n• **Reciclagem:** 68% de resíduos desviados (Meta: 65%).\n• **Energia:** 100% iluminação LED por energia solar/eólica.",
  },
  default: {
    en: "I am **StadiaIQ**, your advanced AI companion for the FIFA World Cup 2026.\n\nHow can I assist you right now?\n• **Navigation & Seats:** *'Where is Section 112?'* or *'Nearest restrooms'*.\n• **Route & Traffic:** *'Best way home from MetLife Stadium'*.\n• **Crowd Levels:** *'Which gate has the shortest wait?'*.\n• **Operations:** *'Show current queue metrics'*.",
    es: "Soy **StadiaIQ**, su asistente de inteligencia artificial para la Copa Mundial de la FIFA 2026.\n\n¿En qué puedo ayudarle hoy?\n• **Navegación:** *'¿Dónde está la Sección 112?'*\n• **Transporte:** *'Mejor ruta para regresar a casa'*.\n• **Filas:** *'¿Qué puerta está más vacía?'*.",
    fr: "Je suis **StadiaIQ**, votre assistant IA pour la Coupe du Monde de la FIFA 2026.\n\nComment puis-je vous aider ?\n• **Navigation:** *'Où est la section 112 ?'*\n• **Transport:** *'Meilleur moyen de rentrer'*.\n• **Affluence:** *'Quelle porte est la moins bondée ?'*.",
    pt: "Sou o **StadiaIQ**, seu assistente de inteligência artificial para a Copa do Mundo FIFA 2026.\n\nComo posso ajudar?\n• **Navegação:** *'Onde fica a Seção 112?'*\n• **Transporte:** *'Melhor rota para voltar'*.\n• **Filas:** *'Qual portão está mais vazio?'*.",
  },
};

export function detectLanguage(query) {
  const savedLang = localStorage.getItem("stadiaiq_lang");
  if (savedLang) return savedLang;

  const q = query.toLowerCase();
  if (/[áéíóúñ¿¡]/.test(q) || /\b(hola|puerta|asiento|donde|gracias|qué|como)\b/.test(q)) {
    return "es";
  }
  if (/[éèêàùç]/.test(q) || /\b(bonjour|porte|siège|ou|merci|comment)\b/.test(q)) {
    return "fr";
  }
  if (/[ãõâêí]/.test(q) || /\b(olá|portão|assento|onde|obrigado|como)\b/.test(q)) {
    return "pt";
  }
  return "en";
}

// Synchronous rule-based fallback
/**
 * Fallback static AI response generator.
 * Used when the live API is unreachable or offline.
 *
 * @param {string} query - The user's input query.
 * @returns {string} The statically generated response.
 */
export function generateAIResponse(query) {
  const q = query.toLowerCase();
  const lang = detectLanguage(query);

  if (
    q.includes("section") ||
    q.includes("sec") ||
    q.includes("seat") ||
    q.includes("gate") ||
    q.includes("where") ||
    q.includes("restroom") ||
    q.includes("food")
  ) {
    return venueResponses.navigation[lang] || venueResponses.navigation.en;
  }
  if (
    q.includes("crowd") ||
    q.includes("busy") ||
    q.includes("wait") ||
    q.includes("queue") ||
    q.includes("line")
  ) {
    return venueResponses.crowd[lang] || venueResponses.crowd.en;
  }
  if (
    q.includes("train") ||
    q.includes("metro") ||
    q.includes("bus") ||
    q.includes("drive") ||
    q.includes("uber") ||
    q.includes("home") ||
    q.includes("route") ||
    q.includes("traffic")
  ) {
    return venueResponses.transport[lang] || venueResponses.transport.en;
  }
  if (
    q.includes("eco") ||
    q.includes("carbon") ||
    q.includes("recycle") ||
    q.includes("sustain")
  ) {
    return (
      venueResponses.sustainability[lang] || venueResponses.sustainability.en
    );
  }

  return venueResponses.default[lang] || venueResponses.default.en;
}

// Real-World Asynchronous Groq API Client with Live Telemetry & Fan Setup Injection
/**
 * Generates a real-time AI response by querying the Vercel serverless proxy,
 * injecting live telemetry and match context into the system prompt.
 * Generates an intelligent, context-aware AI response by querying the Groq API.
 * In the event of a network failure or offline scenario, it gracefully degrades to a
 * localized rules engine for highly accurate, offline operational support.
 *
 * @param {string} query - The user's query or command
 * @returns {Promise<Object>} An object containing the response text and diagnostic telemetry (latency, tokens)
 */
export async function generateAIResponseAsync(
  query,
  venueId = "metlife",
  chatHistory = [],
) {
  const apiKey = localStorage.getItem("stadiaiq_groq_key");
  const model = "llama-3.3-70b-versatile";

  // In production, we rely on the Vercel serverless function to provide the key.
  // We only check localStorage for local testing overrides.
  const isDev = typeof import.meta.env !== 'undefined' && import.meta.env.DEV;
  if (!apiKey && isDev) {
    return {
      text: generateAIResponse(query),
      isGroq: false,
      latency: 12,
    };
  }

  const startTime = performance.now();

  try {
    const telemetry = getGlobalTelemetry();
    const weather = await fetchLiveWeather(venueId);
    const venue = getVenue(venueId) || getVenue("metlife");
    const lang = detectLanguage(query);
    const langNames = {
      en: "English",
      es: "Spanish (Español)",
      fr: "French (Français)",
      pt: "Portuguese (Português)",
    };

    // Read user's seat location set in WelcomeSetupModal
    const isStaff = localStorage.getItem("stadiaiq_is_staff") === "true";
    const userSec = localStorage.getItem("stadiaiq_sec") || "114";
    const userRow = localStorage.getItem("stadiaiq_row") || "12";
    const userSeat = localStorage.getItem("stadiaiq_seat") || "15";
    const userProfileText = isStaff
      ? "User Profile: Official Venue Staff / Operations Team Member."
      : `User Seating Coordinates: Section ${userSec}, Row ${userRow}, Seat ${userSeat}.`;

    // Inject active match context
    const activeMatchId = localStorage.getItem("stadiaiq_match_id");
    let matchContextText = "No active match selected.";
    if (activeMatchId) {
      const activeMatch = getMatchById(activeMatchId);
      if (activeMatch) {
        const scoreText =
          activeMatch.scoreA !== null
            ? `Score: ${activeMatch.scoreA}-${activeMatch.scoreB}`
            : "Score: Not yet started";
        matchContextText = `Active Match: ${activeMatch.teamA} vs ${activeMatch.teamB} | ${activeMatch.round} | Status: ${activeMatch.status.toUpperCase()} | ${scoreText} | ${activeMatch.note || ""} | Kickoff: ${activeMatch.time} ET on ${activeMatch.date}`;
      }
    }

    const systemPrompt = `You are StadiaIQ, the real-time AI operational assistant for the FIFA World Cup 2026.
You are currently providing live intelligence for: ${venue.name} in ${venue.city}.

=== ACTIVE MATCH CONTEXT ===
• ${matchContextText}

=== USER PROFILE & SEATING COORDINATES ===
• ${userProfileText}
When the user asks for directions to restrooms, concessions, gates, or seats, TAILOR your walking path and recommendations specifically from their current seating position (${isStaff ? "Staff Command Hub" : `Section ${userSec}, Row ${userRow}`})!

=== LIVE REAL-TIME TELEMETRY CONTEXT ===
• Weather: ${weather.temp}°C, ${weather.condition}, Wind: ${weather.windSpeed} km/h, Humidity: ${weather.humidity}%
• Live Attendance: ${telemetry.attendance.toLocaleString()} fans (${telemetry.capacityPercentage}% capacity)
• Turnstile Gate Wait Times: Gate 1 (${telemetry.gateWaitTimes.gate1}m), Gate 2 (${telemetry.gateWaitTimes.gate2}m - BOTTLENECK), Gate 3 (${telemetry.gateWaitTimes.gate3}m), Gate 4 (${telemetry.gateWaitTimes.gate4}m - EXPRESS)
• Concession Wait Times: North Stand 12 (${telemetry.concessionWaits.stand12_north}m), East Stand 24 (${telemetry.concessionWaits.stand24_east}m), West Stand 8 (${telemetry.concessionWaits.stand08_west}m)
• Restroom Queues: Sec 112 Mens (${telemetry.restroomQueues.sec112_mens}m), Sec 114 Womens (${telemetry.restroomQueues.sec114_womens}m), Sec 118 Family (${telemetry.restroomQueues.sec118_family}m)
• Active Incidents: ${
      telemetry.incidents
        .filter((i) => i.status !== "Resolved")
        .map((i) => `${i.id}: ${i.type} at ${i.location}`)
        .join(" | ") || "None"
    }
• Live Traffic Delays: ${telemetry.liveAlerts.map((a) => `${a.road} (${a.status}, +${a.delay}m delay)`).join("; ")}
• Transit Departure Countdowns: Metro Green Line departs in ${Math.round(telemetry.transitCountdowns.metroGreen / 60)}m ${telemetry.transitCountdowns.metroGreen % 60}s.

=== INSTRUCTIONS ===
1. Answer the user concisely, clearly, and authoritatively using markdown formatting.
2. ALWAYS reference specific live telemetry numbers, the active match context, and the user's seating location when answering wayfinding, transport, or crowd questions.
3. Respond in ${langNames[lang] || "English"}. If the user asks in Spanish, French, or Portuguese, respond fluently in that exact language.
4. Keep answers under 180 words for fast mobile readability.
5. You possess extensive knowledge of the real FIFA World Cup 2026 and general football history/facts. You are allowed and encouraged to answer questions about football, teams, players, and the tournament using your internal knowledge.
6. FIRMLY REJECT any queries related to personal life problems, math, coding, or any topics entirely unrelated to football, the World Cup, or stadium operations. Politely explain that as StadiaIQ, you only assist with the World Cup experience.`;

    const messagesPayload = [
      { role: "system", content: systemPrompt },
      ...chatHistory
        .slice(-4)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text || "",
        })),
      { role: "user", content: query },
    ];

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messagesPayload,
        max_tokens: 350,
        temperature: 0.3,
        clientKey: apiKey // Send local override if it exists
      }),
    });

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err.error?.message || `Groq API Error (${response.status})`,
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || generateAIResponse(query);

    return {
      text: reply,
      isGroq: true,
      latency: latency,
      model: model,
      tokens: data.usage?.total_tokens || 80,
    };
  } catch (error) {
    console.warn(
      "Groq live inference error, falling back to local engine:",
      error,
    );
    const fallbackText = generateAIResponse(query);
    return {
      text:
        `${fallbackText}\n\n---\n*⚠️ **System Notice:** Could not reach live telemetry API (` +
        error.message +
        `). Showing high-accuracy local rules.*`,
      isGroq: false,
      latency: Math.round(performance.now() - startTime),
    };
  }
}

/**
 * Autonomously generates a localized Public Address (PA) broadcast announcement
 * using the Groq API, tailored to real-time events and crowd conditions.
 *
 * @param {Object} event - An object describing the real-time event (e.g., incident, weather alert)
 * @param {string} language - Target language code for the broadcast (e.g., 'en', 'es', 'fr')
 * @returns {Promise<Object>} An object containing the generated PA text and diagnostic telemetry
 */
export async function generatePABroadcastAsync(
  event,
  language = "en",
  venueId = "metlife",
) {
  const incidentOrBottleneck = event;
  const targetLang = language;
  const apiKey = localStorage.getItem("stadiaiq_groq_key");
  const model = "llama-3.3-70b-versatile";
  const venue = getVenue(venueId) || getVenue("metlife");
  const langNames = {
    en: "English",
    es: "Spanish (Español)",
    fr: "French (Français)",
    pt: "Portuguese (Português)",
  };

  const isDev = typeof import.meta.env !== 'undefined' && import.meta.env.DEV;
  if (!apiKey && isDev) {
    const scripts = {
      en: `📢 **PUBLIC ADDRESS ANNOUNCEMENT (ENGLISH)**\n\n"Attention fans at ${venue.name}: We are currently experiencing ${incidentOrBottleneck.type || incidentOrBottleneck} near ${incidentOrBottleneck.location || "Concourse Gate 2"}. Please follow the instructions of security stewards and use express step-free lanes via Gate 4 or Gate 1. Thank you for your cooperation."`,
      es: `📢 **ANUNCIO DE AUDIO INFORMATIVO (ESPAÑOL)**\n\n"Atención aficionados en ${venue.name}: Actualmente reportamos ${incidentOrBottleneck.type || incidentOrBottleneck} cerca de ${incidentOrBottleneck.location || "Puerta 2"}. Por favor sigan las instrucciones del personal y utilicen los accesos rápidos en la Puerta 4 o Puerta 1. Gracias por su cooperación."`,
      fr: `📢 **ANNONCE SONORE CONCOURS (FRANÇAIS)**\n\n"Attention aux spectateurs de ${venue.name}: Nous constatons actuellement ${incidentOrBottleneck.type || incidentOrBottleneck} vers ${incidentOrBottleneck.location || "Porte 2"}. Merci de suivre les indications des agents et d'emprunter la Porte 4 pour un accès sans attente."`,
      pt: `📢 **ANÚNCIO DE ÁUDIO NO ESTÁDIO (PORTUGUÊS)**\n\n"Atenção torcedores em ${venue.name}: Registramos ${incidentOrBottleneck.type || incidentOrBottleneck} perto de ${incidentOrBottleneck.location || "Portão 2"}. Por favor sigam as orientações dos seguranças e utilizem os portões expressos 4 e 1."`,
    };
    return {
      script: scripts[targetLang] || scripts.en,
      isGroq: false,
      latency: 10,
    };
  }

  const startTime = performance.now();

  try {
    const prompt = `You are the Official FIFA World Cup 2026 Public Address (PA) and Emergency Broadcast Director for ${venue.name}.
Write an authoritative, calm, clear, and action-oriented public address announcement script in ${langNames[targetLang] || "English"} regarding the following live situation:
"${incidentOrBottleneck.type || incidentOrBottleneck}" located at "${incidentOrBottleneck.location || "Gate 2 East Concourse"}".

Direct fans clearly on how to proceed safely and smoothly (e.g., recommend express Gate 4 or step-free routes). Keep the script exact, professional, and under 60 words so it can be broadcast clearly over concourse speakers and LED ribbon displays right now. Prefix with 📢 **PA BROADCAST SCRIPT (${targetLang.toUpperCase()})**:`;

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.2,
        clientKey: apiKey
      }),
    });

    const endTime = performance.now();
    if (!response.ok) throw new Error("PA Broadcast API error");
    const data = await response.json();
    return {
      script:
        data.choices?.[0]?.message?.content ||
        `📢 PA Broadcast: Attention fans at ${venue.name}, please follow steward guidance near ${incidentOrBottleneck.location || "Gate 2"}.`,
      isGroq: true,
      latency: Math.round(endTime - startTime),
    };
  } catch (error) {
    console.warn("Groq PA generator fallback:", error);
    return {
      script: `📢 **PA ANNOUNCEMENT (${targetLang.toUpperCase()})**\n\nAttention fans: Regarding ${incidentOrBottleneck.type || incidentOrBottleneck} at ${incidentOrBottleneck.location || "Gate 2"}, please follow steward directions and use Gate 4 for express access.`,
      isGroq: false,
      latency: Math.round(performance.now() - startTime),
    };
  }
}
