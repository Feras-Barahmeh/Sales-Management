
const searchInputs = document.querySelectorAll(".input-container .search-input");

function whenFocusInput(input, label, ul) {
    input.onfocus = function () {

        // Show flash message
        getMessages("sales", "getMessagesAjax", "sales.messages").then((result) => {
            if (input.name === "Name") {
                flashMessage("info", result.message_hint_search_client, 5000);
            } else if(input.name === "Email") {
                flashMessage("info", result.message_hint_search_client_email, 5000);
            }
        });

        // flay label
        label.classList.add("up");

        // Active list
        ul.classList.add("active");
    }
}
function whenBlurInput(input, label, ul, lis) {
    input.onblur = () => {

        // control label input
        if (input.value === '') {
            label.classList.remove("up");
        } else if (input.value == null) {
            label.classList.add("up");
        }

        // Control label
        if (input.value === '') {
            ul.classList.add("active");
            label.classList.add("up");
        }

        document.addEventListener("click", (e) => {
            const element = e.target;

            if (element === input) {
                ul.classList.remove("active");
                ul.classList.add("active");
            } else {
                lis.forEach(li => {
                    if (element === li) {
                        ul.classList.remove("active")
                    } else {
                        ul.classList.remove("active");
                    }
                });
            }


        });
    };
}

function whenWriteInInput(input, fetchButton, lis) {

    // control button
    input.addEventListener("keyup", (e) => {

        if (input.getAttribute("primaryKey") != null) input.removeAttribute("primaryKey");

        if (input.value === '') {
            fetchButton.classList.remove("active");
        } else {
            fetchButton.classList.add("active");
        }

    });
}
function whenClickDownUp(input, ul, lis) {

    let count = -1;
    document.addEventListener("keydown", (e) => {
        if (ul.classList.contains("active")) {
            if (e.key === "ArrowDown") {
                if (count < ul.children.length - 1) {
                    count++;
                    count-1 >= 0 ? lis[count-1].classList.remove("hover") : null;
                    lis[count].classList.add("hover");
                }
            } else if (e.key === "ArrowUp") {
                if (count > 0) {
                    count--;
                    count+1 <= ul.children.length - 1 ? lis[count+1].classList.remove("hover") : null;

                    lis[count].classList.add("hover");
                }
            } else if (e.key === "Enter") {
                lis.forEach(li => {
                   if (li.classList.contains("hover")) {
                       li.classList.remove("hover");
                       li.click();
                   }
                });
            }
        }
    });
}
function ifExist(input, lis) {
    let value = input.value.trim();

    lis.forEach(li => {
       if (li.textContent.trim() === value) {
           input.removeAttribute("primaryKey");
           input.setAttribute("primaryKey", li.getAttribute("primaryKey"));
           return true;
       }
    });

    // return false;

}
function whenClickInButtonSearch(input, fetchButton, lis, label, nameClassInputs, to) {
    fetchButton.addEventListener("click", () => {
        ifExist(input, lis);

        getInfo(
            to,
            input.getAttribute("action"),
            input.getAttribute("primaryKey"),
            input.name,
            nameClassInputs,
        );
        input.value = '';
        label.classList.remove("up");
        fetchButton.classList.remove("active");


    });
}
function whenClickLis(lis, input, ul, fetchButton) {
    lis.forEach(li => {
        li.addEventListener("click", () => {
            input.value = li.textContent;
            ul.classList.remove("active");
            fetchButton.classList.add("active");
            input.setAttribute("primaryKey", li.getAttribute("primaryKey"));
        });
    });
}
searchInputs.forEach(searchInput => {
    let ul = searchInput.closest(".input-container").querySelector("ul");
    let lis = searchInput.closest(".input-container").querySelectorAll("li");
    let fetchButton = searchInput.parentElement.querySelector(".fetch-btn");
    let label = searchInput.parentElement.querySelector(".label-input");

    // When focus search input
    whenFocusInput(searchInput, label, ul);

    // When Blur input
    whenBlurInput(searchInput, label, ul, lis);

    // When Write in input
    whenWriteInInput(searchInput, fetchButton, lis)

    // When click li
    whenClickLis(lis, searchInput, ul, fetchButton);

    // Control button search
    whenClickInButtonSearch(searchInput, fetchButton, lis, label, "they-fill", "sales");

    // When Click up down
    whenClickDownUp(searchInput, ul, lis);
});
function salesProcess(response, classNameInput) {
    flashMessage("success", response.message, 5000);

    if (classNameInput === "they-fill-product") {
        const imageProduct = document.getElementById("img-product");

        // Live Change Image
        if (response["Image"] != null) {
            imageProduct.setAttribute("src", response["Image"]);
        }

        // TODO: Show Products depend on categories
    }

    const theyFillInputs = document.querySelectorAll('.' + classNameInput);
    theyFillInputs.forEach(fillInput => {
        fillInput.value =  response[fillInput.name];
        if (fillInput.hasAttribute("to")) fillInput.setAttribute("to", response["ClientId"]);
        fillInput.parentElement.querySelector("label").classList.add("up");
    });
}

