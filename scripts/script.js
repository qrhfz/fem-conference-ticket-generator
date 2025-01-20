// @ts-check
import van from "./van-1.5.2.min.js";

/**
 * @import {State} from './van-1.5.2.min.js'
 */

const { div, img, span, button, h1, p, form, label, input } = van.tags;

// @ts-ignore
van.add(document.querySelector("#app"), App());


/**
 * @typedef {Object} Airline 
 * @property {String} airline
 * @property {String} iataCode
 * @property {Array} bookings The array of bookings
 * @property {(flightNum: number, name: string) => void} book Book a seat on a flight
 */

/**
 * @typedef {object} States
 * @property {State<string?>} avatar
 * @property {State<("tooBig"|"empty")?>} avatarError
 * @property {State<string?>} name
 * @property {State<"empty"?>} nameError
 * @property {State<string?>} email
 * @property {State<"invalid"?>} emailError
 * @property {State<string?>} github
 * @property {State<"empty"?>} githubError
 * @property {GenerateTicketFn} generateTicket
 */

/**
 * @callback GenerateTicketFn
 * @param {object} prop
 * @param {string} prop.avatarImgSrc
 * @param {string} prop.name
 * @param {string} prop.email
 * @param {string} prop.github
*/


/**
 * @returns {HTMLDivElement}
 */
function App() {

    /** @type {States} */
    const states = {
        avatar: van.state(null), avatarError: van.state(null),
        name: van.state(null), nameError: van.state(null),
        email: van.state(null), emailError: van.state(null),
        github: van.state(null), githubError: van.state(null),

        generateTicket: function ({ avatarImgSrc, name, email, github }) {
            this.avatar.val = avatarImgSrc;
            this.name.val = name;
            this.nameError.val = (name.length === 0) ? "empty" : null;
            this.email.val = email;
            this.github.val = github;
            this.githubError.val = (github.length === 0) ? "empty" : null;
        }
    }

    const hasTicket = van.derive(() => {
        return states.name.val
            && states.avatar.val
            && states.email.val
            && states.github.val
            && (states.nameError.val === null)
            && (states.avatarError.val === null)
            && (states.emailError.val === null)
            && (states.githubError.val === null);
    });

    return div(() => hasTicket.val ? TicketGeneratedSection(states) : StartSection(states));
}

/**
 * @param {States} states 
 * @returns 
 */
function StartSection(states) {
    const nameInput = input({
        type: "text", id: "name-input", class: "txt-6",
        placeholder: " ", required: true
    });
    const emailInput = input({
        type: "email", id: "email-input", class: "txt-6",
        placeholder: "example@email.com", required: true
    });
    const githubInput = input({
        type: "text", id: "github-input", class: "txt-6",
        placeholder: "@yourusername", required: true
    });
    /** @type {State<string>} */
    const avatarImgSrc = van.state("");
    /**
     * @param {Event} e
     */
    function onFormInput(e) {
        e.preventDefault();
        states.generateTicket({
            avatarImgSrc: avatarImgSrc.val,
            name: nameInput.value,
            github: githubInput.value,
            email: emailInput.value,
        })
    }

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
            { onsubmit: onFormInput },
            div(
                label({ for: "#avatar-input" },
                    "Upload Avatar",
                ),
                UploadField(avatarImgSrc),
            ),
            div(
                label({ for: "#name-input" },
                    "Full Name",
                ),
                nameInput,
            ),
            div(
                label({ for: "#email-input" },
                    "Email Address",
                ),
                emailInput,
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
                githubInput,
            ),
            button({ type: "submit", class: "btn-prim txt-5x" },
                "Generate My Ticket",
            ),
        ),
    )
}
/**
 * 
 * @param {States} states 
 * @returns 
 */
function TicketGeneratedSection(states) {
    return div({ id: "ticket-generated" },
        div({ class: "container txt-center mb-8" },
            span({ class: "txt-1" },
                "Congrats, ",
                span({ class: "result-name txt-grad-1" },
                    states.name.val,
                ),
                "! Your ticket is ready.",
            ),
        ),
        div({ class: "container txt-center txt-4 mb-13" },
            "We've emailed your ticket to ",
            span({ class: "result-email txt-orange-500" },
                states.email.val,
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
                    img({ src: states.avatar.val, alt: "avatar" }),
                ),
                div({ class: "result-name name txt-4" },
                    states.name.val,
                ),
                div({ class: "github" },
                    span({ class: "icon-github mr-1" }),
                    span({ class: "result-github" },
                        `@${states.github.val}`,
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
/**
 * 
 * @param {State<string?>} imgSrc 
 * @returns 
 */
function UploadField(imgSrc) {

    const fileInput = input({ type: "file", id: "input-avatar", accept: "image/png, image/jpeg" });
    const filled = van.state(true);


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