// Switch Main nav
const menuSwitch    = document.getElementById("menu-switch");
const mainNav       = document.getElementById("main_navigation");
const conditionMenu = menuSwitch.getAttribute("data-condition-menu");
const actionView    = document.getElementById("action-view");


menuSwitch.addEventListener("click", () => {
    mainNav.classList.toggle("hidden");
    menuSwitch.classList.toggle("rout-90");
    mainNav.classList.remove("hidden-mobile");
    actionView.parentElement.classList.toggle("grid");
});

// Show Drop Down Menu
const dropDown  = document.getElementById("drop-down");
const menu      = dropDown.querySelector("#menu");

dropDown.addEventListener("click", () => {
    menu.classList.toggle("visible");

});

// Start navigation Bar
    function hiddenSearchIcon(inputSearch) {
        inputSearch.onfocus = () => {
            inputSearch.parentElement.querySelector(".search-icon").classList.add("un-visible");
        }
        inputSearch.onblur = () => {
            inputSearch.parentElement.querySelector(".search-icon").classList.remove("un-visible");
        }
    }

    function hiddenMainLi(li, contentInput) {

        const links = li.querySelectorAll("a");
        links.forEach(link => {
           const content = link.textContent.toLowerCase();
           if (content.search(contentInput) === -1) {
               li.classList.add("un-visible");
           } else {
               li.classList.remove("un-visible");
           }
        });
    }
    function hiddenSubMenu(li, contentInput, subMenu) {
        subMenu.classList.remove("un-visible")
        const as = li.querySelectorAll("a");
        const button = subMenu.closest("li").querySelector("button");
        const span = button.querySelector("span");

        as.forEach(link => {
            const buttonContent = span.innerText.toLowerCase();
            const content = link.textContent.toLowerCase() + buttonContent;

            if (content.search(contentInput) === -1 ) {
                li.classList.add("un-visible");
                subMenu.closest(".main-li").classList.add("un-visible");
            } else {
                li.classList.remove("un-visible");
                subMenu.closest(".main-li").classList.remove("un-visible");
            }
        });
    }
    function hiddenGrandLi(li, contentInput) {
        const lis = li.querySelectorAll(".li-level-2");
        let counter = 0;
        const subMenu = li.querySelector(".sub-menu");
        const numChild = subMenu.childElementCount;

        lis.forEach(li => {
            hiddenSubMenu(li, contentInput, subMenu);
            if (li.classList.contains("un-visible")) {
                counter++;
            }

            if (counter === numChild) {
                subMenu.classList.add("un-visible");
            } else {
                subMenu.classList.remove("un-visible");
            }

        });
    }

    // Hidden icon search when focus in input field search session
    const inputSearch = document.getElementById("search-session");

    if (inputSearch !== null) {

        hiddenSearchIcon(inputSearch);

        // Search In Sessions
        const appNav    = document.getElementById("app_navigation");
        const lis  = appNav.querySelectorAll("li.main-li");

        inputSearch.addEventListener("keyup", () => {
           const contentInput = inputSearch.value.toLowerCase();

           lis.forEach(li => {
                if (! li.classList.contains("grand-li")) {
                    hiddenMainLi(li, contentInput);
                } else {
                    hiddenGrandLi(li, contentInput);
                }
           });
        });
    }

    // Hidden SubMenu
    const grandLis = document.querySelectorAll(".grand-li");

    grandLis.forEach(grandLi =>  {
       grandLi.addEventListener('click', () => {
          grandLi.querySelector(".sub-menu").classList.toggle('un-visible');
          grandLi.querySelector(".angle").classList.toggle("angle-rotate");
       });
    });



// Remove Message Tip
function finishedMessage() {
    document.querySelectorAll(".message").forEach(mass => {
        mass.classList.add("finished");
    });
}
setTimeout(finishedMessage, 5000);


// Ajax Get Messages

/**
 * @todo Update function to accept multi files
 * this function to get words messages in multi-language
 *
 * How Use it this function ?
 *
 * getMessage(controllerName, action, nameFile).then((result)=>
 *      // Do What you want
 * );
 *
 * @param controller determine the controller you want fetch data from
 * @param action the action method name this method must include `Ajax` word to
 * @param nameFile the file name you want load for example "template.common" where template name folder and common name file
 *
 *
 * @return Promise object
 * @version 1.0
 * @author Feras Barahmeh
 *
 * */
const getMessages = (controller, action, nameFile) => {
    return new Promise((resolve, reject) => {
        let xml = new XMLHttpRequest();

        xml.onload = function () {
            if (this.readyState === 4 && this.status === 200) {
                resolve(JSON.parse(xml.responseText));
            } else {
                reject(Error("File name not valid"));
            }
        }


        xml.open("POST", "http://estore.local/"+ controller +"/" + action);
        xml.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        xml.send(`nameFile=${nameFile}`);

    });
};


