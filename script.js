/* =========================================================
   EKITI STATE WOMEN OF INFLUENCE
   ADO LOCAL GOVERNMENT
   MULTI-PAGE WEBSITE
========================================================= */


/* =========================================================
   ADMIN LOGIN
========================================================= */

/*
    DEMO LOGIN

    Username: admin
    Password: admin123

    IMPORTANT:
    This is only a frontend prototype.
    It is NOT secure authentication.
*/

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";


/* =========================================================
   WARDS
========================================================= */

const wards = Array.from(
    { length: 13 },
    (_, index) => ({
        number: index + 1,
        name: `Ward ${index + 1}`
    })
);


/* =========================================================
   EXCO POSITIONS
========================================================= */

const excoPositions = [

    "Chairperson",

    "Vice Chairperson",

    "Secretary",

    "Assistant Secretary",

    "Treasurer",

    "Public Relations Officer",

    "Welfare Officer",

    "Organising Secretary"

];


/* =========================================================
   STORAGE
========================================================= */

function getRegistrations() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "eswiRegistrations"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Could not load registrations:",
            error
        );

        return [];

    }
}


function saveRegistrations(
    registrations
) {

    localStorage.setItem(
        "eswiRegistrations",
        JSON.stringify(registrations)
    );

}


function getExcos() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "eswiExcos"
            )
        ) || {};

    } catch (error) {

        console.error(
            "Could not load EXCO data:",
            error
        );

        return {};

    }
}


function saveExcos(excos) {

    localStorage.setItem(
        "eswiExcos",
        JSON.stringify(excos)
    );

}


/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initializeMenu() {

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );

    const navMenu =
        document.getElementById(
            "navMenu"
        );


    if (
        !menuBtn ||
        !navMenu
    ) {

        return;

    }


    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "active"
            );

        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove(
                        "active"
                    );

                }
            );

        });

}


/* =========================================================
   PUBLIC MEMBER COUNT
========================================================= */

function updatePublicMemberCount() {

    const counter =
        document.getElementById(
            "publicMemberCount"
        );


    if (!counter) {

        return;

    }


    const accepted =
        getRegistrations()
            .filter(
                member =>
                    member.status ===
                    "accepted"
            );


    counter.textContent =
        accepted.length;

}


/* =========================================================
   CREATE WARD CARDS
========================================================= */

