// FoliageStride AI — Scenic Autumn Run & Park Route Explorer
// Open-source AI Route Builder powered by Google Gemma 2 & Offline Fallback Engine

(function() {
  'use strict';

  // --- State ---
  const state = {
    distance: '5km',
    scenery: 'maple-canopy',
    vibe: 'zone2',
    modelEndpoint: localStorage.getItem('foliage_ollama_endpoint') || 'http://localhost:11434/api/generate',
    modelName: localStorage.getItem('foliage_model_name') || 'gemma2:2b',
    activeTab: 'tab-route',
    stopwatchInterval: null,
    stopwatchSeconds: 0,
    isStopwatchRunning: false,
    audioCtx: null,
    routesDatabase: {
      '2km': {
        'maple-canopy': {
          title: 'The Golden Canopy 2K Dash',
          elevationGain: '+16m Easy Stride',
          summary: 'A sheltered 2.1 km loop under scarlet sugar maples and red oaks. Designed for a crisp morning reset with zero road intersections.',
          pacing: 'Zone 2 breathing. Step lightly onto fallen leaf carpets. Take in the amber canopy filter above.',
          waypoints: [
            { km: '0.0 km', title: 'South Meadow Trailhead', desc: 'Step off pavement onto the woodchip path under arching sugar maples.', cue: 'Big weathered trail kiosk' },
            { km: '0.7 km', title: 'The Century Red Oak Grove', desc: 'Dense canopy creates a natural golden stained-glass ceiling overhead.', cue: 'Massive twin-trunk oak tree' },
            { km: '1.4 km', title: 'Amber Fern Clearing', desc: 'Cider-colored bracken ferns line the singletrack trail.', cue: 'Rustic cedar footbridge' },
            { km: '2.1 km', title: 'Pavilion Loop Finish', desc: 'Glide into the grassy park perimeter to cool down and stretch.', cue: 'Stone pavilion arch' }
          ],
          svgPath: 'M 0,90 Q 70,65 150,80 T 300,55 T 420,85 L 500,80'
        },
        'riverbank': {
          title: 'Reflective River 2K Sprinter',
          elevationGain: '+8m Flat Glider',
          summary: 'A mirror-like waterfront path where morning autumn fog meets calm river ripples.',
          pacing: 'Steady, rhythm-focused cadence. Match your footsteps to the rhythmic river lap.',
          waypoints: [
            { km: '0.0 km', title: 'Boathouse Pier Start', desc: 'Begin along the tranquil boardwalk overlooking drifting fall leaves.', cue: 'Green canoe rack' },
            { km: '0.8 km', title: 'Weeping Willow Shore', desc: 'Golden willow branches dip directly into the glassy autumn water.', cue: 'Overhanging willow boughs' },
            { km: '1.5 km', title: 'Heron Creek Crossing', desc: 'Spot blue herons wading among orange cattails in the shallows.', cue: 'Arched timber bridge' },
            { km: '2.0 km', title: 'Rippling Point Turnaround', desc: 'Smooth return loop with panoramic river reflections.', cue: 'Granite boundary stone' }
          ],
          svgPath: 'M 0,95 Q 120,92 240,94 T 380,90 L 500,95'
        },
        'park-perimeter': {
          title: 'Historic Park Elm 2K Stride',
          elevationGain: '+12m Rolling Lawn',
          summary: 'Wide manicured turf borders and ancient American elm trees with safe footing.',
          pacing: 'Gentle conversational cadence. Relax shoulders and absorb open horizon vistas.',
          waypoints: [
            { km: '0.0 km', title: 'Memorial Gate', desc: 'Enter through wrought-iron gates flanked by yellow ginkgo trees.', cue: 'Historic cast-iron arch' },
            { km: '0.6 km', title: 'The Great Lawn Curve', desc: 'Soft grassy verge running alongside fallen yellow elm foliage.', cue: 'Vintage bronze sun dial' },
            { km: '1.3 km', title: 'Rose Garden Pergola', desc: 'Autumn hips and fiery ivy vines climbing ancient stone pillars.', cue: 'White timber trellis' },
            { km: '2.0 km', title: 'Fountain Circle Finish', desc: 'Finish with a gentle stroll around the dormant limestone basin.', cue: 'Central stone fountain' }
          ],
          svgPath: 'M 0,90 Q 150,75 300,85 T 500,90'
        },
        'hilltop-ridge': {
          title: 'Crest View 2K Hill Climb',
          elevationGain: '+48m Punchy Ascent',
          summary: 'A short, punchy cardiovascular power route climbing up to the scenic city & forest overlook.',
          pacing: 'High-knees cadence uphill; float light on midfoot during the descent.',
          waypoints: [
            { km: '0.0 km', title: 'Base Trailhead', desc: 'Immediate steady climb through crisp mountain beech trees.', cue: 'Timber trail post #1' },
            { km: '0.6 km', title: 'Switchback One (The Pines)', desc: 'Sharp hairpin turn shaded by fragrant evergreen needles and red sumac.', cue: 'Granite boulder marker' },
            { km: '1.1 km', title: 'Summit Panoramic Ridge', desc: '360-degree vista of the entire autumn foliage valley blanket.', cue: 'Observation viewing telescope' },
            { km: '2.0 km', title: 'Forest Descent Finish', desc: 'Careful downhill trot through golden larch needles.', cue: 'Base picnic table shelter' }
          ],
          svgPath: 'M 0,105 Q 150,30 250,25 T 400,60 L 500,105'
        }
      },
      '5km': {
        'maple-canopy': {
          title: 'The Golden Maple & Riverbank Loop',
          elevationGain: '+38m Smooth Roll',
          summary: 'A 5.0 km scenic staple minimizing traffic crossings and maximizing radiant orange and scarlet canopy cover.',
          pacing: 'Maintain a 3:3 stride-to-breath cadence. Tune in to the acoustic crunch of fallen leaves.',
          waypoints: [
            { km: '0.0 km', title: 'Park Commons Trailhead', desc: 'Warm up through the boulevard of flame-red October Glory red maples.', cue: 'Information map kiosk' },
            { km: '1.4 km', title: 'Deep Oak Ravine', desc: 'Descend slightly into a cool ravine carpeted in deep bronze pin oak leaves.', cue: 'Wooden stairs handrail' },
            { km: '3.1 km', title: 'Riverbend Footpath', desc: 'Wide crushed limestone trail flanked by glowing yellow birch groves.', cue: 'River mile marker #3' },
            { km: '4.2 km', title: 'Sunny Meadow Ascent', desc: 'Gentle incline through warm autumn sunshine and swaying goldenrod.', cue: 'Old stone farm wall' },
            { km: '5.0 km', title: 'Commons Pavilion Finish', desc: 'Final 200m sprint into the open grass plaza for recovery hydration.', cue: 'Finish banner arch' }
          ],
          svgPath: 'M 0,90 Q 70,60 150,75 T 300,45 T 420,80 L 500,70'
        },
        'riverbank': {
          title: 'The Autumn Waterfront 5K Promenade',
          elevationGain: '+14m Fast & Flat',
          summary: 'Pristine riparian trail tracing the winding river bend with cool water breezes and golden reeds.',
          pacing: 'Metronomic, relaxed tempo rhythm. Look up and admire waterfowl migrating south overhead.',
          waypoints: [
            { km: '0.0 km', title: 'River Mile 0 Pier', desc: 'Start on timber planks before transitioning onto riverside pea gravel.', cue: 'Historic lighthouse beacon' },
            { km: '1.6 km', title: 'Osprey Nest Marsh', desc: 'Open marshlands glowing in amber reeds and cattails against dark blue water.', cue: 'Wildlife blind platform' },
            { km: '3.0 km', title: 'Old Rail Suspension Bridge', desc: 'Cross high above the river gorge with vibrant cliffside foliage in view.', cue: 'Steel suspension cables' },
            { km: '4.1 km', title: 'Sycamore Esplanade', desc: 'Pavements shaded by giant mottled white-and-tan sycamore trunks.', cue: 'Riverside bistro benches' },
            { km: '5.0 km', title: 'Harbor Finish Plaza', desc: 'Expansive open dock with sea breeze and cool hydration stations.', cue: 'Flagpole plaza' }
          ],
          svgPath: 'M 0,92 Q 130,86 260,95 T 420,88 L 500,92'
        },
        'park-perimeter': {
          title: 'Grand Park Botanical 5K Loop',
          elevationGain: '+28m Rolling Hills',
          summary: 'Circles the botanical arboretum and historic heritage tree collection in full seasonal color.',
          pacing: 'Zone 2 steady aerobic endurance. Enjoy the crisp autumn scent of pine and eucalyptus.',
          waypoints: [
            { km: '0.0 km', title: 'Arboretum Gate Entrance', desc: 'Begin beneath the arch of yellow tulip trees and dawn redwoods.', cue: 'Stone pillars with lanterns' },
            { km: '1.5 km', title: 'Japanese Maple Garden', desc: 'Vibrant crimson and burgundy laceleaf maples around koi ponds.', cue: 'Red lacquer footbridge' },
            { km: '3.2 km', title: 'Heritage Conifer Hill', desc: 'Contrasting deep emerald evergreens surrounded by golden deciduous trees.', cue: 'Giant redwood marker' },
            { km: '4.3 km', title: 'Conservatory Lawn', desc: 'Expansive open grass with view of Victorian glass domes.', cue: 'Victorian glasshouse dome' },
            { km: '5.0 km', title: 'Main Gate Loop Return', desc: 'Complete the loop with easy dynamic cool-down stretching on grass.', cue: 'Wrought-iron entry gates' }
          ],
          svgPath: 'M 0,85 Q 100,65 200,80 T 350,55 T 450,75 L 500,85'
        },
        'hilltop-ridge': {
          title: 'Autumn Ridge Overlook 5K Challenge',
          elevationGain: '+74m Vigorous Grade',
          summary: 'Takes runners along the elevated ridge line with panoramic foliage valley vistas and crisp mountain air.',
          pacing: 'Rhythmic breath climbing; open your stride on the scenic ridgeline plateau.',
          waypoints: [
            { km: '0.0 km', title: 'Lower Valley Trailhead', desc: 'Crisp shade under hemlocks as the trail begins its steady upward slope.', cue: 'Wooden footbridge #1' },
            { km: '1.8 km', title: 'Eagle Rock Panorama', desc: 'First major plateau offering breathtaking vistas of the orange valley.', cue: 'Rocky outcrop viewpoint' },
            { km: '3.2 km', title: 'Pine Needle Spine', desc: 'Spongy, soft trail surface traversing along the high eastern ridge.', cue: 'Blazed pine trunk' },
            { km: '4.2 km', title: 'Sunset Ledge Switchbacks', desc: 'Sweeping descending turns flanked by golden aspen trees.', cue: 'Handcrafted timber rail' },
            { km: '5.0 km', title: 'Valley Base Finish', desc: 'Smooth flat sprint back to the vehicle parking and fresh water pump.', cue: 'Trailhead information board' }
          ],
          svgPath: 'M 0,110 Q 90,60 180,30 T 320,35 T 420,70 L 500,105'
        }
      },
      '8km': {
        'maple-canopy': {
          title: 'The Great Forest & Valley 8K Expedition',
          elevationGain: '+62m Rolling Terrain',
          summary: 'An extended trail expedition traversing 3 distinct forest ecosystems in peak autumn transition.',
          pacing: 'Comfortable marathon-training tempo. Focus on relaxed arms and rhythmic breathing.',
          waypoints: [
            { km: '0.0 km', title: 'Forest Preserve Gate', desc: 'Begin in dense mature woodland under ancient sugar maples.', cue: 'Carved wooden entry sign' },
            { km: '2.2 km', title: 'Hickory Nut Ridge', desc: 'Crisp breeze on the ridge as golden hickory leaves rustle overhead.', cue: 'Stone trail marker #4' },
            { km: '4.5 km', title: 'Mill Stream Creek Trail', desc: 'Follow the winding gravel bank beside crystalline autumn waters.', cue: 'Historical mill waterwheel' },
            { km: '6.4 km', title: 'Birch Grove Cathedral', desc: 'Pure white birch bark contrasting with blazing amber canopies.', cue: 'Timber boardwalk section' },
            { km: '8.0 km', title: 'Preserve Center Finish', desc: 'Return to start for post-run hydration and full-body cool-down.', cue: 'Preserve nature center' }
          ],
          svgPath: 'M 0,85 Q 90,50 180,70 T 300,40 T 420,65 L 500,85'
        },
        'riverbank': {
          title: 'Grand River & Canal 8K Circuit',
          elevationGain: '+22m Continuous Pace',
          summary: 'Connects the historic canal towpath and riverbank loop for an uninterrupted long endurance stride.',
          pacing: 'Steady sustained aerobic pace. Perfect for zone 2 endurance or negative-split training.',
          waypoints: [
            { km: '0.0 km', title: 'Lock #1 Trailhead', desc: 'Wide crushed-stone canal path alongside slow-moving reflective waters.', cue: 'Canal gate mechanism' },
            { km: '2.5 km', title: 'The Heron Marsh Loop', desc: 'Expansive wetlands teeming with fall migratory birds and golden reeds.', cue: 'Wooden viewing platform' },
            { km: '5.0 km', title: 'Twin Bridges Crossing', desc: 'Cross from the canal towpath over to the wooded river trail.', cue: 'Twin iron trestle bridges' },
            { km: '6.8 km', title: 'Sycamore River Esplanade', desc: 'Towering sycamore canopies providing canopy shelter.', cue: 'Mile marker 7 post' },
            { km: '8.0 km', title: 'Lock #1 Plaza Finish', desc: 'Finish on soft turf lawn alongside the historical canal basin.', cue: 'Stone basin lock' }
          ],
          svgPath: 'M 0,95 Q 120,90 250,92 T 390,88 L 500,95'
        },
        'park-perimeter': {
          title: 'Metropolitan Greenway 8K Link',
          elevationGain: '+44m Varied Scenery',
          summary: 'Interconnects 4 contiguous city parks and scenic foliage parkways completely off high-speed roads.',
          pacing: 'Consistent tempo. Focus on mindful running posture and rhythmic foot strikes.',
          waypoints: [
            { km: '0.0 km', title: 'North Commons Arch', desc: 'Start beneath grand bronze lamp posts and red maple allées.', cue: 'Granite archway' },
            { km: '2.3 km', title: 'Civic Rose & Sculpture Garden', desc: 'Modern outdoor sculptures set against flame-colored foliage.', cue: 'Bronze runner statue' },
            { km: '4.8 km', title: 'Highland Reservoir Rim', desc: 'Circumnavigate the wide water reservoir with city skyline and foliage reflections.', cue: 'Reservoir stone parapet' },
            { km: '6.7 km', title: 'The Meadow Singletrack', desc: 'Soft dirt trail through prairie grasses swaying in the autumn wind.', cue: 'Prairie restoration sign' },
            { km: '8.0 km', title: 'Commons Return Finish', desc: 'Full circle arrival at the main park pavilion for recovery.', cue: 'Main pavilion colonnade' }
          ],
          svgPath: 'M 0,80 Q 80,60 170,85 T 320,50 T 430,75 L 500,80'
        },
        'hilltop-ridge': {
          title: 'High Peak Foliage 8K Mountain Run',
          elevationGain: '+115m Steep Ascent',
          summary: 'Serious vertical elevation gain reaching the highest crest in the regional park with breathtaking color tiers.',
          pacing: 'Power-hike steep sections if needed; maintain high cadence and deep abdominal breaths.',
          waypoints: [
            { km: '0.0 km', title: 'Mountain Base Trailhead', desc: 'Enter the deep evergreen and beech forest as the grade kicks up.', cue: 'Trail safety sign' },
            { km: '2.4 km', title: 'Lookout Switchback #3', desc: 'First panoramic overlook of rolling hills painted in yellow and rust.', cue: 'Wooden bench overlook' },
            { km: '4.6 km', title: 'The Crown Summit Ridge', desc: 'Highest point on the course with 360-degree vistas of the horizon.', cue: 'Geodetic survey monument' },
            { km: '6.5 km', title: 'Golden Larch Canyon', desc: 'Gentle winding descent through luminous needle-shedding larches.', cue: 'Timber bridge over brook' },
            { km: '8.0 km', title: 'Base Camp Finish', desc: 'Level finish sprint across the meadow trailhead lawn.', cue: 'Base ranger station' }
          ],
          svgPath: 'M 0,115 Q 100,50 200,20 T 340,30 T 440,75 L 500,110'
        }
      }
    },
    journalEntries: JSON.parse(localStorage.getItem('foliage_journal_entries') || '[]')
  };

  // Pre-seed 1 entry if completely empty for immediate demonstration
  if (state.journalEntries.length === 0) {
    state.journalEntries.push({
      id: Date.now() - 86400000,
      date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      routeTitle: 'The Golden Maple & Riverbank Loop',
      distance: '5.0 km',
      duration: '27:42',
      notes: 'Crisp 12°C morning air. The maples on Oak Avenue were in peak fiery red. Kept the phone inside my running belt the whole time!'
    });
    localStorage.setItem('foliage_journal_entries', JSON.stringify(state.journalEntries));
  }

  // --- DOM Elements ---
  const distanceGrid = document.getElementById('distanceGrid');
  const sceneryPills = document.getElementById('sceneryPills');
  const vibeChips = document.getElementById('vibeChips');
  const btnGenerateRoute = document.getElementById('btnGenerateRoute');
  const genSpinner = document.getElementById('genSpinner');
  const genBtnText = document.getElementById('genBtnText');

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const distBadge = document.getElementById('distBadge');
  const sceneryBadge = document.getElementById('sceneryBadge');
  const aiBadge = document.getElementById('aiBadge');
  const routeTitle = document.getElementById('routeTitle');
  const routeSummary = document.getElementById('routeSummary');
  const elevationGain = document.getElementById('elevationGain');
  const pacingBody = document.getElementById('pacingBody');
  const elevationSvg = document.querySelector('.elevation-svg');
  const waypointsList = document.getElementById('waypointsList');

  const runStopwatch = document.getElementById('runStopwatch');
  const btnToggleRun = document.getElementById('btnToggleRun');
  const btnFinishRun = document.getElementById('btnFinishRun');
  const runNotes = document.getElementById('runNotes');
  const btnSaveRunLog = document.getElementById('btnSaveRunLog');
  const runJournalFeed = document.getElementById('runJournalFeed');
  const runLogCount = document.getElementById('runLogCount');
  const runStreakNum = document.getElementById('runStreakNum');

  const btnModelSettings = document.getElementById('btnModelSettings');
  const modelModal = document.getElementById('modelModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnSaveModal = document.getElementById('btnSaveModal');
  const ollamaEndpointInput = document.getElementById('ollamaEndpoint');
  const modelNameSelect = document.getElementById('modelName');
  const btnTestOllama = document.getElementById('btnTestOllama');
  const testResult = document.getElementById('testResult');
  const aiStatusText = document.getElementById('aiStatusText');
  const btnExportLog = document.getElementById('btnExportLog');

  // --- Sound Synthesizer for Phone Pocket Splits ---
  function playCadenceChime(type) {
    try {
      if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = state.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'split') {
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'finish') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        osc.frequency.setValueAtTime(783.99, now + 0.3);
        osc.frequency.setValueAtTime(1046.50, now + 0.45);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {
      console.warn('Audio chime unsupported or blocked:', e);
    }
  }

  // --- Render Route Data ---
  function renderActiveRoute(routeData, distanceKey, sceneryKey) {
    distBadge.textContent = `🏃 ${distanceKey.toUpperCase()}`;
    
    const sceneryLabels = {
      'maple-canopy': '🍁 Maple Canopy',
      'riverbank': '🌊 Riverbank',
      'park-perimeter': '🌳 Park Perimeter',
      'hilltop-ridge': '⛰️ Hilltop Ridge'
    };
    sceneryBadge.textContent = sceneryLabels[sceneryKey] || '🍁 Scenic Loop';
    aiBadge.textContent = state.modelName === 'heuristic' ? '⚡ Native Fallback' : `🧠 ${state.modelName.toUpperCase()} Synthesized`;

    routeTitle.textContent = routeData.title;
    routeSummary.textContent = routeData.summary;
    elevationGain.textContent = `↗️ ${routeData.elevationGain}`;
    pacingBody.textContent = routeData.pacing;

    // Render Elevation SVG Profile
    if (elevationSvg && routeData.svgPath) {
      const paths = elevationSvg.querySelectorAll('path');
      if (paths.length >= 2) {
        // Area path
        paths[0].setAttribute('d', `${routeData.svgPath} L 500,120 L 0,120 Z`);
        // Stroke path
        paths[1].setAttribute('d', routeData.svgPath);
      }
    }

    // Render Turn-by-Turn Waypoints
    waypointsList.innerHTML = '';
    routeData.waypoints.forEach((wp, idx) => {
      const card = document.createElement('div');
      card.className = 'waypoint-item';
      card.innerHTML = `
        <div class="waypoint-num">${idx + 1}</div>
        <div class="waypoint-content">
          <h4>${wp.title}</h4>
          <p>${wp.desc}</p>
          <div class="waypoint-meta">
            <span>📍 Split: ${wp.km}</span>
            <span>👁️ Visual Landmark: <strong>${wp.cue}</strong></span>
          </div>
        </div>
      `;
      waypointsList.appendChild(card);
    });
  }

  // --- Route Synthesis (Local Gemma 2 Ollama + Heuristic Engine) ---
  async function generateRoute() {
    genSpinner.classList.remove('hidden');
    genBtnText.textContent = 'Synthesizing with Gemma 2...';
    btnGenerateRoute.disabled = true;

    const baseData = state.routesDatabase[state.distance][state.scenery];
    let synthesizedRoute = { ...baseData };

    if (state.modelName !== 'heuristic') {
      try {
        const prompt = `You are FoliageStride AI, an expert outdoor running coach and scenic trail architect.
Create a scenic outdoor running route for a runner who wants to get off screens and experience fall foliage.
Parameters:
Distance: ${state.distance}
Scenery: ${state.scenery}
Vibe/Pacing: ${state.vibe}

Respond strictly in valid JSON format matching this schema:
{
  "title": "Inspiring Autumn Route Name",
  "elevationGain": "+XXm Terrain Description",
  "summary": "2 sentences describing why this route avoids screens and celebrates nature.",
  "pacing": "Sensory and breathwork cue (e.g. cadence, crunch of leaves, posture).",
  "waypoints": [
    {"km": "0.0 km", "title": "Start Landmark", "desc": "Sensory visual checkpoint", "cue": "Look for this physical item"},
    {"km": "split km", "title": "Midpoint Landmark", "desc": "Sensory visual checkpoint", "cue": "Look for this physical item"},
    {"km": "finish km", "title": "Finish Landmark", "desc": "Sensory visual checkpoint", "cue": "Look for this physical item"}
  ]
}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec graceful timeout for local daemon

        const res = await fetch(state.modelEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: state.modelName,
            prompt: prompt,
            stream: false,
            format: 'json'
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          const parsed = JSON.parse(json.response);
          if (parsed.title && parsed.waypoints) {
            synthesizedRoute = {
              ...baseData,
              title: parsed.title,
              elevationGain: parsed.elevationGain || baseData.elevationGain,
              summary: parsed.summary || baseData.summary,
              pacing: parsed.pacing || baseData.pacing,
              waypoints: parsed.waypoints.length ? parsed.waypoints : baseData.waypoints
            };
            aiStatusText.textContent = `${state.modelName} Active`;
          }
        }
      } catch (err) {
        console.warn('Ollama unavailable or timed out; falling back to high-fidelity offline engine:', err.message);
        aiStatusText.textContent = 'Gemma Heuristics (Offline)';
      }
    }

    setTimeout(() => {
      renderActiveRoute(synthesizedRoute, state.distance, state.scenery);
      genSpinner.classList.add('hidden');
      genBtnText.textContent = 'Synthesize Scenic Route';
      btnGenerateRoute.disabled = false;
      playCadenceChime('split');
    }, 450);
  }

  // --- Pocket Stopwatch Timer ---
  function formatStopwatch(sec) {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function toggleStopwatch() {
    if (!state.isStopwatchRunning) {
      state.isStopwatchRunning = true;
      btnToggleRun.textContent = 'Pause';
      btnToggleRun.classList.remove('btn-ghost');
      btnToggleRun.classList.add('btn-emerald');
      playCadenceChime('start');

      state.stopwatchInterval = setInterval(() => {
        state.stopwatchSeconds++;
        runStopwatch.textContent = formatStopwatch(state.stopwatchSeconds);

        // Every 5 minutes (300 sec), simulate a split chime so runner knows checkpoint without looking!
        if (state.stopwatchSeconds > 0 && state.stopwatchSeconds % 300 === 0) {
          playCadenceChime('split');
        }
      }, 1000);
    } else {
      state.isStopwatchRunning = false;
      btnToggleRun.textContent = 'Resume';
      btnToggleRun.classList.remove('btn-emerald');
      btnToggleRun.classList.add('btn-ghost');
      clearInterval(state.stopwatchInterval);
    }
  }

  function finishRun() {
    if (state.stopwatchSeconds === 0) {
      alert('Start your run timer first before finishing!');
      return;
    }

    state.isStopwatchRunning = false;
    clearInterval(state.stopwatchInterval);
    btnToggleRun.textContent = 'Start Run';
    btnToggleRun.classList.remove('btn-emerald');
    btnToggleRun.classList.add('btn-ghost');

    const totalTime = formatStopwatch(state.stopwatchSeconds);
    playCadenceChime('finish');

    // Prompt user to log notes
    runNotes.value = `Completed ${state.distance} on "${routeTitle.textContent}" in ${totalTime}. Foliage was stunning!`;
    runNotes.focus();

    // Reset stopwatch counter
    state.stopwatchSeconds = 0;
    runStopwatch.textContent = '00:00';
  }

  // --- Journal & Streak Management ---
  function renderJournal() {
    runLogCount.textContent = state.journalEntries.length;
    runStreakNum.textContent = state.journalEntries.length;

    runJournalFeed.innerHTML = '';
    if (state.journalEntries.length === 0) {
      runJournalFeed.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding:20px;">No runs recorded yet. Lace up and touch grass!</p>';
      return;
    }

    state.journalEntries.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'journal-card';
      card.innerHTML = `
        <div class="journal-top">
          <span>📅 ${entry.date} &bull; ⏱️ ${entry.duration}</span>
          <span style="color:var(--accent-orange); font-weight:700;">${entry.distance}</span>
        </div>
        <div class="journal-body">
          <strong>${entry.routeTitle}</strong>: ${entry.notes}
        </div>
        <div class="journal-tags">
          <span class="j-tag">🍂 Foliage Run</span>
          <span class="j-tag">📵 0 Screen Time</span>
          <span class="j-tag">🌿 Touched Grass</span>
        </div>
      `;
      runJournalFeed.appendChild(card);
    });
  }

  function saveRunLog() {
    const notes = runNotes.value.trim();
    if (!notes) {
      alert('Please add a brief note about your outdoor run before saving.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      routeTitle: routeTitle.textContent,
      distance: distBadge.textContent.replace('🏃 ', ''),
      duration: 'Finished',
      notes: notes
    };

    state.journalEntries.unshift(newEntry);
    localStorage.setItem('foliage_journal_entries', JSON.stringify(state.journalEntries));
    renderJournal();
    runNotes.value = '';

    // Switch to journal tab
    switchTab('tab-journal');
    playCadenceChime('finish');
  }

  function exportLog() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.journalEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `foliagestride-run-log-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // --- Tab Navigation ---
  function switchTab(targetTabId) {
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === targetTabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  // --- Event Listeners Setup ---
  function setupEvents() {
    // Distance button selection
    distanceGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.choice-card');
      if (!card) return;
      distanceGrid.querySelectorAll('.choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.distance = card.getAttribute('data-dist');
      generateRoute();
    });

    // Scenery pills
    sceneryPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill-btn');
      if (!pill) return;
      sceneryPills.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.scenery = pill.getAttribute('data-scenery');
      generateRoute();
    });

    // Vibe chips
    vibeChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (!chip) return;
      vibeChips.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.vibe = chip.getAttribute('data-vibe');
      generateRoute();
    });

    // Tab buttons
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Generate Route Button
    btnGenerateRoute.addEventListener('click', generateRoute);

    // Stopwatch Controls
    btnToggleRun.addEventListener('click', toggleStopwatch);
    btnFinishRun.addEventListener('click', finishRun);
    btnSaveRunLog.addEventListener('click', saveRunLog);
    btnExportLog.addEventListener('click', exportLog);

    // Modal controls
    btnModelSettings.addEventListener('click', () => {
      ollamaEndpointInput.value = state.modelEndpoint;
      modelNameSelect.value = state.modelName;
      testResult.textContent = '';
      modelModal.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => {
      modelModal.classList.add('hidden');
    });

    btnSaveModal.addEventListener('click', () => {
      state.modelEndpoint = ollamaEndpointInput.value.trim();
      state.modelName = modelNameSelect.value;
      localStorage.setItem('foliage_ollama_endpoint', state.modelEndpoint);
      localStorage.setItem('foliage_model_name', state.modelName);
      aiStatusText.textContent = state.modelName === 'heuristic' ? 'Native Fallback Engine' : `${state.modelName} Configured`;
      modelModal.classList.add('hidden');
    });

    // Test connection
    btnTestOllama.addEventListener('click', async () => {
      testResult.textContent = 'Testing connection...';
      testResult.className = 'test-feedback';
      try {
        const res = await fetch(ollamaEndpointInput.value.trim().replace('/api/generate', '/api/tags'), { method: 'GET' });
        if (res.ok) {
          testResult.textContent = '✅ Connected to Ollama!';
          testResult.className = 'test-feedback ok';
        } else {
          testResult.textContent = '⚠️ Ollama replied with status ' + res.status;
          testResult.className = 'test-feedback err';
        }
      } catch (err) {
        testResult.textContent = '❌ Cannot reach endpoint (offline mode active)';
        testResult.className = 'test-feedback err';
      }
    });

    // Close modal on backdrop click
    modelModal.addEventListener('click', (e) => {
      if (e.target === modelModal) {
        modelModal.classList.add('hidden');
      }
    });
  }

  // --- Initial Boot ---
  function init() {
    setupEvents();
    renderJournal();
    // Render default route
    renderActiveRoute(state.routesDatabase[state.distance][state.scenery], state.distance, state.scenery);
  }

  init();
})();
