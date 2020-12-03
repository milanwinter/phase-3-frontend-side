document.addEventListener("DOMContentLoaded", () => {

    
    const exerciseTable = document.querySelector("tbody")
    const exerciseDiv = document.querySelector("#exercise-panel")
    const planButton = document.querySelector("#submit-button")
    const input = document.querySelector(".input")
    const planList = document.querySelector("#plans-list")

    // Everything to do with the exercise modal box------------------------------------------
    const exerciseModal = document.querySelector(".modal")
    const exerciseModalBody = document.querySelector(".modal-card-body")
    const exerciseModalClose = document.querySelector('.delete')
    const exerciseModalCancel = document.querySelector("button#cancel")
    const exerciseModalSelect = document.querySelector("select")
    const exerciseModalAddBtn = document.querySelector("#add")
    

    planButton.addEventListener("click", (e) => addPlan(e))
    exerciseModalClose.addEventListener("click", () => {
        exerciseModal.style.display = 'none'
    })
    exerciseModalCancel.addEventListener("click", () => {
        exerciseModal.style.display = 'none'
    })

    


    /// End of the modal box Stuff ---------------------------------------------


    exerciseDiv.addEventListener("click", (e) => handleEvent(e))

    //these will run when page loads

    fetchExercises()
    fetchWorkoutPlans()


    // fetching all exercises with thse next 3 functions ///
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





    // Adding an exercise to a workoutplan with this right here ------------------------->


    function handleEvent(e) {
      
        if(e.target.tagName === "BUTTON"){
            const id = e.target.dataset.exerciseId
            exerciseModal.style.display = 'block'
            addExerciseModalOptions()


            exerciseModalAddBtn.addEventListener("click", () => addExerciseToPlan(e, id) )

            // fetch("http://localhost:3000/workout_plans", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Accept" : "application/json"
            //     },
            //     body: JSON.stringify({
            //         id: id
            //     })
            // })
        }
    }

    function addExerciseModalOptions() {
       const select = document.querySelector("select")

       fetch("http://localhost:3000/workout_plans")
        .then(resp => resp.json())
        .then(json => createOptions(json))
       
    }

    function createOptions(plans) {
        plans.forEach((plan) => {
            const option = document.createElement("option")
            option.value = plan.name
            option.innerText = plan.name
            option.dataset.planId = plan.id
            exerciseModalSelect.appendChild(option)
        })
    }
    
    function addExerciseToPlan(e, id) {
        console.log("before")
        console.log(id)
        console.log("after")
        plan = exerciseModalSelect.value
         fetch("http://localhost:3000/workout_exercises", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept" : "application/json"
                },
                body: JSON.stringify({
                    exercise_id: id,
                    name: plan
                })
            })
                .then(resp => resp.json())
                .then(json => {
                 exerciseModal.style.display = 'none'
                 fetchWorkoutPlans()
                })

    }
    


    /// end of adding exercises --------------------------------------------







    // Adding Plans Down below ------------------------------------------------------>

    function addPlan(e) {
        console.log(e.target)
        console.log(input.value)
       fetch("http://localhost:3000/workout_plans", {
           method: "POST",
           headers: {
               "Content-type": "application/json",
               "Accept": "application/json"
           },
           body: JSON.stringify({
               name: input.value
           })
       })
        .then(resp => resp.json())
        .then(json => displayPlans(json))
        
    }

    function fetchWorkoutPlans() {
        fetch("http://localhost:3000/workout_plans")
            .then(resp => resp.json())
            .then(json => displayPlans(json))
    }

    function displayPlans(plans) {
        planList.innerHTML = ""
        plans.forEach((plan) => {
            displaySinglePlan(plan)
        })
    }

    function displaySinglePlan(plan) {
       
        const bigLi = document.createElement("li")
        const ol = document.createElement("ul")
        const li = document.createElement("li")
        bigLi.innerText = plan.name
        if (plan.exercises && plan.exercises.length > 0) {
            plan.exercises.forEach((exercise) => {

                li.innerText = exercise.name
            })
        } else {
            li.innerText = "No Exercises for this plan yet, add some!"
        }

        ol.appendChild(li)
        bigLi.appendChild(ol)
        planList.appendChild(bigLi)
    }

    /// end of adding plans ------------------------------------------------------>
})