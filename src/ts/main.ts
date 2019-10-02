import axios from "axios";

let charactersContainer = document.querySelector(".characters-container .row");
const API_URI = "https://character-database.becode.xyz/characters";
const url_string = window.location.href;
const url = new URL(url_string);
const currentElementID = url.searchParams.get("id");

const dummyCharacterImage =
    "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";

if (charactersContainer) {
    axios("https://character-database.becode.xyz/characters").then(res => {
        if (res.data.length <= 0) {
            for (let i = 0; i < 10; i++) {
                axios.post("https://character-database.becode.xyz/characters", {
                    name: `Super hero ${i + 1}`,
                    shortDescription: "This is a dummy description",
                    description:
                        "The full description of this element can be changed later, this is a dummy description",
                    image: dummyCharacterImage,
                });
            }
        }

        res.data.forEach((hero: any) => {
            const characterCode = `
  <div class="character-image">
    <img src="data:image/png;base64,${
        hero.image ? hero.image : dummyCharacterImage
    }" />
  </div>
  <div class="character-infos">
    <div class="character-name">
      <p>${hero.name ? hero.name : "No name"}</p>
    </div>

    <div class="character-short-description">
      <p>${
          hero.shortDescription
              ? hero.shortDescription
              : "No short description provided"
      }</p>
    </div>

    <div class="actions-buttons-container">
      <div class="view action-button no-select">
        <button class="view-button" type="button">View</button>
      </div>
      <div class="edit action-button no-select">
        <button class="edit-button" type="button">Edit</button>
      </div>
      <div class="delete action-button no-select">
        <button class="delete-button" type="button">Delete</button>
      </div>
    </div>
  </div>
`;
            let character = document.createElement("div");
            character.classList.add("character", "break-long-words");
            character.setAttribute("data-id", hero.id);
            character.innerHTML = characterCode;
            charactersContainer.appendChild(character);
        });
    });
}

document.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("view-button")) {
        let parentElement = e.target.closest(".character");
        let parentID = parentElement.getAttribute("data-id");
        window.location.href = `${window.location.origin}/view.html?id=${parentID}`;
    }

    if (e.target && e.target.classList.contains("edit-button")) {
        let parentElement = e.target.closest(".character");
        let parentID = parentElement.getAttribute("data-id");
        window.location.href = `${window.location.origin}/edit.html?id=${parentID}`;
    }

    if (e.target && e.target.classList.contains("delete-button")) {
        let parentElement = e.target.closest(".character");
        let parentID = parentElement.getAttribute("data-id");
        let confirmDelete = confirm(
            `Are you sure to delete ${
                parentElement.querySelector(".character-name p").innerText
            }?`,
        );

        if (confirmDelete) {
            axios
                .delete(
                    `https://character-database.becode.xyz/characters/${parentID}`,
                )
                .then(res => {
                    parentElement.parentNode.removeChild(parentElement);
                });
        }
    }
});

let createForm = document.querySelector(".create-form");
let createFormData = <any>{};
let characterImageCreateInput = document.querySelector("#character-image");

if (createForm) {
    if (characterImageCreateInput) {
        characterImageCreateInput.addEventListener("change", el => {
            let reader = new FileReader();
            reader.onloadend = function() {
                let str = <string>reader.result;
                document
                    .querySelector(".create-form .character-image img")
                    .setAttribute("src", str);
                str = str.split(",")[1];
                createFormData.image = str;
            };
            reader.readAsDataURL(el.currentTarget.files[0]);
        });
    }

    createForm.addEventListener("submit", () => {
        createFormData.name =
            document.querySelector(".create-form #name").value.length > 0
                ? document.querySelector(".create-form #name").value
                : "No name";
        createFormData.shortDescription =
            document.querySelector(".create-form #short-description").value
                .length > 0
                ? document.querySelector(".create-form #short-description")
                      .value
                : "No short description provided";
        createFormData.description =
            document.querySelector(".create-form #full-description").value
                .length > 0
                ? document.querySelector(".create-form #full-description").value
                : "No full description provided";
        if (!createFormData.image) {
            createFormData.image = dummyCharacterImage;
        }

        axios.post(API_URI, createFormData).then(res => {
            window.location.href = `${window.location.origin}/index.html`;
        });
    });
}

let editForm = document.querySelector(".edit-form");

if (editForm) {
    let characterImage = document.querySelector("#characterImage img");
    let editCharacterImage = document.querySelector("#editCharacterImage");
    let nameInputField = document.querySelector("#editName");
    let shortDescInputField = document.querySelector("#editShortDescription");
    let fullDescInputField = document.querySelector("#editFullDescription");
    let editObjData = <any>{};
    let currentHeroImage: any;

    axios.get(`${API_URI}/${currentElementID}`).then(res => {
        let hero = res.data;
        characterImage.src = `
            data:image/png;base64, ${
                hero.image ? hero.image : dummyCharacterImage
            }`;
        nameInputField.value = hero.name;
        shortDescInputField.value = hero.shortDescription;
        fullDescInputField.value = hero.description;
        currentHeroImage = hero.image;
    });

    editCharacterImage.addEventListener("change", el => {
        let reader = new FileReader();
        reader.onloadend = function() {
            let str = <string>reader.result;
            characterImage.setAttribute("src", str);
            str = str.split(",")[1];
            editObjData.image = str;
        };
        reader.readAsDataURL(el.currentTarget.files[0]);
    });

    editForm.addEventListener("submit", () => {
        editObjData.name = nameInputField.value;
        editObjData.shortDescription = shortDescInputField.value;
        editObjData.description = fullDescInputField.value;
        if (!editObjData.image) {
            editObjData.image = currentHeroImage;
        }

        axios.put(`${API_URI}/${currentElementID}`, editObjData).then(res => {
            window.location.href = `${window.location.origin}/index.html`;
        });
    });
}

let singleCharacterContainer = document.querySelector(
    ".single-character-container",
);

if (singleCharacterContainer) {
    axios(
        `https://character-database.becode.xyz/characters/${currentElementID}`,
    ).then(res => {
        let hero = res.data;

        const characterCode = `
<div class="sticky-character-image col-6 col-xs-18">
  <div class="character-image">
    <img src="data:image/png;base64,${
        hero.image ? hero.image : dummyCharacterImage
    }" />
  </div>
</div>
<div class="col-12 col-xs-18">
  <div class="character-infos">
    <div class="character-name">
      <p>${hero.name ? hero.name : "No name"}</p>
    </div>
    <div class="description character-short-description">
      <p>${
          hero.shortDescription
              ? hero.shortDescription
              : "No short description provided"
      }</p>
    </div>
    <div class="description character-full-description">
      <p>${
          hero.description ? hero.description : "No Full description provided"
      }</p>
    </div>
    <div class="actions-buttons-container">
      <div class="edit action-button no-select">
        <button class="edit-button" type="button">Edit</button>
      </div>
      <div class="delete action-button no-select">
        <button class="delete-button" type="button">Delete</button>
      </div>
    </div>
  </div>
</div>
            `;
        let character = document.createElement("div");
        character.classList.add("character", "break-long-words", "row");
        character.setAttribute("data-id", hero.id);
        character.innerHTML = characterCode;
        singleCharacterContainer.appendChild(character);
    });
}