/**
 * Summary. fetch data from db
 *
 * Description.
 *  function to fetch data from db and handel it by create
 *  for example we used this function to simplify make fetch items easier for the user;
 *  the user write name product for example and fill all (get all data from db)
 *  data for chosen product in field (Easier than filling them in manually)
 *
 *   @since 2/28/2023
 *   @param {string} controller the name controller you want to go (sales for example)
 *   @param {string} action name action you will to apply
 *          important note (the name action must be contained Ajax word case-sensitive)
 *  @param {string} primaryKey this primary key to select row from db
 *  @param {string} name name value check if is set post method or not (or controller)
 *  @param {string} classNameInput to select input you want to fill (by get all input the same class name)
 *
 *
 *  @return {void} return void value
 *
 *  @author Feras Barahmeh
 *  @version 1.1
 *
 * */
function getInfo(controller, action, primaryKey, name, classNameInput) {
    let xml = new XMLHttpRequest();
    // TODO: update function (separate fill inputs)
    xml.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            let response = JSON.parse(xml.responseText);

            if (response.result === "false" || response.result === false) {
                flashMessage("danger", response.message, 5000);
            } else {
                if (controller === "sales") {
                    salesProcess(response, classNameInput);
                }

            }
        }
    }


    xml.open("POST", "http://estore.local/"+ controller +"/" + action);
    xml.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
    );
    xml.send(`primaryKey=${primaryKey}&name=${name}`);
}





/*
* ----------------------------- Products ------------------------------------
*
* */



// Show Information popup
function whenKeyupFillInput(input, icon) {
    input.addEventListener("keyup", () => {
        if (input.value == null) {
            icon.classList.remove("active");
        } else {
            icon.classList.add("active");
        }
    });
}
function whenBlurFillInput(input, label, icon) {
    input.onblur = () => {

        icon.classList.remove("active");
        label.classList.remove("up")

        if (input.value !== '') {
            label.classList.add("up");
            icon.classList.add("active");
        } else {
            icon.classList.remove("active");
            label.classList.remove("up")
        }
    };
}
function whenClickInfoIcon(icon) {
    if (icon != null) {
        icon.addEventListener("click", () => {
            console.log(icon)
        });
    }
}
function whenFocusInputFill(input, label) {
    input.onfocus = () => {
      // label.classList.add("up");
    };
}
const searchInputsProducts = document.querySelectorAll(".search-input-product");
const theyFillInputs = document.querySelectorAll(".fill-product");
const statisticsPopups = document.querySelectorAll("#statistics-popup");

// Get Products
searchInputsProducts.forEach(searchInputsProduct => {

    let ul = searchInputsProduct.closest(".input-container").querySelector("ul");
    let lis = searchInputsProduct.closest(".input-container").querySelectorAll("li");
    let fetchButton = searchInputsProduct.parentElement.querySelector(".fetch-btn");
    let label = searchInputsProduct.parentElement.querySelector(".label-input");

    // When focus search input
    whenFocusInput(searchInputsProduct, label, ul);

    // When Blur input
    whenBlurInput(searchInputsProduct, label, ul, lis);

    // When Write in input
    whenWriteInInput(searchInputsProduct, fetchButton, lis)

    // When click li
    whenClickLis(lis, searchInputsProduct, ul, fetchButton);

    // Control button search
    whenClickInButtonSearch(searchInputsProduct, fetchButton, lis, label, "they-fill-product", "sales");

    // When Click up down
    whenClickDownUp(searchInputsProduct, ul, lis);
});
theyFillInputs.forEach(theyFillInput => {
    let infoIcon = theyFillInput.parentElement.querySelector(".info-icon");
    let statisticsPopup = theyFillInput.parentElement.querySelector("#statistics-popup");
    let label = theyFillInput.parentElement.querySelector("label");


    whenFocusInputFill(theyFillInput, label)

    whenKeyupFillInput(theyFillInput, infoIcon);

    whenBlurFillInput(theyFillInput, label, infoIcon);

    whenClickInfoIcon(infoIcon);


 });


