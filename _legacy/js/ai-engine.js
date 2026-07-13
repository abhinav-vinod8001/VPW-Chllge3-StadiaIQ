/* ============================================
   StadiumAI — AI Engine (Simulated Gemini)
   ============================================ */

const AIEngine = (() => {

  // --- Knowledge Base for Contextual Responses ---

  const stadiumInfo = {
    gates: {
      'A': { location: 'North entrance', nearestMetro: 'Stadium North', wheelchair: true },
      'B': { location: 'East entrance', nearestMetro: 'Stadium East', wheelchair: true },
      'C': { location: 'South entrance', nearestMetro: 'Stadium South', wheelchair: false },
      'D': { location: 'West entrance', nearestMetro: 'Stadium West', wheelchair: true },
    },
    facilities: {
      restrooms: ['Near Gate A (Level 1)', 'Near Gate B (Level 1)', 'Central Concourse (Level 2)', 'VIP Lounge (Level 3)'],
      foodCourts: ['FIFA Fan Food Court (Gate A)', 'International Bites (Gate B)', 'Quick Eats (Central)', 'Premium Dining (Level 3)'],
      firstAid: ['Medical Center (Gate A)', 'First Aid Post (Gate C)', 'VIP Medical (Level 3)'],
      atm: ['Near Gate A', 'Central Concourse', 'Near Gate D'],
    },
    sections: {
      'A1-A10': { level: 1, gate: 'A', type: 'Standard' },
      'B1-B10': { level: 1, gate: 'B', type: 'Standard' },
      'C1-C10': { level: 2, gate: 'C', type: 'Category 2' },
      'D1-D10': { level: 2, gate: 'D', type: 'Category 2' },
      'VIP1-VIP5': { level: 3, gate: 'A', type: 'VIP' },
    }
  };

  const multilingualGreetings = {
    en: "Hello! I'm your AI Stadium Assistant. How can I help you today?",
    es: "¡Hola! Soy tu asistente de estadio con IA. ¿Cómo puedo ayudarte hoy?",
    fr: "Bonjour ! Je suis votre assistant IA du stade. Comment puis-je vous aider ?",
    ar: "مرحبًا! أنا مساعدك الذكي في الملعب. كيف يمكنني مساعدتك؟",
    pt: "Olá! Sou seu assistente de estádio com IA. Como posso ajudá-lo?",
    de: "Hallo! Ich bin Ihr KI-Stadionassistent. Wie kann ich Ihnen helfen?",
    ja: "こんにちは！AIスタジアムアシスタントです。どのようにお手伝いできますか？",
    zh: "你好！我是您的AI体育场助手。我能为您提供什么帮助？",
    hi: "नमस्ते! मैं आपका AI स्टेडियम सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?",
    ko: "안녕하세요! AI 경기장 어시스턴트입니다. 무엇을 도와드릴까요?"
  };

  // --- Response Templates ---

  const responseTemplates = {

    navigation: [
      (query) => {
        const gateMatch = query.match(/gate\s*([a-d])/i);
        if (gateMatch) {
          const gate = gateMatch[1].toUpperCase();
          const info = stadiumInfo.gates[gate];
          if (info) {
            return `**Gate ${gate}** is located at the **${info.location}**.\n\n📍 Nearest metro: ${info.nearestMetro}\n♿ Wheelchair accessible: ${info.wheelchair ? 'Yes' : 'No'}\n\nFrom your current location, head towards the ${info.location.split(' ')[0].toLowerCase()} side of the stadium. Follow the illuminated signage along the main concourse.`;
          }
        }
        return null;
      },
      (query) => {
        if (/restroom|bathroom|toilet|wc/i.test(query)) {
          return `🚻 **Restroom Locations:**\n\n${stadiumInfo.facilities.restrooms.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nThe nearest restroom to most seating areas is on the **Central Concourse (Level 2)**. Current wait time: approximately 3 minutes.`;
        }
        return null;
      },
      (query) => {
        if (/food|eat|restaurant|drink|hungry/i.test(query)) {
          return `🍔 **Food & Beverage Options:**\n\n${stadiumInfo.facilities.foodCourts.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n**Recommended right now:** International Bites (Gate B) has the shortest wait time (~5 min). The FIFA Fan Food Court has the widest variety including halal, kosher, and vegan options.`;
        }
        return null;
      },
      (query) => {
        if (/seat|section|row|find my seat/i.test(query)) {
          const sectionMatch = query.match(/section\s*([a-d]\d+|vip\d+)/i);
          if (sectionMatch) {
            return `🪑 **Finding your seat in Section ${sectionMatch[1].toUpperCase()}:**\n\n1. Enter through the nearest gate\n2. Take the escalator to the correct level\n3. Follow the section markers along the concourse\n4. An usher will guide you to your row\n\nLook for the illuminated section numbers above each tunnel entrance.`;
          }
          return `🪑 To find your seat, check your ticket for the **Section**, **Row**, and **Seat** number. Enter through the gate closest to your section and follow the concourse signs. Need help with a specific section?`;
        }
        return null;
      },
      (query) => {
        if (/first\s*aid|medical|emergency|hurt|injured/i.test(query)) {
          return `🏥 **Medical & First Aid:**\n\n${stadiumInfo.facilities.firstAid.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n🚨 **For emergencies:** Contact the nearest steward or call the stadium emergency line displayed on screens. Medical staff are stationed throughout the venue and can reach any section within 3 minutes.`;
        }
        return null;
      }
    ],

    crowd: [
      () => `📊 **Current Crowd Analysis:**\n\nThe stadium is at **78% capacity** (62,400 / 80,000).\n\n- 🟢 **Low density:** Sections A1-A5, D6-D10\n- 🟡 **Moderate:** Sections B1-B10, C1-C5\n- 🟠 **High:** Sections C6-C10\n- 🔴 **Near capacity:** VIP sections\n\n**AI Prediction:** Based on entry flow patterns, the west concourse (Gate D) will be the least crowded exit route at full time. I recommend heading there 5 minutes before the final whistle to avoid peak congestion.`,
      () => `⏱️ **Queue Time Estimates:**\n\n- Gate A entry: ~4 min\n- Gate B entry: ~7 min\n- Gate C entry: ~12 min (⚠️ busiest)\n- Gate D entry: ~3 min ✅\n\n**Recommendation:** If you haven't entered yet, Gate D currently has the shortest wait. Avoid Gate C as a large group arrived there recently.`,
    ],

    transport: [
      () => `🚇 **Transport Recommendations (Post-Match):**\n\n1. **Metro** (Recommended ✅)\n   - Stadium North station: 5 min walk, trains every 3 min\n   - Expected wait: 8-12 min post-match\n   - Carbon: 0.02 kg CO₂\n\n2. **Shuttle Bus**\n   - Pick-up at Gate A parking lot\n   - Runs every 10 min until 1:00 AM\n   - Carbon: 0.08 kg CO₂\n\n3. **Rideshare**\n   - Designated pick-up zone: Lot C\n   - Surge pricing likely post-match (~2.3x)\n   - Carbon: 0.15 kg CO₂\n\n💡 **AI Tip:** Leave 5 minutes early via Gate D to catch the metro with minimal wait. This saves ~20 minutes compared to post-match rush.`,
    ],

    accessibility: [
      () => `♿ **Accessibility Information:**\n\n**Wheelchair Access:**\n- Gates A, B, and D have step-free entry\n- Elevators at all 4 corners of the stadium\n- Wheelchair seating in Sections A1, B5, C1, D5\n\n**Sensory Room:**\n- Located near Gate A, Level 1\n- Quiet space with match viewing screen\n- Available throughout the match\n\n**Audio Description:**\n- Available on channel 2 of your stadium headset\n- Multilingual audio descriptions available\n\n**Assistance Dogs:**\n- Welcome in all areas\n- Relief areas at Gate A and Gate C (ground level)\n\nNeed a specific accessible route planned? Tell me your starting point and destination.`,
    ],

    sustainability: [
      () => `🌱 **Your Match Day Sustainability Report:**\n\n**Carbon Footprint Estimate:** 2.4 kg CO₂\n- Transport: 1.8 kg (${Math.random() > 0.5 ? 'metro' : 'rideshare'})\n- Food & drink: 0.4 kg\n- Stadium energy share: 0.2 kg\n\n**How you compare:** You're **32% below** the average fan's footprint! 🎉\n\n**Eco Tips:**\n1. 🚰 Use the free water refill stations (12 locations)\n2. ♻️ Sort waste into the color-coded bins\n3. 🚇 Take public transit home to keep your score low\n4. 🌿 The stadium uses 100% renewable energy\n\n**FIFA 2026 Sustainability Goal:** This tournament aims to be the first carbon-neutral World Cup.`,
    ],

    operations: [
      () => `📋 **Operational Intelligence Summary:**\n\n**Staffing:**\n- Active stewards: 342 / 400 deployed\n- Medical staff: 28 on duty\n- Volunteers: 156 active\n\n**Alerts:**\n- ⚠️ Gate C queue exceeding 15-min threshold — deploy 3 additional staff\n- ⚠️ Section C8 approaching capacity — redirect incoming fans to C3-C5\n- ✅ All medical stations operational\n- ✅ All concession stands open\n\n**AI Recommendations:**\n1. Open auxiliary entrance at Gate C-East to reduce queue\n2. Increase roaming vendor deployment in Sections D6-D10 (low food sales, high attendance)\n3. Pre-position exit management team at Gate D for post-match flow\n\n**Weather Impact:** Clear skies, 24°C — no weather-related adjustments needed.`,
    ],

    general: [
      (query) => {
        if (/wifi|internet|connect/i.test(query)) {
          return `📶 **Stadium WiFi:**\n\nNetwork: **FIFA-WC2026-Free**\nPassword: Not required (open network)\n\nConnect and accept the terms on the captive portal. Speed: ~50 Mbps shared. For best performance, use the FIFA World Cup official app which has data-saving mode.`;
        }
        return null;
      },
      (query) => {
        if (/water|drink|refill|bottle/i.test(query)) {
          return `🚰 **Water Refill Stations:**\n\nFree water refill points are available at:\n- Every gate entrance (4 locations)\n- Central concourse — both sides (4 locations)\n- Level 2 concourse (2 locations)\n- Level 3 VIP area (2 locations)\n\nPlease bring a reusable bottle! Single-use plastic bottles are not sold inside the stadium as part of FIFA's sustainability initiative.`;
        }
        return null;
      },
      (query) => {
        if (/schedule|match|game|play|kickoff|time/i.test(query)) {
          return `⚽ **Today's Match:**\n\n🏟️ MetLife Stadium, New Jersey\n📅 July 12, 2026\n⏰ Kickoff: 8:00 PM ET\n\n**Match:** Quarter Final\n🇧🇷 Brazil vs 🇫🇷 France\n\n**Upcoming at this venue:**\n- July 14: Semi-Final 1 (7:00 PM)\n- July 17: Semi-Final 2 (7:00 PM)\n- July 19: FIFA World Cup Final (8:00 PM)`;
        }
        return null;
      },
    ],

    fallback: [
      `I'd be happy to help! I can assist with:\n\n🗺️ **Navigation** — Finding gates, seats, restrooms, food\n👥 **Crowd Info** — Density, queue times, best exits\n🚇 **Transport** — Metro, shuttle, rideshare options\n♿ **Accessibility** — Wheelchair routes, sensory rooms\n🌱 **Sustainability** — Carbon footprint, eco tips\n📊 **Operations** — Staff metrics, incident alerts\n\nWhat would you like to know?`,
      `I'm here to make your FIFA World Cup 2026 experience amazing! Ask me about anything — from finding your seat to the best way home after the match. What's on your mind?`,
      `Great question! Let me look into that for you. In the meantime, I can help with navigation, crowd updates, transport, accessibility, sustainability stats, or operations data. Which area interests you?`
    ]
  };

  // --- Core Functions ---

  function classifyIntent(query) {
    const q = query.toLowerCase();

    if (/gate|seat|section|row|where|find|navigate|direction|restroom|bathroom|toilet|food|eat|restaurant|first\s*aid|medical|exit|entrance|lost|atm|parking/i.test(q)) {
      return 'navigation';
    }
    if (/crowd|busy|congestion|density|queue|wait|capacity|packed|empty|heatmap/i.test(q)) {
      return 'crowd';
    }
    if (/transport|metro|subway|train|bus|shuttle|taxi|uber|lyft|rideshare|drive|parking|car|how.*get.*home|leave/i.test(q)) {
      return 'transport';
    }
    if (/accessib|wheelchair|disability|blind|deaf|sensory|hearing|vision|ramp|elevator|assistance dog/i.test(q)) {
      return 'accessibility';
    }
    if (/sustain|carbon|green|eco|recycle|environment|waste|energy|footprint|renewable/i.test(q)) {
      return 'sustainability';
    }
    if (/staff|steward|volunteer|operation|deploy|incident|security|alert|resource|shift|metric/i.test(q)) {
      return 'operations';
    }
    if (/wifi|water|schedule|match|game|play|kickoff|weather|temperature/i.test(q)) {
      return 'general';
    }

    return 'fallback';
  }

  function generateResponse(query, language = 'en') {
    const intent = classifyIntent(query);
    let response = null;

    if (intent === 'fallback') {
      const fallbacks = responseTemplates.fallback;
      response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    } else {
      const templates = responseTemplates[intent];
      if (templates) {
        for (const template of templates) {
          const result = typeof template === 'function' ? template(query) : template;
          if (result) {
            response = result;
            break;
          }
        }
      }
      if (!response) {
        const fallbacks = responseTemplates.fallback;
        response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
    }

    // Add language note if not English
    if (language !== 'en') {
      const langNames = {
        es: 'Spanish', fr: 'French', ar: 'Arabic', pt: 'Portuguese',
        de: 'German', ja: 'Japanese', zh: 'Chinese', hi: 'Hindi', ko: 'Korean'
      };
      response += `\n\n---\n_Response generated in English. In production, this would be automatically translated to ${langNames[language] || language} using Gemini's multilingual capabilities._`;
    }

    return response;
  }

  function getGreeting(language = 'en') {
    return multilingualGreetings[language] || multilingualGreetings.en;
  }

  function getQuickSuggestions(section = 'home') {
    const suggestions = {
      home: ['Where is Gate A?', "What's the match schedule?", 'Best way home?', 'Find food nearby'],
      navigation: ['Where are the restrooms?', 'Find my seat in Section B3', 'Nearest first aid?', 'Where is Gate D?'],
      crowd: ['How crowded is it now?', 'Best exit to avoid crowds?', 'Queue time at Gate C?', 'Predict halftime rush'],
      transport: ['Best route home?', 'Metro schedule', 'Where is rideshare pickup?', 'Shuttle bus times'],
      accessibility: ['Wheelchair accessible routes?', 'Where is the sensory room?', 'Audio description available?', 'Elevator locations'],
      sustainability: ['My carbon footprint?', 'Where to recycle?', 'Water refill stations?', 'Eco tips for today'],
      operations: ['Current staffing levels?', 'Active alerts?', 'Queue status all gates?', 'Resource utilization']
    };
    return suggestions[section] || suggestions.home;
  }

  // --- Public API ---
  return {
    generateResponse,
    getGreeting,
    getQuickSuggestions,
    classifyIntent,
    stadiumInfo
  };

})();
