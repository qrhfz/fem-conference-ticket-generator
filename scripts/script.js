// @ts-check
import van from "./van-1.5.2.min.js";

/**
 * @import {State} from './van-1.5.2.min.js'
 */

const { div, img, span, button, h1, p, form, label, input } = van.tags;

// @ts-ignore
van.add(document.querySelector("#app"), App());

function App() {
    /**
     * @type {State<string?>}}
     */
    const avatar = van.state(null);
    /**
     * @type {State<("tooBig"|"empty")?>}}
     */
    const avatarError = van.state(null);
    /**
     * @type {State<string?>}}
     */
    const name = van.state();
    /**
     * @type {State<"empty"?>}}
     */
    const nameError = van.state();
    /**
     * @type {State<string?>}}
     */
    const email = van.state();
    /**
     * @type {State<"invalid"?>}}
     */
    const emailError = van.state();
    /**
     * @type {State<string?>}}
     */
    const github = van.state();
    /**
    * @type {State<"empty"?>}}
    */
    const githubError = van.state();


    const hasTicket = van.state(true);

    return div(() => hasTicket.val ? StartSection() : TicketGeneratedSection())
}


function StartSection() {
    return div({ id: "start" },
        div({ class: "container txt-center mb-10" },
            h1({ class: "txt txt-1", style: "margin-bottom: 1.25rem;" },
                "Your Journey to Coding Conf 2025 Starts Here!",
            ),
            p({ class: "txt-4" },
                "Secure your spot at next year's biggest coding conference.",
            ),
        ),
        form(
            {onclick:e=>e.preventDefault()},
            div(
                label({ for: "#avatar-input" },
                    "Upload Avatar",
                ),
                UploadField(),
            ),
            div(
                label({ for: "#name-input" },
                    "Full Name",
                ),
                input({ type: "text", id: "name-input", class: "txt-6", placeholder:" ", required:true }),
            ),
            div(
                label({ for: "#email-input" },
                    "Email Address",
                ),
                input({ type: "email", id: "email-input", class: "txt-6", placeholder: "example@email.com", required:true }),
                div({ class: "hint txt-orange-500 mt-4" },
                    div({ class: "hint-icon" },
                        span({ class: "icon-info-danger" }),
                    ),
                    div({ class: "hint-text" },
                        "Please enter a valid email address.",
                    ),
                ),
            ),
            div(
                label({ for: "#github-input" },
                    "GitHub Username",
                ),
                input({ type: "text", id: "github-input", class: "txt-6", placeholder: "@yourusername", required: true }),
            ),
            button({ type: "submit", class: "btn-prim txt-5x" },
                "Generate My Ticket",
            ),
        ),
    )
}

function TicketGeneratedSection() {
    return div({ id: "ticket-generated" },
        div({ class: "container txt-center mb-8" },
            span({ class: "txt-1" },
                "Congrats, ",
                span({ class: "result-name txt-grad-1" },
                    "[Full Name Motherfucker]",
                ),
                "! Your ticket is ready.",
            ),
        ),
        div({ class: "container txt-center txt-4 mb-13" },
            "We've emailed your ticket to ",
            span({ class: "result-email txt-orange-500" },
                "[Email Address]",
            ),
            " and will send updates in the run up to the event.",
        ),
        div({ class: "ticket" },
            div({ class: "event-info" },
                div({ class: "logo-wrapper" },
                    img({ src: "/assets/images/logo-mark.svg", alt: "logo" }),
                ),
                div({ class: "event-name txt-2" },
                    "Coding Conf",
                ),
                div({ class: "date txt-6" },
                    "Jan 31, 2025 / Austin, TX",
                ),
            ),
            div({ class: "attendee-info" },
                div({ class: "avatar" },
                    img({ src: "/assets/images/image-avatar.jpg", alt: "avatar" }),
                ),
                div({ class: "result-name name txt-4" },
                    "[Full Name]",
                ),
                div({ class: "github" },
                    span({ class: "icon-github mr-1" }),
                    span({ class: "result-github" },
                        "@[github]",
                    ),
                ),
            ),
            div({ class: "ticket-number" },
                div({ class: "txt-3 txt-neutral-500" },
                    "#01609",
                ),
            ),
        ),
    )
}

function UploadField() {

    const fileInput = input({ type: "file", id: "input-avatar", accept: "image/png, image/jpeg" });
    const filled = van.state(true);

    /**
     * @type {State<string|null>}
     */
    const imgSrc = van.state(null);
    const fileTooBigError = van.state(false);

    function update() {
        filled.val = fileInput.files?.length !== 0;
        const file = fileInput.files?.[0];
        if (filled.val) {
            if (imgSrc.val) {
                URL.revokeObjectURL(imgSrc.val);
                fileTooBigError.val = false;
            }

            if (file) {
                imgSrc.val = URL.createObjectURL(file);

                if (file.size > 500 * 1024) {
                    fileTooBigError.val = true;
                }
            }
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
                    img({ src: imgSrc.val, class: 'preview' }),
                    button({
                        class: "btn-sec txt-7",
                        type: "button",
                        onclick: () => {
                            fileInput.value = "";
                            dispatchUpdate();
                        }

                    }, "Remove image"),
                    button({
                        class: "btn-sec txt-7",
                        type: "button",
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
            div({ class: "hint-icon" },
                span({ class: () => fileTooBigError.val ? "icon-info-danger" : "icon-info" }),
            ),
            () => {
                if (fileTooBigError.val) {
                    return div(
                        { class: "hint-text txt-7 txt-orange-500" },
                        "File too large. Please upload a photo under 500KB.",
                    )
                }

                return div(
                    { class: "hint-text txt-7" },
                    "Upload your photo (JPG or PNG, max size: 500KB).",
                )
            },
        )
    ]
}