// fingerprint section in add invoices

// Active set discount value section is chosen

/**
 *
 * Description function to active discount section depend on type discount
 *
 * @param {Object} activeButton the input type clicked set is active value
 * @param {Object} disabledButton un active value discount
 * @param {Object} activeContainer the input we will set the value by the type chosen in clicked button
 * @param {Object} disabledContainer the input we will un set the value by the type chosen in clicked button
 *
 * */
function activeAddDiscountSection(activeButton, disabledButton, activeContainer, disabledContainer) {
    activeButton.addEventListener("click", (e) => {
        if (activeButton.contains(e.target) && activeButton.checked === false) {

            activeButton.checked = false;
            activeContainer.classList.remove("active");
            activeContainer.querySelector("input").value = '0';
            inputTotalPrice.value = fetchPriceCard();
        } else {
            activeContainer.classList.add("active");
            activeContainer.querySelector("input").focus();

            // remove all active inputs containers
            disabledButton.checked = false;
            disabledContainer.classList.remove("active");
            disabledContainer.querySelector("input").value = '0';
            inputTotalPrice.value = fetchPriceCard();
        }
    });
}
function calcDiscountTotalPrice(price) {
    let discount;
    if (ifSetDiscount()) {

        discount = inputContainerDiscountPercentage.querySelector("input");
        if (parseFloat(discount.value) > 0) {
            price -= price * discount.value / 100;
            price = price <= 0 || discount.value === '' ? 0 : price;
        }
        discount = inputContainerValuePercentage.querySelector("input");
        if (parseFloat(discount.value) > 0) {
            price -= parseFloat(discount.value);
            price = price <= 0 || discount.value === '' ? 0 : price;
        }
    }

    return price;
}
const discountPercentageButton  = document.querySelector("[discount-percentage=percentage]");
const discountValueButton       = document.querySelector("[discount-value=value]");
const inputContainerDiscountPercentage = document.querySelector("[discount-percentage-input]");
const inputContainerValuePercentage = document.querySelector("[discount-value-input]");


// Active Percentage Discount
activeAddDiscountSection(
    discountPercentageButton,
    discountValueButton,
    inputContainerDiscountPercentage,
    inputContainerValuePercentage,
);

// Active Value Discount
activeAddDiscountSection(
    discountValueButton,
    discountPercentageButton,
    inputContainerValuePercentage,
    inputContainerDiscountPercentage,
);

function fetchPriceCard() {
    let rows = cartTable.querySelectorAll("tbody tr");
    let sellPrice = 0;
    let tax = 0;
    let quantity = 0;
    let price = 0;

    if (rows.length > 1) { //  1 is image row
        rows.forEach(row => {
            if (! row.classList.contains("img")) {
                let tds = row.querySelectorAll("td");
                tds.forEach(td => {
                    if (td.hasAttribute("sellprice"))
                        sellPrice = parseFloat(td.getAttribute("sellprice"));
                    if (td.hasAttribute("tax"))
                        tax = parseFloat(td.getAttribute("tax"));
                    if (td.hasAttribute("quantitychoose"))
                        quantity = parseFloat(td.getAttribute("quantitychoose"));
                });
                price += ((sellPrice * quantity) + (tax * sellPrice));
                quantity = 0; tax = 0; sellPrice = 0;
            }
        });

    } else {
        flashMessage("warning", "No products in cart", 5000);
    }

    return calcDiscountTotalPrice(price);
}
function liveCalculateDiscountPercentage() {
    inputContainerDiscountPercentage.querySelector("input").addEventListener("input", (e) => {
        inputTotalPrice.value = '';
        inputTotalPrice.value = fetchPriceCard()
    });
    inputContainerValuePercentage.querySelector("input").addEventListener("input", (e) => {
        inputTotalPrice.value = '';
        inputTotalPrice.value = fetchPriceCard();
    });
}
liveCalculateDiscountPercentage();
// Remove product from
function removeProductFromCart(button) {
    button.addEventListener("click", () => {
        button.closest("tr").remove();
    });
}
const removeTrProducts = document.querySelectorAll("#remove-td-product");
removeTrProducts.forEach(removeTrProduct => {
    removeProductFromCart(removeTrProduct);
});
function addEmptyCartImage(table) {
    const imgEmptyCart = table.querySelector(".empty-cart-image");
    const trImage = imgEmptyCart.closest("tr");
    const parentTable = table.parentElement;
    if (table.querySelector("tbody").childElementCount <= 1) {
        trImage.classList.remove("hidden");
        imgEmptyCart.classList.add("active");
        parentTable.classList.remove("responsive-table");
    } else {
        trImage.classList.add("hidden");
        imgEmptyCart.classList.remove("active");
        parentTable.classList.add("responsive-table");
    }
}

// Add Info To cart Table

