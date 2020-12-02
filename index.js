document.addEventListener("DOMContentLoaded", () => {

    
    const exerciseTable = document.querySelector("tbody")
    const exerciseDiv = document.querySelector("#exercise-panel")
    exerciseDiv.addEventListener("click", (e) => handleEvent(e))



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
        const tr = document.createElement("tr")
        const name = document.createElement("td")
        const description = document.createElement("td")
        const muscleGroup = document.createElement("td")
        const addButton = document.createElement('button')
        const imageCell = document.createElement("td")
        const image = document.createElement("img")
        image.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzcOouX0aFFrzVJIVLTibFcageIi5Rw5ySkA&usqp=CAU"
        imageCell.appendChild(image)
        addButton.innerText = "Add"
        addButton.className = "button is-primary"
        addButton.dataset.exerciseId= ex.id
        name.innerText = ex.name
        description.innerText = ex.description
        muscleGroup.innerText=ex.muscle_group.name

        tr.append(name,description,muscleGroup,imageCell,addButton)

        exerciseTable.appendChild(tr)

    }

    function handleEvent(e) {
      
        if(e.target.tagName === "BUTTON"){
            const id = e.target.dataset.exerciseId
            console.log(id)
        }
    }
})