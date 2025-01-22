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
 * @property {State<File?>} avatar
 * @property {State<string?>} avatarURL
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
 * @param {string} prop.name
 * @param {string} prop.email
 * @param {string} prop.github
*/


/**
 * @returns {HTMLDivElement}
 */
function App() {


    /** @type {State<File?>} */
    const avatar = van.state(null);
    /** @type {State<("empty"|"tooBig")?>} */
    const avatarError = van.derive(() => {

        if (!avatar.val) {
            return "empty";
        }

        if (avatar.val.size > 500 * 1024) {
            return "tooBig";
        }

        return null;
    })
    const avatarURL = van.derive(() => {
        if (avatar.val) {
            return URL.createObjectURL(avatar.val);
        }

        return null;
    });
    van.derive(() => {
        if (avatarURL.oldVal) {
            URL.revokeObjectURL(avatarURL.oldVal)
        }
    })

    /** @type {State<string?>} */
    const name = van.state(null);
    const nameError = van.derive(() => {
        if (name.val) {
            return null;
        }

        return "empty";
    });

    /** @type {State<string?>} */
    const email = van.state(null);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const emailError = van.derive(() => {
        if (email.val && emailRegex.exec(email.val)) {
            return null;
        }

        return "invalid";
    })

    /** @type {State<string?>} */
    const github = van.state(null);
    const githubError = van.derive(() => {
        if (github.val) {
            return null;
        }

        return "empty";
    });

    /** @type {States} */
    const states = {
        avatar, avatarError, avatarURL, name, nameError,
        email, emailError, github, githubError,

        generateTicket: function ({ name, email, github }) {
            this.name.val = name;
            this.email.val = email;
            this.github.val = github;
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
        placeholder: " ", required: true,
        onchange: (e) => {
            /** @type {HTMLInputElement} */
            const input = e.currentTarget;
            input.classList.add("changed");
            input.onchange = null;
        }
    });
    const emailInput = input({
        type: "email", id: "email-input", class: "txt-6",
        placeholder: "example@email.com", required: true,
        onchange: (e) => {
            /** @type {HTMLInputElement} */
            const input = e.currentTarget;
            input.classList.add("changed");
            input.onchange = null;
        }
    });
    const githubInput = input({
        type: "text", id: "github-input", class: "txt-6",
        placeholder: "@yourusername", required: true
    });

    /**
     * @param {Event} e
     */
    function onFormSubmit(e) {
        e.preventDefault();
        states.generateTicket({
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
            { onsubmit: onFormSubmit },
            div(
                label({ for: "#avatar-input" },
                    "Upload Avatar",
                ),
                UploadField(states),
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
                    img({ src: states.avatarURL, alt: "avatar" }),
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
 * @param {States} states 
 * @returns 
 */
function UploadField(states) {

    const fileInput = input({
        type: "file", id: "input-avatar",
        accept: "image/png, image/jpeg", required: true
    });



    fileInput.addEventListener("change", (ev) => {
        const file = fileInput.files?.[0];
        states.avatar.val = file ? file : null;
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
            () => states.avatar.val
                ? div(
                    img({ src: states.avatarURL.val, class: 'preview' }),
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
                span({ class: () => states.avatarError.val === "tooBig" ? "icon-info-danger" : "icon-info" }),
            ),
            () => {
                if (states.avatarError.val === "tooBig") {
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