// Remove Container table Popup
const xButtonContainer = document.getElementById("remove-container-table-popup");

if (xButtonContainer != null) {
    xButtonContainer.addEventListener("click", () => {
        xButtonContainer.closest("#container-table-popup").classList.remove("active");
    });
}


// Nav Popup
const sectionsButtons = document.querySelectorAll(".button-section");



// Switch between sections
sectionsButtons.forEach( sectionsButton => {

    sectionsButton.addEventListener("click", () => {
        if (! sectionsButton.classList.contains("active")) {
            document.querySelectorAll(".container-section").forEach(container => {
                if (container.getAttribute("for") === sectionsButton.getAttribute('id')) {
                    container.classList.add("active");
                    sectionsButton.classList.add("active");
                } else {
                    sectionsButtons.forEach(button => {button.classList.remove("active")});
                    container.classList.remove("active");
                }

            });

            sectionsButton.classList.add("active");
        }
    });
});

// drop down item container
function whenActiveFromAllDropItemButton(dropItemButtons, dropItemButton) {
    dropItemButtons.forEach(button => {
        if (button !== dropItemButton) {
            button.classList.remove("active");
            button.closest(".item").querySelector(".data-item").classList.remove("active");
            button.lastElementChild.classList.remove("angle-rotate");
        } else {
            dropItemButton.classList.toggle("active");
        }
    });
}
const dropItemButtons = document.querySelectorAll(".drop-item");

dropItemButtons.forEach(dropItemButton => {
   dropItemButton.addEventListener("click", (e) => {
       whenActiveFromAllDropItemButton(dropItemButtons, dropItemButton)
       dropItemButton.closest(".item").querySelector(".data-item").classList.toggle("active");

       dropItemButton.lastElementChild.classList.toggle("angle-rotate");
   });
});

// Search in nav popup
const searchNavPopups = document.querySelectorAll(".search-nav-popup");

searchNavPopups.forEach(searchNavPopup => {
   const sectionContainer = searchNavPopup.closest(".container-section");
   const items = sectionContainer.querySelectorAll(".item");


   searchNavPopup.addEventListener("keyup", (e) => {
       const value = searchNavPopup.value.toLowerCase();

       items.forEach(item => {
          let name = item.querySelector("span.name").textContent.toLowerCase();

           if (name.search(value) === -1) {
               item.classList.add("not-found");
           } else {
               item.classList.remove("not-found");
           }


       });
   });
});

// show nav popup
const controlShowNavButton = document.getElementById("show-nav-popup-button");

controlShowNavButton.addEventListener("click", () => {
   const nav = document.getElementById("nav-popup");
   nav.classList.toggle("active");
});

// Close popup nav
const buttonCloseNavPopup = document.getElementById("close-nav");
buttonCloseNavPopup.addEventListener("click", () => {
   buttonCloseNavPopup.closest("#nav-popup").classList.remove("active");
});

// display info product in from nav product section to Product section
const showProductNavButtons = document.querySelectorAll("[for=products-section] .data-item #show-product-nav-button");

showProductNavButtons.forEach(showProductNavButton => {
    showProductNavButton.addEventListener("click", () => {
       getInfo(
   "sales",
            showProductNavButton.getAttribute("action"),
            showProductNavButton.getAttribute("primaryKey"),
            showProductNavButton.getAttribute("name"),
            "they-fill-product"
       );
        buttonCloseNavPopup.click();
    });
});

// hidden nav popup when click out it
document.addEventListener("click", (e) => {
    const popupNav = document.getElementById("nav-popup");

    if (! popupNav.contains(e.target) && ! controlShowNavButton.contains(e.target) ) {
        popupNav.classList.remove("active");
    }

});