/* Sign up for restdb.io
Create a "collection" modelling something e.g.
Friends?
Bands
Cars
Add a few rows/entries
Create a CORS key
Create a function called get that fetch'es some data from the collection (the console is fine, a <template> is better)
Call your function, from the script or from the console */

const endpoint = "https://frontend2020-db3c.restdb.io/rest/superheroes";
const apiKey = "5e95774d436377171a0c233c";

window.addEventListener("load", (e) => {
    document.querySelector("button.add-new-hero").addEventListener("click", () => {
        const data = {
            real_name: "any name",
            alias: "New Hero" + Math.random(),
            enemies: "100",
            powers: ["dive", "fly"],
            dob: "2020-04-08"
          };
        post(data);
    });
});

function get(){
    document.querySelector("main").innerHTML = "";
    fetch(endpoint + "?max=100", {
    method: "get",
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": apiKey,
        "cache-control": "no-cache"
    }
    })
    .then(e => e.json())
    //test if it works:
    //.then(e => console.log(e));
    // now lets put it on the html:
    .then(showHeroes);
}

get();

function showHeroes(data){
    // its gonna receive the data automatically
    //now we loop through"
    data.forEach(showHero);
}

function showHero(oneHero){
    console.log(oneHero)
    //get the template
    const heroTemplate = document.querySelector("template").content;
    //make a copy
    const copy = heroTemplate.cloneNode(true);
    //get the parent element"
    const parent = document.querySelector("main");
    //fixing the delete option by id: (giving a data ID for each article)
    copy.querySelector("article").dataset.id = oneHero._id;
    //inside the copy find h1 and set the text content to be..:
    copy.querySelector("h1").textContent = oneHero.alias;
    copy.querySelector("h2").textContent = oneHero.real_name;
    //add each super power
    //*copy select the tenplate!!
    const ul = copy.querySelector("ul");
    console.log(oneHero.powers)
    let thePowers;
    thePowers = oneHero.powers;
    console.log(oneHero)
    thePowers.forEach( (power) => {
        const li = document.createElement("li");
        console.log(li)
        li.textContent = power;
        ul.appendChild(li)
    });
    //add the delete button function
    copy.querySelector("button.removeIt").addEventListener("click", () => deleteIt(oneHero._id));
    //parent got a new kid!"
    parent.appendChild(copy);
}

/* 
Create a function called post() that POST's an entry to your collection
Call it either in your script or from the console
Then call your function get() again to get the new data
If you can make the post function accept arguments (what it should store), that would be amazing */

function post(data){
    //optimistic inserts
    //showHero(data);

    const postData = JSON.stringify(data);
    fetch(endpoint, {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-apikey": apiKey,
          "cache-control": "no-cache"
        },
        body: postData
      })
    .then(res => res.json())
    //.then(data => get());
    //instead of reloading the page, reloading main, just brings the new data, passing data again 
    .then(data => showHero(data) );
}

function deleteIt(id){
    document.querySelector(`article[data-id="${id}"]`).remove();
    fetch(`${endpoint}/${id}`, {
        method: "delete",
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-apikey': apiKey,
          "cache-control": "no-cache"
        }
    })
    .then(res=>res.json())
    .then(data=>console.log(data));
}

function put(id) {
    const data = {
        real_name: "Surprise!",
        alias: "New Hero" + Math.random(),
        enemies: "100",
        powers: ["dive", "fly"],
        dob: "2020-04-08"
      };
    let postData = JSON.stringify(data);
    
    fetch(`${endpoint}/${id}`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-apikey': apiKey,
            "cache-control": "no-cache"
        },
        body: postData
    })
    .then(d => d.json())
    .then(data => {
        //then copy in verything you want to bring again, this time as "data", as per the ".then" statement
        const copy = document.querySelector(`article[data-id="${id}"]`);
        copy.querySelector("h1").textContent = data.alias;
        copy.querySelector("h2").textContent = data.real_name;
        const ul = copy.querySelector("ul");
        let thePowers;
        thePowers = data.powers;
        thePowers.forEach( (power) => {
            const li = document.createElement("li");
            console.log(li)
            li.textContent = power;
            ul.appendChild(li)
        });   
    });
}