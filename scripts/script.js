import van from "./van-1.5.2.min.js";

const { div, img, span, button } = van.tags;

/**
 * 
 * @param {HTMLInputElement} fileInput 
 * @returns 
 */
const UploadField = (fileInput) => {
    const filled = van.state(true)
    const imgSrc = van.state(null)

    function update() {
        filled.val = fileInput.files.length !== 0;
        if (filled.val) {
            if (imgSrc.val) {
                URL.revokeObjectURL(imgSrc.val)
            }
            imgSrc.val = URL.createObjectURL(fileInput.files[0])
        }
    }

    update();
    fileInput.addEventListener("change", (ev) => {
        update();
    })

    function dispatchUpdate() {
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        fileInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    return [
        div({
            class: "upload-field txt-6",
            ondrop: (ev) => {
                ev.preventDefault();
                fileInput.files = ev.dataTransfer.files;
                dispatchUpdate();
            },
            ondragover: (ev) => ev.preventDefault(),
            onclick: (ev) => {
                if (ev.target instanceof HTMLButtonElement) {
                    return;
                }
                fileInput.click();
            }
        },
            () => filled.val
                ? div(
                    img({ src: imgSrc.val }),
                    button({
                        class: "btn-sm txt-7",
                        onclick: () => {
                            fileInput.value = null;
                            dispatchUpdate();
                        }

                    }, "Remove image"),
                    button({
                        class: "btn-sm txt-7",
                        onclick: () => fileInput.click()
                    },
                        "Change image"
                    )
                )
                : div(
                    div({ class: "upload-field-icon" },
                        span({
                            class: "icon-upload",
                            style: "width: 30px; height: 30px"
                        }),
                    ),
                    span(
                        "Drag and drop or click to upload",
                    )
                )

        ),
        div({ class: "hint" },
            div({class:"hint-icon"},
                span({ class: "icon-info" }),
            ),
            div(
                {class:"hint-text txt-7"},
                "Upload your photo (JPG or PNG, max size: 500KB).",
            ),
        )
    ]
}

customElements.define("upload-field", class extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        const fileInput = document.querySelector('input[type="file"]')
        van.add(this, UploadField(fileInput))
    }
})

document.querySelector("form").addEventListener("submit", (ev) => {
    ev.preventDefault();

    const nameInput = document.querySelector("input#name-input");
    const emailInput = document.querySelector("input#email-input");
    const githubInput = document.querySelector("input#github-input");

    for (const name of document.querySelectorAll(".result-name")) {
        name.innerHTML = nameInput.value;
    }

    document.querySelector(".result-email").innerHTML = emailInput.value;
    document.querySelector(".result-github").innerHTML = githubInput.value;

    const starter = document.querySelector("#start");
    starter.classList.add("hidden");

    const ticketGenerated = document.querySelector("#ticket-generated");
    ticketGenerated.classList.remove("hidden");
});