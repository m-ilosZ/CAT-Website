// Carbon Footprint Calculator Logic
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('carbonCalculatorForm');
    const resultsSection = document.getElementById('resultsSection');
    const calculatorContainer = document.getElementById('calculatorContainer');
    const retakeButton = document.getElementById('retakeButton');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateFootprint();
        });
    }

    if (retakeButton) {
        retakeButton.addEventListener('click', function() {
            form.reset();
            resultsSection.style.display = 'none';
            form.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Add select element styling
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.style.width = '100%';
        select.style.padding = '0.875rem';
        select.style.border = '2px solid var(--border-color)';
        select.style.borderRadius = '8px';
        select.style.fontSize = '1rem';
        select.style.transition = 'border-color 0.3s';
        select.style.backgroundColor = 'white';
        
        select.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
            this.style.outline = 'none';
        });
        
        select.addEventListener('blur', function() {
            this.style.borderColor = 'var(--border-color)';
        });
    });

    function calculateFootprint() {
        // Get form values
        const formData = new FormData(form);
        
        // Calculate emissions by category
        const transportation = calculateTransportation(formData);
        const homeEnergy = calculateHomeEnergy(formData);
        const food = calculateFood(formData);
        const consumption = calculateConsumption(formData);
        
        const total = transportation + homeEnergy + food + consumption;
        
        // Display results
        displayResults(total, transportation, homeEnergy, food, consumption);
        
        // Hide form and show results
        form.style.display = 'none';
        resultsSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function calculateTransportation(formData) {
        let emissions = 0;
        
        // Commute emissions
        const commuteDistance = parseFloat(formData.get('commuteDistance')) || 0;
        const commuteMode = formData.get('commuteMode');
        const carMileage = parseFloat(formData.get('carMileage')) || 25;
        
        // Annual commute miles (assuming 250 work days)
        const annualCommuteMiles = commuteDistance * 2 * 250;
        
        // Emissions per mile by mode (kg CO2)
        const emissionFactors = {
            'car-alone': 0.411 / (carMileage / 25), // Adjusted by fuel efficiency
            'car-carpool': 0.205 / (carMileage / 25), // Half of driving alone
            'electric-car': 0.15, // Lower but not zero (electricity generation)
            'public-transit': 0.14,
            'bike': 0,
            'walk': 0,
            'remote': 0
        };
        
        emissions += (annualCommuteMiles * (emissionFactors[commuteMode] || 0)) / 1000; // Convert to metric tons
        
        // Flight emissions
        const shortFlights = parseInt(formData.get('flightShort')) || 0;
        const longFlights = parseInt(formData.get('flightLong')) || 0;
        
        emissions += shortFlights * 0.25; // 0.25 tons per short flight
        emissions += longFlights * 0.8; // 0.8 tons per long flight
        
        return emissions;
    }

    function calculateHomeEnergy(formData) {
        let emissions = 0;
        
        // Base home energy by size
        const homeSize = formData.get('homeSize');
        const householdSize = parseInt(formData.get('householdSize')) || 1;
        
        const baseSizes = {
            'small': 4.5,
            'medium': 7.0,
            'large': 10.0
        };
        
        let baseEmissions = baseSizes[homeSize] || 7.0;
        
        // Adjust for household size
        baseEmissions = baseEmissions / Math.sqrt(householdSize);
        
        // Solar panels reduction
        if (formData.get('solarPanels') === 'yes') {
            baseEmissions *= 0.5; // 50% reduction
        }
        
        // Green energy reduction
        const greenEnergy = formData.get('greenEnergy');
        if (greenEnergy === 'yes') {
            baseEmissions *= 0.3; // 70% reduction
        } else if (greenEnergy === 'partial') {
            baseEmissions *= 0.65; // 35% reduction
        }
        
        // Heating source adjustment
        const heating = formData.get('heating');
        const heatingFactors = {
            'natural-gas': 1.2,
            'electric': 1.0,
            'oil': 1.4,
            'heat-pump': 0.7,
            'other': 0.8
        };
        baseEmissions *= (heatingFactors[heating] || 1.0);
        
        // Thermostat setting (higher = more emissions)
        const thermostat = parseInt(formData.get('thermostat')) || 68;
        if (thermostat > 70) {
            baseEmissions *= 1.1;
        } else if (thermostat < 65) {
            baseEmissions *= 0.9;
        }
        
        // LED bulbs
        const energyEfficient = formData.get('energyEfficient');
        const ledFactors = {
            'all': 0.9,
            'most': 0.95,
            'some': 1.0,
            'none': 1.1
        };
        baseEmissions *= (ledFactors[energyEfficient] || 1.0);
        
        emissions = baseEmissions;
        return emissions;
    }

    function calculateFood(formData) {
        let emissions = 0;
        
        // Diet base emissions
        const diet = formData.get('diet');
        const dietEmissions = {
            'vegan': 1.5,
            'vegetarian': 1.7,
            'pescatarian': 2.0,
            'low-meat': 2.5,
            'regular-meat': 3.3,
            'high-meat': 4.2
        };
        
        emissions = dietEmissions[diet] || 3.3;
        
        // Local food bonus
        const localFood = formData.get('localFood');
        const localFactors = {
            'always': 0.85,
            'often': 0.90,
            'sometimes': 0.95,
            'rarely': 1.0,
            'never': 1.05
        };
        emissions *= (localFactors[localFood] || 1.0);
        
        // Food waste penalty
        const foodWaste = formData.get('foodWaste');
        const wasteFactors = {
            'none': 0.9,
            'little': 1.0,
            'moderate': 1.15,
            'lot': 1.3
        };
        emissions *= (wasteFactors[foodWaste] || 1.0);
        
        // Organic food (slight reduction due to sustainable practices)
        const organicFood = formData.get('organicFood');
        const organicFactors = {
            'always': 0.95,
            'often': 0.97,
            'sometimes': 1.0,
            'rarely': 1.0,
            'never': 1.0
        };
        emissions *= (organicFactors[organicFood] || 1.0);
        
        return emissions;
    }

    function calculateConsumption(formData) {
        let emissions = 0;
        
        // Recycling impact
        const recycling = formData.get('recycling');
        const recyclingBase = {
            'always': 0.3,
            'usually': 0.4,
            'sometimes': 0.6,
            'rarely': 0.8,
            'never': 1.0
        };
        emissions += (recyclingBase[recycling] || 0.6);
        
        // Composting bonus
        if (formData.get('composting') === 'yes') {
            emissions -= 0.1;
        }
        
        // Single-use plastics
        const singleUsePlastic = formData.get('singleUsePlastic');
        const plasticEmissions = {
            'never': 0.2,
            'rarely': 0.4,
            'sometimes': 0.6,
            'often': 0.8,
            'always': 1.0
        };
        emissions += (plasticEmissions[singleUsePlastic] || 0.6);
        
        // Clothing purchases
        const newClothes = formData.get('newClothes');
        const clothingEmissions = {
            'rarely': 0.3,
            'occasionally': 0.6,
            'often': 1.2
        };
        emissions += (clothingEmissions[newClothes] || 0.6);
        
        // Second-hand purchases (reduction)
        const secondHand = formData.get('secondHand');
        const secondHandFactors = {
            'always': 0.5,
            'often': 0.7,
            'sometimes': 0.85,
            'rarely': 0.95,
            'never': 1.0
        };
        emissions *= (secondHandFactors[secondHand] || 1.0);
        
        // Electronics
        const electronics = formData.get('electronics');
        const electronicsEmissions = {
            'rarely': 0.3,
            'occasionally': 0.6,
            'often': 1.0
        };
        emissions += (electronicsEmissions[electronics] || 0.6);
        
        // Streaming/gaming (data center emissions)
        const streaming = parseFloat(formData.get('streaming')) || 0;
        emissions += (streaming * 365 * 0.055) / 1000; // kg to tons
        
        // Water usage
        const waterUsage = formData.get('waterUsage');
        const waterEmissions = {
            'low': 0.1,
            'moderate': 0.2,
            'high': 0.35
        };
        emissions += (waterEmissions[waterUsage] || 0.2);
        
        // Paper usage
        const paperUsage = formData.get('paperUsage');
        const paperEmissions = {
            'minimal': 0.1,
            'moderate': 0.25,
            'high': 0.5
        };
        emissions += (paperEmissions[paperUsage] || 0.25);
        
        return Math.max(emissions, 0);
    }

    function displayResults(total, transportation, homeEnergy, food, consumption) {
        // Display total
        document.getElementById('totalFootprint').textContent = total.toFixed(2);
        
        // Display breakdown values
        document.getElementById('transportValue').textContent = transportation.toFixed(2) + ' tons';
        document.getElementById('homeValue').textContent = homeEnergy.toFixed(2) + ' tons';
        document.getElementById('foodValue').textContent = food.toFixed(2) + ' tons';
        document.getElementById('consumptionValue').textContent = consumption.toFixed(2) + ' tons';
        
        // Calculate percentages for bars
        const maxValue = Math.max(transportation, homeEnergy, food, consumption);
        document.getElementById('transportBar').style.width = ((transportation / maxValue) * 100) + '%';
        document.getElementById('homeBar').style.width = ((homeEnergy / maxValue) * 100) + '%';
        document.getElementById('foodBar').style.width = ((food / maxValue) * 100) + '%';
        document.getElementById('consumptionBar').style.width = ((consumption / maxValue) * 100) + '%';
        
        // Generate personalized tips
        generateTips(total, transportation, homeEnergy, food, consumption);
    }

    function generateTips(total, transportation, homeEnergy, food, consumption) {
        const tips = [];
        
        // Transportation tips
        if (transportation > 3) {
            tips.push({
                icon: '🚴',
                title: 'Consider Alternative Transportation',
                text: 'Try biking, walking, or public transit for your commute. Carpooling can also reduce your emissions significantly.'
            });
        }
        if (transportation > 2) {
            tips.push({
                icon: '🚗',
                title: 'Drive More Efficiently',
                text: 'Maintain proper tire pressure, avoid rapid acceleration, and consider a more fuel-efficient or electric vehicle.'
            });
        }
        
        // Home energy tips
        if (homeEnergy > 5) {
            tips.push({
                icon: '☀️',
                title: 'Switch to Renewable Energy',
                text: 'Consider installing solar panels or switching to a green energy plan from your utility provider.'
            });
        }
        if (homeEnergy > 4) {
            tips.push({
                icon: '🌡️',
                title: 'Optimize Your Thermostat',
                text: 'Lower your thermostat by 2-3 degrees in winter and raise it in summer. A programmable thermostat can help save energy.'
            });
        }
        
        // Food tips
        if (food > 3) {
            tips.push({
                icon: '🥗',
                title: 'Eat More Plant-Based Meals',
                text: 'Reducing meat consumption, especially beef, can significantly lower your carbon footprint. Try Meatless Mondays!'
            });
        }
        if (food > 2.5) {
            tips.push({
                icon: '🌾',
                title: 'Buy Local and Seasonal',
                text: 'Shop at farmers markets and choose local, seasonal produce to reduce transportation emissions.'
            });
        }
        
        // Consumption tips
        if (consumption > 2.5) {
            tips.push({
                icon: '♻️',
                title: 'Reduce, Reuse, Recycle',
                text: 'Focus on reducing consumption first, reusing items when possible, and recycling properly. Avoid single-use plastics.'
            });
        }
        if (consumption > 2) {
            tips.push({
                icon: '👕',
                title: 'Shop Secondhand',
                text: 'Buy thrifted clothing and items when possible. The fashion industry has a significant carbon footprint.'
            });
        }
        
        // General tips
        if (total > 10) {
            tips.push({
                icon: '🌳',
                title: 'Support Carbon Offset Programs',
                text: 'Consider supporting reforestation or renewable energy projects to offset your remaining emissions.'
            });
        }
        
        tips.push({
            icon: '📚',
            title: 'Stay Informed',
            text: 'Keep learning about climate action and share your knowledge with others. Join CAT events to make a bigger impact!'
        });
        
        // Display tips
        const tipsContainer = document.getElementById('tipsContainer');
        tipsContainer.innerHTML = '';
        
        tips.forEach(tip => {
            const tipCard = document.createElement('div');
            tipCard.className = 'tip-card';
            tipCard.innerHTML = `
                <div class="tip-icon">${tip.icon}</div>
                <h4>${tip.title}</h4>
                <p>${tip.text}</p>
            `;
            tipsContainer.appendChild(tipCard);
        });
    }
});
