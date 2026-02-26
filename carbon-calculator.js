/* Carbon Footprint Calculator – One-question-at-a-time quiz
   Inspired by footprintcalculator.org design */

document.addEventListener('DOMContentLoaded', function () {

    // ─── Question definitions ─────────────────────────────────────────────────
    const CATS = {
        transport: { icon: '🚗', label: 'Transport' },
        home:      { icon: '🏠', label: 'Home' },
        food:      { icon: '🍽️', label: 'Food' },
        waste:     { icon: '♻️',  label: 'Waste' },
        lifestyle: { icon: '🛍️', label: 'Lifestyle' },
    };

    const QS = [
        // ── Transport ─────────────────────────────────────────────────────────
        {
            id: 'commuteMode', cat: 'transport', type: 'cards',
            q: 'How do you primarily get to work or school?',
            opts: [
                { v: 'car-alone',      icon: '🚗', label: 'Drive Alone' },
                { v: 'car-carpool',    icon: '🤝', label: 'Carpool' },
                { v: 'electric-car',   icon: '⚡', label: 'Electric Car' },
                { v: 'public-transit', icon: '🚇', label: 'Public Transit' },
                { v: 'motorcycle',     icon: '🏍️', label: 'Motorcycle' },
                { v: 'bike',           icon: '🚲', label: 'Bike' },
                { v: 'walk',           icon: '🚶', label: 'Walk' },
                { v: 'remote',         icon: '💻', label: 'Work from Home' },
            ],
        },
        {
            id: 'commuteDistance', cat: 'transport', type: 'number',
            q: 'How far is your one-way commute?',
            unit: 'miles', placeholder: '10', min: 0, def: 10,
            hint: 'Enter 0 if you work from home.',
        },
        {
            id: 'carMileage', cat: 'transport', type: 'number',
            q: "What is your car's fuel efficiency?",
            unit: 'MPG', placeholder: '28', min: 1, def: 28,
            hint: "US average is ~28 MPG. Leave at default if you don't drive.",
        },
        {
            id: 'numVehicles', cat: 'transport', type: 'cards',
            q: 'How many vehicles does your household own?',
            opts: [
                { v: '0', icon: '🚫', label: 'None' },
                { v: '1', icon: '1️⃣', label: 'One' },
                { v: '2', icon: '2️⃣', label: 'Two' },
                { v: '3', icon: '3️⃣', label: 'Three+' },
            ],
        },
        {
            id: 'weekendDriving', cat: 'transport', type: 'number',
            q: 'How many miles do you drive for errands or recreation each week?',
            unit: 'miles / week', placeholder: '30', min: 0, def: 30,
            hint: 'Includes shopping runs, road trips, visiting friends, etc.',
        },
        {
            id: 'flightShort', cat: 'transport', type: 'number',
            q: 'How many short-haul flights (under 3 hours) do you take per year?',
            unit: 'flights / year', placeholder: '2', min: 0, def: 0,
            hint: 'Count each leg separately – a round trip = 2 flights.',
        },
        {
            id: 'flightLong', cat: 'transport', type: 'number',
            q: 'How many long-haul flights (over 3 hours) do you take per year?',
            unit: 'flights / year', placeholder: '1', min: 0, def: 0,
            hint: 'International or cross-country trips.',
        },
        // ── Home ──────────────────────────────────────────────────────────────
        {
            id: 'homeSize', cat: 'home', type: 'cards',
            q: 'How big is your home?',
            opts: [
                { v: 'small',  icon: '🏡', label: 'Small',  sub: 'Under 1,000 sq ft' },
                { v: 'medium', icon: '🏠', label: 'Medium', sub: '1,000 – 2,000 sq ft' },
                { v: 'large',  icon: '🏰', label: 'Large',  sub: 'Over 2,000 sq ft' },
            ],
        },
        {
            id: 'householdSize', cat: 'home', type: 'number',
            q: 'How many people live in your household?',
            unit: 'people', placeholder: '3', min: 1, max: 20, def: 3,
            hint: 'Sharing space with others reduces your per-person footprint.',
        },
        {
            id: 'heating', cat: 'home', type: 'cards',
            q: 'What is your primary heating source?',
            opts: [
                { v: 'natural-gas', icon: '🔥', label: 'Natural Gas' },
                { v: 'electric',    icon: '⚡', label: 'Electric Heat' },
                { v: 'oil',         icon: '🛢️', label: 'Heating Oil' },
                { v: 'heat-pump',   icon: '💨', label: 'Heat Pump' },
                { v: 'other',       icon: '🌿', label: 'Other / None' },
            ],
        },
        {
            id: 'airConditioning', cat: 'home', type: 'cards',
            q: 'Do you have air conditioning?',
            opts: [
                { v: 'none',    icon: '❄️', label: 'No AC' },
                { v: 'window',  icon: '🪟', label: 'Window Unit' },
                { v: 'central', icon: '🌬️', label: 'Central AC' },
            ],
        },
        {
            id: 'homeInsulation', cat: 'home', type: 'cards',
            q: 'How well insulated is your home?',
            opts: [
                { v: 'well',    icon: '🏆', label: 'Well Insulated', sub: 'New or recently renovated' },
                { v: 'average', icon: '🏠', label: 'Average',        sub: 'Standard home' },
                { v: 'poor',    icon: '🥶', label: 'Poorly Insulated', sub: 'Drafty or old building' },
            ],
        },
        {
            id: 'hotWater', cat: 'home', type: 'cards',
            q: 'What type of water heater do you have?',
            opts: [
                { v: 'gas',       icon: '🔥', label: 'Gas' },
                { v: 'electric',  icon: '⚡', label: 'Electric' },
                { v: 'heat-pump', icon: '💧', label: 'Heat Pump' },
                { v: 'solar',     icon: '☀️', label: 'Solar' },
            ],
        },
        {
            id: 'solarPanels', cat: 'home', type: 'cards',
            q: 'Does your home have solar panels?',
            opts: [
                { v: 'yes', icon: '☀️', label: 'Yes' },
                { v: 'no',  icon: '❌', label: 'No' },
            ],
        },
        {
            id: 'greenEnergy', cat: 'home', type: 'cards',
            q: 'Do you purchase green or renewable energy from your utility?',
            opts: [
                { v: 'yes',     icon: '🌿', label: 'Yes, 100%' },
                { v: 'partial', icon: '⚡', label: 'Partially' },
                { v: 'no',      icon: '❌', label: 'No' },
            ],
        },
        {
            id: 'thermostat', cat: 'home', type: 'number',
            q: 'What do you set your thermostat to in winter?',
            unit: '°F', placeholder: '68', min: 50, max: 85, def: 68,
            hint: 'US average is 68°F. Every degree lower saves ~3% heating energy.',
        },
        {
            id: 'energyEfficient', cat: 'home', type: 'cards',
            q: 'Do you use LED light bulbs in your home?',
            opts: [
                { v: 'all',  icon: '💡', label: 'All fixtures' },
                { v: 'most', icon: '💡', label: 'Most fixtures' },
                { v: 'some', icon: '💡', label: 'Some fixtures' },
                { v: 'none', icon: '🕯️', label: 'None' },
            ],
        },
        // ── Food ──────────────────────────────────────────────────────────────
        {
            id: 'diet', cat: 'food', type: 'cards',
            q: 'Which best describes your diet?',
            opts: [
                { v: 'vegan',        icon: '🌱', label: 'Vegan' },
                { v: 'vegetarian',   icon: '🥦', label: 'Vegetarian' },
                { v: 'pescatarian',  icon: '🐟', label: 'Pescatarian' },
                { v: 'low-meat',     icon: '🥗', label: 'Low Meat' },
                { v: 'regular-meat', icon: '🍖', label: 'Regular Meat' },
                { v: 'high-meat',    icon: '🥩', label: 'High Meat' },
            ],
        },
        {
            id: 'beefFrequency', cat: 'food', type: 'cards',
            q: 'How often do you eat beef or lamb?',
            opts: [
                { v: 'daily',   icon: '🥩', label: 'Daily' },
                { v: 'weekly',  icon: '🍖', label: 'A few times / week' },
                { v: 'monthly', icon: '🥗', label: 'Monthly or less' },
                { v: 'never',   icon: '🌱', label: 'Never' },
            ],
        },
        {
            id: 'dairyConsumption', cat: 'food', type: 'cards',
            q: 'How much dairy do you consume?',
            sub: 'Milk, cheese, yogurt, butter, etc.',
            opts: [
                { v: 'high',     icon: '🥛', label: 'A lot' },
                { v: 'moderate', icon: '🧀', label: 'Moderate' },
                { v: 'low',      icon: '🌿', label: 'Little or none' },
            ],
        },
        {
            id: 'localFood', cat: 'food', type: 'cards',
            q: 'How often do you buy local or seasonal food?',
            opts: [
                { v: 'always',    icon: '🌾', label: 'Always' },
                { v: 'often',     icon: '🥕', label: 'Often' },
                { v: 'sometimes', icon: '🛒', label: 'Sometimes' },
                { v: 'rarely',    icon: '❓', label: 'Rarely' },
                { v: 'never',     icon: '🚫', label: 'Never' },
            ],
        },
        {
            id: 'foodWaste', cat: 'food', type: 'cards',
            q: 'How much of your food goes to waste?',
            opts: [
                { v: 'none',     icon: '♻️', label: 'Almost none' },
                { v: 'little',   icon: '🥦', label: 'A little' },
                { v: 'moderate', icon: '🗑️', label: 'Moderate' },
                { v: 'lot',      icon: '😔', label: 'A lot' },
            ],
        },
        {
            id: 'organicFood', cat: 'food', type: 'cards',
            q: 'How often do you buy organic food?',
            opts: [
                { v: 'always',    icon: '🌿', label: 'Always' },
                { v: 'often',     icon: '🥦', label: 'Often' },
                { v: 'sometimes', icon: '🛒', label: 'Sometimes' },
                { v: 'rarely',    icon: '❌', label: 'Rarely / Never' },
            ],
        },
        // ── Waste ─────────────────────────────────────────────────────────────
        {
            id: 'recycling', cat: 'waste', type: 'cards',
            q: 'How actively do you recycle?',
            opts: [
                { v: 'always',    icon: '♻️', label: 'Always' },
                { v: 'usually',   icon: '✅', label: 'Usually' },
                { v: 'sometimes', icon: '🤔', label: 'Sometimes' },
                { v: 'rarely',    icon: '❌', label: 'Rarely' },
                { v: 'never',     icon: '🚫', label: 'Never' },
            ],
        },
        {
            id: 'composting', cat: 'waste', type: 'cards',
            q: 'Do you compost organic waste?',
            opts: [
                { v: 'yes', icon: '🌱', label: 'Yes' },
                { v: 'no',  icon: '❌', label: 'No' },
            ],
        },
        {
            id: 'singleUsePlastic', cat: 'waste', type: 'cards',
            q: 'How often do you use single-use plastics?',
            sub: 'Plastic bags, bottles, straws, disposable cutlery, etc.',
            opts: [
                { v: 'never',     icon: '♻️', label: 'Never',      sub: 'I always use reusables' },
                { v: 'rarely',    icon: '🌿', label: 'Rarely' },
                { v: 'sometimes', icon: '🤔', label: 'Sometimes' },
                { v: 'often',     icon: '🛍️', label: 'Often' },
                { v: 'always',    icon: '🚫', label: 'Very Often' },
            ],
        },
        // ── Lifestyle ─────────────────────────────────────────────────────────
        {
            id: 'newClothes', cat: 'lifestyle', type: 'cards',
            q: 'How often do you buy new clothes?',
            opts: [
                { v: 'rarely',       icon: '👍', label: 'Rarely',       sub: 'A few times / year' },
                { v: 'occasionally', icon: '🛍️', label: 'Occasionally', sub: 'Monthly' },
                { v: 'often',        icon: '👗', label: 'Often',         sub: 'Weekly' },
            ],
        },
        {
            id: 'secondHand', cat: 'lifestyle', type: 'cards',
            q: 'Do you buy secondhand or thrifted items?',
            opts: [
                { v: 'always',    icon: '🏆', label: 'Almost Always' },
                { v: 'often',     icon: '✅', label: 'Often' },
                { v: 'sometimes', icon: '��', label: 'Sometimes' },
                { v: 'rarely',    icon: '❌', label: 'Rarely' },
                { v: 'never',     icon: '🚫', label: 'Never' },
            ],
        },
        {
            id: 'electronics', cat: 'lifestyle', type: 'cards',
            q: 'How often do you buy new electronics or gadgets?',
            opts: [
                { v: 'rarely',       icon: '♻️', label: 'Rarely',       sub: 'Only when needed' },
                { v: 'occasionally', icon: '📱', label: 'Occasionally', sub: 'Every 1–2 years' },
                { v: 'often',        icon: '💻', label: 'Often',         sub: 'Multiple per year' },
            ],
        },
        {
            id: 'streaming', cat: 'lifestyle', type: 'number',
            q: 'How many hours per day do you spend streaming video or gaming?',
            unit: 'hours / day', placeholder: '2', min: 0, max: 24, def: 2,
            hint: 'Data centres and devices have a real, if small, carbon footprint.',
        },
        {
            id: 'waterUsage', cat: 'lifestyle', type: 'cards',
            q: 'How would you describe your water usage?',
            opts: [
                { v: 'low',      icon: '💧', label: 'Very Conscious', sub: 'Short showers, taps off' },
                { v: 'moderate', icon: '🚿', label: 'Moderate' },
                { v: 'high',     icon: '🛁', label: 'High',           sub: 'Long showers / baths' },
            ],
        },
        {
            id: 'paperUsage', cat: 'lifestyle', type: 'cards',
            q: 'How much paper do you use day-to-day?',
            sub: 'Printing, paper towels, notebooks, etc.',
            opts: [
                { v: 'minimal',  icon: '📱', label: 'Minimal',  sub: 'Mostly digital' },
                { v: 'moderate', icon: '📄', label: 'Moderate' },
                { v: 'high',     icon: '📋', label: 'High',     sub: 'Print frequently' },
            ],
        },
    ]; // end QS

    // ─── State ────────────────────────────────────────────────────────────────
    let curQ      = 0;
    let answers   = {};
    let busy      = false;

    // ─── DOM refs ─────────────────────────────────────────────────────────────
    const calcHero    = document.getElementById('calcHero');
    const quizShell   = document.getElementById('quizShell');
    const resultsShell = document.getElementById('resultsShell');
    const startBtn    = document.getElementById('startQuizBtn');
    const questionArea = document.getElementById('questionArea');
    const backBtn     = document.getElementById('quizBackBtn');
    const progFill    = document.getElementById('quizProgFill');
    const stepLabel   = document.getElementById('quizStepLabel');
    const liveCounter = document.getElementById('liveCounter');
    const liveVal     = document.getElementById('liveVal');
    const catPills    = document.querySelectorAll('.cat-pill');
    const retakeBtn   = document.getElementById('retakeButton');

    // ─── Boot ────────────────────────────────────────────────────────────────
    if (startBtn) {
        startBtn.addEventListener('click', startQuiz);
    }
    if (retakeBtn) {
        retakeBtn.addEventListener('click', retake);
    }
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }

    function startQuiz() {
        calcHero.style.display = 'none';
        quizShell.style.display = 'block';
        curQ = 0;
        answers = {};
        renderQ(curQ, 'right');
        updateProgress();
        backBtn.style.visibility = 'hidden';
    }

    function retake() {
        resultsShell.style.display = 'none';
        quizShell.style.display = 'block';
        curQ = 0;
        answers = {};
        renderQ(curQ, 'right');
        updateProgress();
        backBtn.style.visibility = 'hidden';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ─── Render one question ──────────────────────────────────────────────────
    function renderQ(index, dir) {
        const q = QS[index];
        const old = questionArea.querySelector('.q-panel');

        // Slide old panel out
        if (old) {
            old.classList.add(dir === 'right' ? 'exit-left' : 'exit-right');
            setTimeout(() => old.remove(), 380);
        }

        // Build new panel
        const panel = document.createElement('div');
        panel.className = 'q-panel enter-' + dir;

        const catInfo = CATS[q.cat];
        let html = `
            <div class="q-cat-tag">${catInfo.icon} ${catInfo.label}</div>
            <div class="q-question">${q.q}</div>
            ${q.sub ? `<div class="q-sub">${q.sub}</div>` : ''}
        `;

        if (q.type === 'cards') {
            const cols = q.opts.length <= 2 ? 'g-2'
                       : q.opts.length === 3 ? 'g-3'
                       : q.opts.length === 4 ? 'g-4'
                       : 'g-auto';
            html += `<div class="q-cards-grid ${cols}">`;
            q.opts.forEach(opt => {
                const sel = answers[q.id] === opt.v ? ' selected' : '';
                html += `
                    <button type="button" class="q-card${sel}" data-val="${opt.v}">
                        <span class="q-card-icon">${opt.icon}</span>
                        <span class="q-card-label">${opt.label}</span>
                        ${opt.sub ? `<span class="q-card-sub">${opt.sub}</span>` : ''}
                    </button>`;
            });
            html += '</div>';
        } else {
            const val = answers[q.id] !== undefined ? answers[q.id] : q.def;
            html += `
                <div class="q-number-wrap">
                    <div class="q-number-row">
                        <input type="number" class="q-number-input" id="qInput"
                            value="${val !== undefined ? val : ''}"
                            placeholder="${q.placeholder}"
                            min="${q.min !== undefined ? q.min : 0}"
                            ${q.max !== undefined ? `max="${q.max}"` : ''}
                            step="1">
                        <span class="q-number-unit">${q.unit}</span>
                    </div>
                    ${q.hint ? `<div class="q-number-hint">${q.hint}</div>` : ''}
                    <button type="button" class="btn-quiz-continue" id="qContBtn">Continue →</button>
                </div>`;
        }

        panel.innerHTML = html;
        questionArea.appendChild(panel);

        // Wire up events
        if (q.type === 'cards') {
            panel.querySelectorAll('.q-card').forEach(card => {
                card.addEventListener('click', function () {
                    if (busy) return;
                    answers[q.id] = this.dataset.val;
                    panel.querySelectorAll('.q-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    updateLiveCounter();
                    busy = true;
                    setTimeout(() => { busy = false; advance(); }, 320);
                });
            });
        } else {
            const input = panel.querySelector('#qInput');
            const contBtn = panel.querySelector('#qContBtn');
            setTimeout(() => input && input.focus(), 50);
            const save = () => {
                if (busy) return;
                const v = parseFloat(input.value);
                answers[q.id] = isNaN(v) ? (q.def !== undefined ? q.def : 0)
                                          : Math.max(q.min || 0, v);
                updateLiveCounter();
                advance();
            };
            input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
            contBtn.addEventListener('click', save);
        }
    }

    // ─── Navigation ──────────────────────────────────────────────────────────
    function advance() {
        if (curQ >= QS.length - 1) { showResults(); return; }
        curQ++;
        renderQ(curQ, 'right');
        updateProgress();
        backBtn.style.visibility = curQ > 0 ? 'visible' : 'hidden';
    }

    function goBack() {
        if (curQ <= 0 || busy) return;
        curQ--;
        renderQ(curQ, 'left');
        updateProgress();
        backBtn.style.visibility = curQ > 0 ? 'visible' : 'hidden';
    }

    function updateProgress() {
        const pct = ((curQ + 1) / QS.length) * 100;
        progFill.style.width = pct + '%';
        stepLabel.textContent = (curQ + 1) + ' / ' + QS.length;

        const currentCat = QS[curQ].cat;
        const catOrder = Object.keys(CATS);
        catPills.forEach(pill => {
            const cat = pill.dataset.cat;
            pill.classList.remove('active', 'done');
            if (cat === currentCat) pill.classList.add('active');
            else if (catOrder.indexOf(cat) < catOrder.indexOf(currentCat)) pill.classList.add('done');
        });
    }

    // ─── Live counter ─────────────────────────────────────────────────────────
    function updateLiveCounter() {
        const est = estimatePartial();
        if (est > 0) {
            liveVal.textContent = est.toFixed(1);
            liveCounter.style.opacity = '1';
        }
    }

    function estimatePartial() {
        // Use available answers; fill gaps with category averages
        const a = answers;
        let t = 0;

        // Transport
        const commuteMode = a.commuteMode || 'car-alone';
        const commuteDist = a.commuteDistance !== undefined ? a.commuteDistance : 10;
        const mpg = a.carMileage !== undefined ? a.carMileage : 28;
        const fuelFactor = mpg > 0 ? (mpg / 25) : 1;
        const emFactors = { 'car-alone': 0.411, 'car-carpool': 0.205, 'electric-car': 0.15,
            'public-transit': 0.14, 'motorcycle': 0.3, 'bike': 0, 'walk': 0, 'remote': 0 };
        const emF = emFactors[commuteMode] || 0.411;
        const adjEmF = (commuteMode === 'car-alone' || commuteMode === 'car-carpool' || commuteMode === 'motorcycle')
            ? emF / fuelFactor : emF;
        t += (commuteDist * 2 * 250 * adjEmF) / 1000;

        const wknd = a.weekendDriving !== undefined ? a.weekendDriving : 30;
        t += (wknd * 52 * 0.411 / fuelFactor) / 1000;
        t += (a.flightShort || 0) * 0.25;
        t += (a.flightLong  || 0) * 0.8;

        // Home (rough estimate)
        const sizes = { small: 4.5, medium: 7.0, large: 10.0 };
        const hSize = a.homeSize || 'medium';
        const hh = a.householdSize || 3;
        t += (sizes[hSize] || 7.0) / Math.sqrt(hh);

        // Food (rough)
        const dietMap = { vegan: 1.5, vegetarian: 1.7, pescatarian: 2.0,
            'low-meat': 2.5, 'regular-meat': 3.3, 'high-meat': 4.2 };
        t += dietMap[a.diet] || 3.0;

        // Consumption (rough)
        t += 2.0;

        return t;
    }

    // ─── Full calculation & results ───────────────────────────────────────────
    function showResults() {
        quizShell.style.display = 'none';
        resultsShell.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const transport   = calcTransport();
        const homeEnergy  = calcHome();
        const food        = calcFood();
        const consumption = calcConsumption();
        const total = transport + homeEnergy + food + consumption;

        displayResults(total, transport, homeEnergy, food, consumption);
    }

    function get(key, def) {
        return answers[key] !== undefined ? answers[key] : def;
    }

    function calcTransport() {
        let e = 0;
        const mode   = get('commuteMode', 'car-alone');
        const dist   = parseFloat(get('commuteDistance', 10)) || 0;
        const mpg    = parseFloat(get('carMileage', 28)) || 28;
        const nVeh   = parseInt(get('numVehicles', 1)) || 0;
        const wknd   = parseFloat(get('weekendDriving', 30)) || 0;
        const fShort = parseInt(get('flightShort', 0)) || 0;
        const fLong  = parseInt(get('flightLong',  0)) || 0;

        const fuelFactor = mpg / 25;
        const baseFactors = {
            'car-alone':      0.411 / fuelFactor,
            'car-carpool':    0.205 / fuelFactor,
            'electric-car':   0.15,
            'public-transit': 0.14,
            'motorcycle':     0.3 / fuelFactor,
            'bike': 0, 'walk': 0, 'remote': 0,
        };
        e += (dist * 2 * 250 * (baseFactors[mode] || 0)) / 1000;

        // Weekend / recreational driving
        const wkndFactor = (mode === 'remote' || mode === 'bike' || mode === 'walk')
            ? 0.411 / fuelFactor : baseFactors[mode] || 0.411 / fuelFactor;
        e += (wknd * 52 * Math.max(wkndFactor, 0)) / 1000;

        // Extra vehicles sitting in the driveway (manufacture + idle emissions)
        if (nVeh > 1) e += (nVeh - 1) * 0.5;

        e += fShort * 0.25;
        e += fLong  * 0.8;
        return e;
    }

    function calcHome() {
        const homeSize      = get('homeSize', 'medium');
        const hh            = Math.max(1, parseInt(get('householdSize', 3)) || 1);
        const solar         = get('solarPanels', 'no');
        const greenEnergy   = get('greenEnergy', 'no');
        const heating       = get('heating', 'electric');
        const ac            = get('airConditioning', 'none');
        const insulation    = get('homeInsulation', 'average');
        const hotWater      = get('hotWater', 'gas');
        const thermostat    = parseInt(get('thermostat', 68)) || 68;
        const leds          = get('energyEfficient', 'some');

        const baseSizes = { small: 4.5, medium: 7.0, large: 10.0 };
        let base = (baseSizes[homeSize] || 7.0) / Math.sqrt(hh);

        if (solar === 'yes') base *= 0.5;
        if (greenEnergy === 'yes') base *= 0.3;
        else if (greenEnergy === 'partial') base *= 0.65;

        const heatF = { 'natural-gas': 1.2, 'electric': 1.0, 'oil': 1.4, 'heat-pump': 0.65, 'other': 0.8 };
        base *= (heatF[heating] || 1.0);

        const acF = { 'none': 1.0, 'window': 1.1, 'central': 1.25 };
        base *= (acF[ac] || 1.0);

        const insulF = { 'well': 0.85, 'average': 1.0, 'poor': 1.2 };
        base *= (insulF[insulation] || 1.0);

        const hwF = { 'gas': 1.0, 'electric': 1.05, 'heat-pump': 0.7, 'solar': 0.5 };
        base *= (hwF[hotWater] || 1.0);

        if (thermostat > 70) base *= 1.1;
        else if (thermostat < 65) base *= 0.9;

        const ledF = { 'all': 0.9, 'most': 0.95, 'some': 1.0, 'none': 1.1 };
        base *= (ledF[leds] || 1.0);

        return base;
    }

    function calcFood() {
        const dietMap = { vegan: 1.5, vegetarian: 1.7, pescatarian: 2.0,
            'low-meat': 2.5, 'regular-meat': 3.3, 'high-meat': 4.2 };
        let e = dietMap[get('diet', 'regular-meat')] || 3.3;

        // Beef bonus (on top of diet category)
        const beefF = { daily: 1.3, weekly: 1.1, monthly: 1.0, never: 0.9 };
        e *= (beefF[get('beefFrequency', 'weekly')] || 1.0);

        // Dairy
        const dairyF = { high: 1.1, moderate: 1.0, low: 0.9 };
        e *= (dairyF[get('dairyConsumption', 'moderate')] || 1.0);

        const localF = { always: 0.85, often: 0.90, sometimes: 0.95, rarely: 1.0, never: 1.05 };
        e *= (localF[get('localFood', 'sometimes')] || 1.0);

        const wasteF = { none: 0.9, little: 1.0, moderate: 1.15, lot: 1.3 };
        e *= (wasteF[get('foodWaste', 'little')] || 1.0);

        const orgF = { always: 0.95, often: 0.97, sometimes: 1.0, rarely: 1.0 };
        e *= (orgF[get('organicFood', 'sometimes')] || 1.0);

        return e;
    }

    function calcConsumption() {
        let e = 0;

        const recycBase = { always: 0.3, usually: 0.4, sometimes: 0.6, rarely: 0.8, never: 1.0 };
        e += recycBase[get('recycling', 'sometimes')] || 0.6;

        if (get('composting', 'no') === 'yes') e -= 0.1;

        const plasticE = { never: 0.2, rarely: 0.4, sometimes: 0.6, often: 0.8, always: 1.0 };
        e += plasticE[get('singleUsePlastic', 'sometimes')] || 0.6;

        const clothE = { rarely: 0.3, occasionally: 0.6, often: 1.2 };
        e += clothE[get('newClothes', 'occasionally')] || 0.6;

        const shF = { always: 0.5, often: 0.7, sometimes: 0.85, rarely: 0.95, never: 1.0 };
        e *= shF[get('secondHand', 'sometimes')] || 1.0;

        const elecE = { rarely: 0.3, occasionally: 0.6, often: 1.0 };
        e += elecE[get('electronics', 'occasionally')] || 0.6;

        const stream = parseFloat(get('streaming', 2)) || 0;
        e += (stream * 365 * 0.055) / 1000;

        const waterE = { low: 0.1, moderate: 0.2, high: 0.35 };
        e += waterE[get('waterUsage', 'moderate')] || 0.2;

        const paperE = { minimal: 0.1, moderate: 0.25, high: 0.5 };
        e += paperE[get('paperUsage', 'moderate')] || 0.25;

        return Math.max(e, 0);
    }

    // ─── Display results ─────────────────────────────────────────────────────
    function displayResults(total, transport, home, food, consumption) {
        // Animated counter
        animateCounter(document.getElementById('totalFootprint'), total);
        document.getElementById('userCompValue').innerHTML =
            total.toFixed(2) + ' <span>tons</span>';

        // Rating badge
        const badge = document.getElementById('resultRating');
        const earth = document.getElementById('resultEarth');
        if (total < 4) {
            badge.textContent = '🌟 Excellent – Below World Average';
            badge.style.background = 'rgba(34,197,94,0.35)';
            earth.textContent = '🌍';
        } else if (total < 8) {
            badge.textContent = '👍 Good – Below US Average';
            badge.style.background = 'rgba(132,204,22,0.35)';
            earth.textContent = '🌎';
        } else if (total < 14) {
            badge.textContent = '⚠️ Average – Room to Improve';
            badge.style.background = 'rgba(245,158,11,0.35)';
            earth.textContent = '🌏';
        } else {
            badge.textContent = '❗ High – Significant Changes Needed';
            badge.style.background = 'rgba(239,68,68,0.35)';
            earth.textContent = '🌏';
        }

        // Gauge marker: scale 0–20+ tons → 0–100%
        const gaugePos = Math.min((total / 20) * 100, 98);
        setTimeout(() => {
            document.getElementById('gaugeMarker').style.left = gaugePos + '%';
        }, 400);

        // Breakdown bars
        const maxCat = Math.max(transport, home, food, consumption, 0.1);
        setTimeout(() => {
            setBar('transportBar', 'transportValue', transport, maxCat);
            setBar('homeBar',      'homeValue',      home,      maxCat);
            setBar('foodBar',      'foodValue',      food,      maxCat);
            setBar('consumptionBar','consumptionValue', consumption, maxCat);
        }, 500);

        // Tips
        buildTips(total, transport, home, food, consumption);
    }

    function setBar(barId, valId, value, max) {
        document.getElementById(barId).style.width = ((value / max) * 100) + '%';
        document.getElementById(valId).textContent = value.toFixed(2) + ' tons';
    }

    function animateCounter(el, target) {
        const duration = 1400;
        const start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * ease).toFixed(2);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function buildTips(total, transport, home, food, consumption) {
        const tips = [];
        if (transport > 3)  tips.push({ icon: '🚴', title: 'Try Alternative Transportation',  text: 'Switch to biking, walking, or public transit for your commute. Carpooling can cut your transport emissions in half.' });
        if (transport > 2)  tips.push({ icon: '⚡', title: 'Consider an Electric Vehicle',     text: 'EVs produce ~60% fewer emissions over their lifetime than gas cars, especially with a renewable energy grid.' });
        if (home > 5)       tips.push({ icon: '☀️', title: 'Switch to Renewable Energy',       text: 'Installing solar panels or signing up for a green energy tariff can cut your home emissions by up to 70%.' });
        if (home > 4)       tips.push({ icon: '🌡️', title: 'Optimise Your Thermostat',         text: 'Lower by 2–3°F in winter and raise in summer. A smart thermostat pays for itself within a year.' });
        if (home > 3)       tips.push({ icon: '🏠', title: 'Improve Home Insulation',          text: 'Draught-proofing and adding loft insulation can reduce heating energy by 20–40%.' });
        if (food > 3)       tips.push({ icon: '🥗', title: 'Eat More Plant-Based Meals',       text: 'Cutting beef consumption even once a week can save ~0.5 tons CO₂/year. Try Meatless Mondays!' });
        if (food > 2.5)     tips.push({ icon: '🌾', title: 'Buy Local & Seasonal',             text: 'Locally grown, seasonal food has far lower transport and storage emissions.' });
        if (consumption > 2.5) tips.push({ icon: '♻️', title: 'Reduce, Reuse, Recycle',       text: 'Reducing consumption comes first. Repair items, buy quality over quantity, and always recycle.' });
        if (consumption > 2)   tips.push({ icon: '👕', title: 'Shop Secondhand',               text: "Extending a garment's life by just 9 months reduces its carbon, water and waste footprint by ~20–30%." });
        if (total > 10)     tips.push({ icon: '🌳', title: 'Offset Remaining Emissions',       text: "Support verified reforestation or renewable energy projects to offset emissions you can't yet eliminate." });
        tips.push({ icon: '📚', title: 'Stay Informed & Inspire Others', text: "Knowledge is powerful. Share what you've learned and join CAT community events to amplify your impact!" });

        const container = document.getElementById('tipsContainer');
        container.innerHTML = '';
        tips.forEach(tip => {
            const card = document.createElement('div');
            card.className = 'tip-card';
            card.innerHTML = `<div class="tip-icon">${tip.icon}</div><h4>${tip.title}</h4><p>${tip.text}</p>`;
            container.appendChild(card);
        });
    }
});
