document.addEventListener("DOMContentLoaded", () => {

    const exerciseTable = document.querySelector("tbody")



    fetchExercises()

    function fetchExercises() {
        fetch("http://localhost:3000/exercises")
            .then(resp => resp.json())
            .then(json => displayExercises(json))
    }

    function displayExercises(exercises) {
        exercises.forEach(exercise => {
            createNewExercise(exercise)
        });
    }

    function createNewExercise(ex) {
        console.log(ex)
        const tr = document.createElement("tr")
        const name = document.createElement("td")
        const description = document.createElement("td")
        const muscleGroup = document.createElement("td")
    
        name.innerText = ex.name
        description.innerText = ex.description
        muscleGroup.innerText=ex.muscle_group.name

        tr.append(name,description,muscleGroup)

        exerciseTable.appendChild(tr)

    }
})