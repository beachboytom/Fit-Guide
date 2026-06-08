
const API_KEY = 'zk31KR1VFOtwzCsufccBZ5u9vhxlmpnl7KaZ3v0k'; 

const workoutForm = document.getElementById('workoutForm');
const inputName = document.getElementById('cvikName');
const inputVaha = document.getElementById('cvikVaha');
const workoutList = document.getElementById('workoutList');

const muscleSelect = document.getElementById('muscleSelect');
const difficultySelect = document.getElementById('difficultySelect');
const searchBtn = document.getElementById('searchBtn');
const apiCvikyList = document.getElementById('apiCvikyList');

window.addEventListener('load', loadWorkouts);

workoutForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    if (inputName.value.trim() === "" || inputVaha.value.trim() === "") {
        return;
    }

    let workouts = JSON.parse(localStorage.getItem('fitGuideData')) || [];
    
    let newWorkout = {
        id: Date.now(), 
        name: inputName.value,
        data: inputVaha.value
    };
    
    workouts.unshift(newWorkout); 
    localStorage.setItem('fitGuideData', JSON.stringify(workouts));
    
    inputName.value = "";
    inputVaha.value = "";
    
    loadWorkouts();
});

function loadWorkouts() {
    workoutList.innerHTML = ""; 
    let workouts = JSON.parse(localStorage.getItem('fitGuideData')) || [];

    if (workouts.length === 0) {
        workoutList.innerHTML = "<p>Zatím tu nic nemáš. Začni makat!</p>";
        return;
    }

    for(let w of workouts) {
        let div = document.createElement('div');
        div.style.background = '#1E1E1E';
        div.style.padding = '15px 25px';
        div.style.margin = '15px auto';
        div.style.width = '80%';
        div.style.borderRadius = '15px';
        div.style.borderLeft = '5px solid #FF5722';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between'; 
        div.style.alignItems = 'center'; 
        
        div.innerHTML = `
            <div style="text-align: left;">
                <h3 style="color: #FF5722; margin: 0 0 5px 0; font-size: 24px;">${w.name}</h3>
                <p style="margin: 0; color: #E0E0E0; font-size: 18px;">Výkon: <strong>${w.data}</strong></p>
            </div>
            <button class="delete-btn" data-id="${w.id}" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">Smazat</button>
        `;
        workoutList.appendChild(div);
    }

    let deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            let idToDelete = Number(this.getAttribute('data-id'));
            smazCvik(idToDelete);
        });
    });
}

function smazCvik(id) {
    let workouts = JSON.parse(localStorage.getItem('fitGuideData')) || [];
    workouts = workouts.filter(w => w.id !== id);
    localStorage.setItem('fitGuideData', JSON.stringify(workouts));
    loadWorkouts(); 
}



searchBtn.addEventListener('click', async function() {
    if (muscleSelect.value === "" && difficultySelect.value === "") {
        apiCvikyList.innerHTML = "<p style='color: red;'>Vyber si aspoň jednu kategorii!</p>";
        return;
    }

    apiCvikyList.innerHTML = "<p>Hledám cviky...</p>";

    let url = 'https://api.api-ninjas.com/v1/exercises?';
    if (muscleSelect.value !== "") {
        url += `muscle=${muscleSelect.value}&`;
    }
    if (difficultySelect.value !== "") {
        url += `difficulty=${difficultySelect.value}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        apiCvikyList.innerHTML = "";


        for(let cvik of data) {
            let div = document.createElement('div');
            div.style.background = '#1E1E1E';
            div.style.padding = '20px';
            div.style.margin = '15px auto';
            div.style.borderRadius = '15px';
            div.style.borderLeft = '5px solid #FF5722';
            div.style.textAlign = 'left';

            div.innerHTML = `
                <h3 style="color: #FF5722; font-size: 24px; margin-top: 0;">${cvik.name}</h3>
                <p><strong>Typ:</strong> ${cvik.type} | <strong>Obtížnost:</strong> ${cvik.difficulty}</p>
                <p><strong>Návod:</strong> ${cvik.instructions}</p>
            `;
            apiCvikyList.appendChild(div);
        }

    } catch (error) {
        console.error("Chyba při komunikaci s API:", error);
        apiCvikyList.innerHTML = "<p style='color: red;'>Nepodařilo se spojit se serverem. Zkontroluj svůj API klíč!</p>";
    }
});