function createWardCards() {

    const wardGrid =
        document.getElementById(
            "wardGrid"
        );


    if (!wardGrid) {

        return;

    }


    wardGrid.innerHTML = "";


    wards.forEach(
        ward => {

            const card =
                document.createElement(
                    "a"
                );


            card.className =
                "ward-card";


            card.href =
                `ward.html?ward=${ward.number}`;


            card.innerHTML = `

                <div class="ward-number">
                    ${ward.number}
                </div>

                <h3>
                    ${ward.name}
                </h3>

                <p>
                    View ward →
                </p>

            `;


            wardGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   POPULATE REGISTRATION WARD SELECT
========================================================= */

function populateWardSelect() {

    const select =
        document.getElementById(
            "wardSelect"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select your ward
        </option>

    `;


    wards.forEach(
        ward => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                ward.number;


            option.textContent =
                ward.name;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   REGISTRATION FORM
========================================================= */

function initializeRegistration() {

    const form =
        document.getElementById(
            "registrationForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const fullName =
                document
                    .getElementById(
                        "fullName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();


            const ward =
                document
                    .getElementById(
                        "wardSelect"
                    )
                    .value;


            const occupation =
                document
                    .getElementById(
                        "occupation"
                    )
                    .value
                    .trim();


            const role =
                document
                    .getElementById(
                        "role"
                    )
                    .value;


            const message =
                document
                    .getElementById(
                        "message"
                    )
                    .value
                    .trim();


            const emailElement =
                document.getElementById(
                    "email"
                );


            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";


            const formMessage =
                document.getElementById(
                    "formMessage"
                );


            if (
                !fullName ||
                !phone ||
                !ward
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Please complete your full name, phone number and ward.";

                    formMessage.style.color =
                        "#dc2626";

                }

                return;

            }


            const registrations =
                getRegistrations();


            const registration = {

                id:
                    Date.now(),

                fullName:
                    fullName,

                phone:
                    phone,

                email:
                    email,

                ward:
                    ward,

                occupation:
                    occupation,

                role:
                    role,

                message:
                    message,

                status:
                    "pending",

                date:
                    new Date()
                        .toLocaleString(),

                reviewedAt:
                    null

            };


            registrations.push(
                registration
            );


            saveRegistrations(
                registrations
            );


            if (formMessage) {

                formMessage.textContent =
                    "Registration submitted successfully. Your application is awaiting admin approval.";

                formMessage.style.color =
                    "#16a34a";

            }


            form.reset();

        }
    );

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function initializeAdminLogin() {

    const loginButton =
        document.getElementById(
            "adminLoginBtn"
        );


    if (!loginButton) {

        return;

    }


    loginButton.addEventListener(
        "click",
        loginAdmin
    );


    const passwordInput =
        document.getElementById(
            "adminPassword"
        );


    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    loginAdmin();

                }

            }
        );

    }

}


/* =========================================================
   LOGIN ADMIN
========================================================= */

function loginAdmin() {

    const username =
        document
            .getElementById(
                "adminUsername"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "adminPassword"
            )
            .value;


    const message =
        document.getElementById(
            "adminLoginMessage"
        );


    if (
        username ===
        ADMIN_USERNAME &&
        password ===
        ADMIN_PASSWORD
    ) {

        sessionStorage.setItem(
            "eswiAdminLoggedIn",
            "true"
        );


        showAdminDashboard();


        if (message) {

            message.textContent =
                "";

        }

    } else {

        if (message) {

            message.textContent =
                "Invalid administrator username or password.";

            message.style.color =
                "#dc2626";

        }

    }

}


/* =========================================================
   SHOW ADMIN DASHBOARD
========================================================= */

function showAdminDashboard() {

    const login =
        document.getElementById(
            "adminLogin"
        );


    const dashboard =
        document.getElementById(
            "adminDashboard"
        );


    if (login) {

        login.style.display =
            "none";

    }


    if (dashboard) {

        dashboard.classList.add(
            "active"
        );

        dashboard.style.display =
            "block";

    }


    loadAdminDashboard();

}


/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

function checkAdminSession() {

    const loggedIn =
        sessionStorage.getItem(
            "eswiAdminLoggedIn"
        );


    if (
        loggedIn ===
        "true"
    ) {

        showAdminDashboard();

    }

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

function initializeAdminLogout() {

    const logoutButton =
        document.getElementById(
            "adminLogoutBtn"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "eswiAdminLoggedIn"
            );


            const dashboard =
                document.getElementById(
                    "adminDashboard"
                );


            const login =
                document.getElementById(
                    "adminLogin"
                );


            if (dashboard) {

                dashboard.classList.remove(
                    "active"
                );

                dashboard.style.display =
                    "none";

            }


            if (login) {

                login.style.display =
                    "block";

            }

        }
    );

}


/* =========================================================
   ADMIN WARD FILTERS
========================================================= */

function populateAdminFilters() {

    const wardFilter =
        document.getElementById(
            "adminWardFilter"
        );


    const excoWard =
        document.getElementById(
            "excoWardSelect"
        );


    if (wardFilter) {

        wardFilter.innerHTML = `

            <option value="all">
                All Wards
            </option>

        `;


        wards.forEach(
            ward => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    ward.number;


                option.textContent =
                    ward.name;


                wardFilter.appendChild(
                    option
                );

            }
        );


        wardFilter.addEventListener(
            "change",
            renderAdminRegistrations
        );

    }


    if (excoWard) {

        excoWard.innerHTML = `

            <option value="">
                Select Ward
            </option>

        `;


        wards.forEach(
            ward => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    ward.number;


                option.textContent =
                    ward.name;


                excoWard.appendChild(
                    option
                );

            }
        );


        excoWard.addEventListener(
            "change",
            renderExcoManager
        );

    }

}


/* =========================================================
   LOAD ADMIN DASHBOARD
========================================================= */

function loadAdminDashboard() {

    populateAdminFilters();

    updateAdminStats();

    renderAdminRegistrations();

}


/* =========================================================
   ADMIN STATISTICS
========================================================= */

function updateAdminStats() {

    const registrations =
        getRegistrations();


    const pending =
        registrations.filter(
            member =>
                member.status ===
                "pending"
        ).length;


    const accepted =
        registrations.filter(
            member =>
                member.status ===
                "accepted"
        ).length;


    const declined =
        registrations.filter(
            member =>
                member.status ===
                "declined"
        ).length;


    const pendingElement =
        document.getElementById(
            "pendingCount"
        );


    const acceptedElement =
        document.getElementById(
            "acceptedCount"
        );


    const declinedElement =
        document.getElementById(
            "declinedCount"
        );


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (acceptedElement) {

        acceptedElement.textContent =
            accepted;

    }


    if (declinedElement) {

        declinedElement.textContent =
            declined;

    }


    updatePublicMemberCount();

}


/* =========================================================
   RENDER REGISTRATIONS
========================================================= */

function renderAdminRegistrations() {

    const container =
        document.getElementById(
            "registrationList"
        );


    if (!container) {

        return;

    }


    const filter =
        document.getElementById(
            "adminWardFilter"
        );


    const selectedWard =
        filter
            ? filter.value
            : "all";


    let registrations =
        getRegistrations();


    if (
        selectedWard !==
        "all"
    ) {

        registrations =
            registrations.filter(
                member =>
                    String(
                        member.ward
                    ) ===
                    String(
                        selectedWard
                    )
            );

    }


    if (
        registrations.length ===
        0
    ) {

        container.innerHTML = `

            <p class="empty-state">
                No registrations found.
            </p>

        `;

        return;

    }


    container.innerHTML = "";


    registrations
        .slice()
        .reverse()
        .forEach(
            registration => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "registration-item";


                const status =
                    registration.status ||
                    "pending";


                item.innerHTML = `

                    <div
                        class="registration-header"
                    >

                        <div>

                            <h4>
                                ${escapeHTML(
                                    registration.fullName
                                )}
                            </h4>

                            <span
                                class="status ${status}"
                            >
                                ${status.toUpperCase()}
                            </span>

                        </div>


                        <strong>
                            Ward ${escapeHTML(
                                String(
                                    registration.ward
                                )
                            )}
                        </strong>

                    </div>


                    <div
                        class="registration-details"
                    >

                        <div>
                            <strong>
                                Phone:
                            </strong>

                            ${escapeHTML(
                                registration.phone
                            )}
                        </div>


                        <div>
                            <strong>
                                Email:
                            </strong>

                            ${escapeHTML(
                                registration.email ||
                                "Not provided"
                            )}
                        </div>


                        <div>
                            <strong>
                                Occupation:
                            </strong>

                            ${escapeHTML(
                                registration.occupation ||
                                "Not provided"
                            )}
                        </div>


                        <div>
                            <strong>
                                Area:
                            </strong>

                            ${escapeHTML(
                                registration.role ||
                                "Not provided"
                            )}
                        </div>


                        <div>
                            <strong>
                                Submitted:
                            </strong>

                            ${escapeHTML(
                                registration.date
                            )}
                        </div>

                    </div>


                    ${
                        registration.message
                        ?
                        `

                            <div
                                class="registration-message"
                            >

                                <strong>
                                    About:
                                </strong>

                                ${escapeHTML(
                                    registration.message
                                )}

                            </div>

                        `
                        :
                        ""
                    }


                    <div
                        class="registration-actions"
                    >

                        ${
                            status ===
                            "pending"

                            ?

                            `

                                <button
                                    class="small-btn accept-btn"
                                    data-action="accept"
                                    data-id="${registration.id}"
                                >
                                    ✓ Accept
                                </button>


                                <button
                                    class="small-btn decline-btn"
                                    data-action="decline"
                                    data-id="${registration.id}"
                                >
                                    ✕ Decline
                                </button>

                            `

                            :

                            ""
                        }


                        <button
                            class="small-btn delete-btn"
                            data-action="delete"
                            data-id="${registration.id}"
                        >
                            Delete
                        </button>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );


    container
        .querySelectorAll(
            "button[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.action;


                        const id =
                            Number(
                                button.dataset.id
                            );


                        if (
                            action ===
                            "accept"
                        ) {

                            acceptRegistration(
                                id
                            );

                        }


                        if (
                            action ===
                            "decline"
                        ) {

                            declineRegistration(
                                id
                            );

                        }


                        if (
                            action ===
                            "delete"
                        ) {

                            deleteRegistration(
                                id
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   ACCEPT REGISTRATION
========================================================= */

function acceptRegistration(
    id
) {

    const registrations =
        getRegistrations();


    const person =
        registrations.find(
            member =>
                Number(member.id) ===
                Number(id)
        );


    if (!person) {

        return;

    }


    person.status =
        "accepted";


    person.reviewedAt =
        new Date()
            .toLocaleString();


    saveRegistrations(
        registrations
    );


    updateAdminStats();

    renderAdminRegistrations();


    alert(
        `${person.fullName} has been accepted.`
    );

}


/* =========================================================
   DECLINE REGISTRATION
========================================================= */

function declineRegistration(
    id
) {

    const registrations =
        getRegistrations();


    const person =
        registrations.find(
            member =>
                Number(member.id) ===
                Number(id)
        );


    if (!person) {

        return;

    }


    const confirmed =
        confirm(
            `Decline ${person.fullName}'s registration?`
        );


    if (!confirmed) {

        return;

    }


    person.status =
        "declined";


    person.reviewedAt =
        new Date()
            .toLocaleString();


    saveRegistrations(
        registrations
    );


    removePersonFromExco(
        id
    );


    updateAdminStats();

    renderAdminRegistrations();

    renderExcoManager();


    alert(
        `${person.fullName}'s registration has been declined.`
    );

}


/* =========================================================
   DELETE REGISTRATION
========================================================= */

function deleteRegistration(
    id
) {

    const registrations =
        getRegistrations();


    const person =
        registrations.find(
            member =>
                Number(member.id) ===
                Number(id)
        );


    if (!person) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${person.fullName}'s registration permanently?`
        );


    if (!confirmed) {

        return;

    }


    const remaining =
        registrations.filter(
            member =>
                Number(member.id) !==
                Number(id)
        );


    saveRegistrations(
        remaining
    );


    removePersonFromExco(
        id
    );


    updateAdminStats();

    renderAdminRegistrations();

    renderExcoManager();

}


/* =========================================================
   REMOVE PERSON FROM EXCO
========================================================= */

function removePersonFromExco(
    personId
) {

    const excos =
        getExcos();


    let changed =
        false;


    Object.keys(
        excos
    ).forEach(
        wardNumber => {

            Object.keys(
                excos[wardNumber]
            ).forEach(
                position => {

                    if (
                        String(
                            excos[
                                wardNumber
                            ][position]
                        ) ===
                        String(
                            personId
                        )
                    ) {

                        delete excos[
                            wardNumber
                        ][position];


                        changed =
                            true;

                    }

                }
            );

        }
    );


    if (changed) {

        saveExcos(
            excos
        );

    }

}


/* =========================================================
   EXCO MANAGER
========================================================= */

function renderExcoManager() {

    const manager =
        document.getElementById(
            "excoManager"
        );


    const wardSelect =
        document.getElementById(
            "excoWardSelect"
        );


    if (
        !manager ||
        !wardSelect
    ) {

        return;

    }


    const wardNumber =
        wardSelect.value;


    if (!wardNumber) {

        manager.innerHTML = `

            <p class="empty-state">
                Select a ward to manage its EXCO.
            </p>

        `;

        return;

    }


    const acceptedMembers =
        getRegistrations().filter(
            member =>
                Number(member.ward) ===
                Number(wardNumber) &&
                member.status ===
                "accepted"
        );


    if (
        acceptedMembers.length ===
        0
    ) {

        manager.innerHTML = `

            <p class="empty-state">
                There are no accepted members
                in Ward ${wardNumber}.
            </p>

        `;

        return;

    }


    const excos =
        getExcos();


    const currentExco =
        excos[wardNumber] ||
        {};


    let html = `

        <p class="exco-description">
            Choose an accepted member for each
            executive position.
        </p>

    `;


    excoPositions.forEach(
        position => {

            const currentMember =
                currentExco[
                    position
                ] || "";


            html += `

                <div class="exco-position">

                    <label>
                        ${position}
                    </label>


                    <select
                        class="exco-select"
                        data-position="${escapeHTML(
                            position
                        )}"
                    >

                        <option value="">
                            Not appointed
                        </option>


                        ${
                            acceptedMembers
                                .map(
                                    member => `

                                        <option
                                            value="${member.id}"
                                            ${
                                                String(
                                                    member.id
                                                ) ===
                                                String(
                                                    currentMember
                                                )
                                                ?
                                                "selected"
                                                :
                                                ""
                                            }
                                        >
                                            ${escapeHTML(
                                                member.fullName
                                            )}
                                        </option>

                                    `
                                )
                                .join("")
                        }

                    </select>

                </div>

            `;

        }
    );


    html += `

        <button
            type="button"
            class="btn primary exco-save"
            id="saveExcoBtn"
        >
            Save Ward EXCO
        </button>

    `;


    manager.innerHTML =
        html;


    const saveButton =
        document.getElementById(
            "saveExcoBtn"
        );


    saveButton.addEventListener(
        "click",
        () => {

            saveWardExco(
                wardNumber
            );

        }
    );

}


/* =========================================================
   SAVE EXCO
========================================================= */

function saveWardExco(
    wardNumber
) {

    const selects =
        document.querySelectorAll(
            ".exco-select"
        );


    const excos =
        getExcos();


    if (
        !excos[wardNumber]
    ) {

        excos[wardNumber] =
            {};

    }


    selects.forEach(
        select => {

            const position =
                select.dataset.position;


            const memberId =
                select.value;


            if (memberId) {

                excos[
                    wardNumber
                ][position] =
                    memberId;

            } else {

                delete excos[
                    wardNumber
                ][position];

            }

        }
    );


    saveExcos(
        excos
    );


    alert(
        `Ward ${wardNumber} EXCO saved successfully.`
    );


    renderExcoManager();

}


/* =========================================================
   INDIVIDUAL WARD PAGE
========================================================= */

function initializeIndividualWard() {

    const title =
        document.getElementById(
            "wardTitle"
        );


    if (!title) {

        return;

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const wardNumber =
        Number(
            params.get(
                "ward"
            )
        );


    const ward =
        wards.find(
            item =>
                item.number ===
                wardNumber
        );


    if (!ward) {

        title.textContent =
            "Ward Not Found";


        const description =
            document.getElementById(
                "wardDescription"
            );


        if (description) {

            description.textContent =
                "The requested ward does not exist.";

        }


        return;

    }


    title.textContent =
        ward.name;


    const description =
        document.getElementById(
            "wardDescription"
        );


    if (description) {

        description.textContent =
            `Ekiti State Women of Influence — ${ward.name}`;

    }


    loadWardMembers(
        wardNumber
    );


    loadWardExco(
        wardNumber
    );

}


/* =========================================================
   LOAD WARD MEMBERS
========================================================= */

function loadWardMembers(
    wardNumber
) {

    const container =
        document.getElementById(
            "wardMembers"
        );


    if (!container) {

        return;

    }


    const members =
        getRegistrations().filter(
            member =>
                Number(member.ward) ===
                Number(wardNumber) &&
                member.status ===
                "accepted"
        );


    if (
        members.length ===
        0
    ) {

        container.innerHTML = `

            <p class="empty-state">
                No accepted members yet.
            </p>

        `;

        return;

    }


    container.innerHTML = `

        <div class="member-list">

            ${
                members
                    .map(
                        member => `

                            <div class="member-row">

                                ${escapeHTML(
                                    member.fullName
                                )}

                            </div>

                        `
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   LOAD PUBLIC EXCO
========================================================= */

function loadWardExco(
    wardNumber
) {

    const container =
        document.getElementById(
            "wardExco"
        );


    if (!container) {

        return;

    }


    const members =
        getRegistrations().filter(
            member =>
                Number(member.ward) ===
                Number(wardNumber) &&
                member.status ===
                "accepted"
        );


    const excos =
        getExcos();


    const wardExco =
        excos[wardNumber] ||
        {};


    let html = "";


    excoPositions.forEach(
        position => {

            const memberId =
                wardExco[
                    position
                ];


            const member =
                members.find(
                    person =>
                        String(
                            person.id
                        ) ===
                        String(
                            memberId
                        )
                );


            html += `

                <div
                    class="exco-public-row"
                >

                    <strong>
                        ${position}
                    </strong>

                    <span>
                        ${
                            member
                            ?
                            escapeHTML(
                                member.fullName
                            )
                            :
                            "Not appointed"
                        }
                    </span>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


/* =========================================================
   INITIALIZE EVERYTHING
========================================================= */

function initializeWebsite() {

    initializeMenu();


    updatePublicMemberCount();


    createWardCards();


    populateWardSelect();


    initializeRegistration();


    initializeAdminLogin();


    initializeAdminLogout();


    populateAdminFilters();


    checkAdminSession();


    initializeIndividualWard();

}


/* =========================================================
   START WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeWebsite
);
