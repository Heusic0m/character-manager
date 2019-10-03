import axios from "axios";
import SimpleMDE from "simplemde";
import showdown from "showdown";
import dummyCharacter from "../images/dummy-character.png";
const markDownConverter = new showdown.Converter();

let markdownTextarea: {value: any};
if (document.querySelector(".markdown-textarea")) {
    markdownTextarea = new SimpleMDE({
        element: document.querySelector(".markdown-textarea"),
    });
}

let charactersContainer = document.querySelector(".characters-container .row");
const API_URI = "https://character-database.becode.xyz/characters";
const url_string = window.location.href;
const url = new URL(url_string);
const currentElementID = url.searchParams.get("id");

function getDataUri(url, cb) {
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        canvas.getContext("2d").drawImage(this, 0, 0);
        cb(canvas.toDataURL());
    };
    img.src = url;
}

let dummyCharacterImage: any;

getDataUri(dummyCharacter, function(dataUri) {
    dummyCharacterImage = dataUri.split(",")[1];
});

if (charactersContainer) {
    axios(`${API_URI}`).then(res => {
        if (res.data.length <= 0) {
            for (let i = 0; i < 10; i++) {
                axios.post(`${API_URI}`, {
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

    <div class="actions-buttons-container row">
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
            `Are you sure you want to delete ${
                parentElement.querySelector(".character-name p").innerText
            }?`,
        );

        if (confirmDelete) {
            axios.delete(`${API_URI}/${parentID}`).then(res => {
                if (parentElement.closest(".single-character-container")) {
                    window.location.href = `${window.location.origin}/index.html`;
                }
                parentElement.parentNode.removeChild(parentElement);
            });
        }
    }

    if (e.target && e.target.id === "editDeleteButton") {
        let parentElement = e.target.closest(".character");
        let confirmDelete = confirm(
            `Are you sure you want to delete ${
                document.querySelector("#editName").value
            }?`,
        );

        if (confirmDelete) {
            axios.delete(`${API_URI}/${currentElementID}`).then(res => {
                window.location.href = `${window.location.origin}/index.html`;
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
            window.location.href = `${window.location.origin}/view.html?id=${res.data.id}`;
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
        markdownTextarea.value(hero.description);
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
        editObjData.description = markdownTextarea.value();
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
    axios(`${API_URI}/${currentElementID}`)
        .catch(err => {
            alert(
                "This item doesn't exist anymore, wether it has been deleted or you've mistaken its ID",
            );
            window.location.href = `${window.location.origin}/index.html`;
        })
        .then(res => {
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
    <div class="description character-short-description">${
        hero.shortDescription
            ? hero.shortDescription
            : "No short description provided"
    }
    </div>
    <div id="wrapper" class="description character-full-description break-long-words">
      <p>${
          hero.description
              ? markDownConverter.makeHtml(hero.description)
              : "No Full description provided"
      }</p>
    </div>
    <div class="actions-buttons-container row">
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