function fetchDataInvolves() {
    let result = {};
    const dataInvolves = document.querySelectorAll(".data-involves");
    dataInvolves.forEach(dataInvolve => {
        const to = dataInvolve.getAttribute("to");
        result[to] = [];

        const inputs = dataInvolve.querySelectorAll("input");
        inputs.forEach(input => {
            if (input.value === '' ){
                flashMessage("danger",
                    `Can't filed <b class="bold-font"> ${input.getAttribute("name")}</b> Be Empty Filed`,
                    5000);
                return false;
            }
            result[to].push(JSON.parse(`{"${input.getAttribute("name")}":"${input.value}"   }`));

        });
    });

    return result;
}
function createRow(details) {
    let tr = document.createElement("tr");

    for (const detailsKey in details) {
        let count = 0;
        for (const detailKey of details[detailsKey]) {
            let td = document.createElement("td");

            if (count === 0) {
                if (detailsKey === "transactionParty") {
                    td.setAttribute("no-change", '');
                } else if (detailsKey === "involves") {
                    td.setAttribute("no-repeat", '');
                }
            }
            count++;
            td.setAttribute("infoTo", detailsKey);
            let values = Object.entries(detailKey)[0];
            // This Line to simplify live calculate discount 
            td.setAttribute(values[0], values[1]);

            td.innerHTML = values[1];
            tr.appendChild(td);
        }
    }
    let button = document.createElement("button");
    button.classList.add("danger-color");
    button.classList.add("no-bg");
    button.classList.add("cursor-pointer");
    button.setAttribute("id", "remove-td-product");

    let i = document.createElement('i');
    i.classList.add('fa');
    i.classList.add("fa-trash");

    removeProductFromCart(button);
    button.appendChild(i);


    let td = document.createElement("td");
    td.appendChild(button);
    tr.appendChild(td);


    return tr;
}
function emptyInvolvesInputs() {
    const involvesInputs  = document.querySelector("[to=involves]").querySelectorAll("input");
    involvesInputs.forEach(input => {
        input.value = '';
        input.parentElement.querySelector("label").classList.remove("up");
    });

}
function addToCartButtonActive() {
    const fieldsSectionOneInputs        = document.querySelector("[to=transactionParty]").querySelectorAll("input");
    const fieldsSectionTowInputsInputs  = document.querySelector("[to=involves]").querySelectorAll("input");

    let flag = true;

    fieldsSectionOneInputs.forEach(input => {
       if (input.value === '')  {
           flag = false;
       }
    });
    fieldsSectionTowInputsInputs.forEach(input => {
       if (input.value === '')  {
           flag = false;
       }
    });

    return flag;

}
function checkIfValidInvolves(tBody, details, newRow) {

    let flag = true;
    const noRepeatedTd = newRow.querySelectorAll("[no-repeat]");

    if (tBody.children.length >= 2) {
        const trs = tBody.querySelectorAll("tr");

        let content = [];
        let noChange = [];
        trs.forEach(tr => {
            if (! tr.classList.contains("img")) {
                tr.querySelectorAll("[no-repeat]").forEach(td => {
                    content.push(td.textContent);
                });
                tr.querySelectorAll("[no-change]").forEach(td => {
                    noChange.push(td.textContent);
                });
            }
        });


        noRepeatedTd.forEach(td => {
            if (content.includes(td.textContent)) {
                flag = false;
                flashMessage("danger", `Can't repeat ${td.textContent}`, 5000);
            }

            if (noChange[0] !== newRow.querySelector("[no-change]").textContent) {
                flag = false;
                flashMessage("danger", `Can't change client in the same involves`, 5000);
            }
        });
    } else {
        tBody.querySelector(".img").classList.add("hidden");
    }

    return flag;
}
function ifSetDiscount() {
    return discountPercentageButton.checked === true || discountValueButton.checked === true;
}
function setCurrentPrice() {
    currentPrice = fetchPriceCard();
}
function changeTotalPrice() {
    setCurrentPrice();
    inputTotalPrice.value = currentPrice.toString();
}
function setNumberProducts(table) {
    document.getElementById("total-products").value = table.children.length - 1; // -1 the row empty image
}
const addToCartButton = document.getElementById("add-to-cart-button");
const cartTable = document.querySelector(".products-carts-table");
const tBodyCartTable = cartTable.querySelector("tbody");
const inputTotalPrice = document.getElementById("total-price");
let currentPrice = 0;
addEmptyCartImage(cartTable)

addToCartButton.addEventListener("click", () => {

    if (addToCartButtonActive(addToCartButton) === true) {
        const details = fetchDataInvolves();

        const newRow = createRow(details);

        if (checkIfValidInvolves(tBodyCartTable, details, newRow)) {
            tBodyCartTable.appendChild(newRow);
            emptyInvolvesInputs();
            changeTotalPrice();
            setNumberProducts(tBodyCartTable);
        }

    } else {
        flashMessage("warning", "all information is required", 5000);
    }

});