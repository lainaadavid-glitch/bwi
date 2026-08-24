```javascript
/* =========================================================
   EKITI STATE WOMEN OF INFLUENCE
   ADO LOCAL GOVERNMENT
   COMPLETE JAVASCRIPT
========================================================= */


/* =========================================================
   ADMIN CREDENTIALS
========================================================= */

/*
   PROTOTYPE ONLY.

   Username: admin
   Password: admin123

   This must be replaced with real authentication
   before production deployment.
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
   ELEMENTS
========================================================= */

const wardGrid =
    document.getElementById("wardGrid");

const wardDetails =
    document.getElementById("wardDetails");

const wardContent =
    document.getElementById("wardContent");

const closeWard =
    document.getElementById("closeWard");

const wardSelect =
    document.getElementById("wardSelect");

const registrationForm =
    document.getElementById("registrationForm");

const formMessage =
    document.getElementById("formMessage");

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");

const adminLogin =
    document.getElementById("adminLogin");

const adminDashboard =
    document.getElementById("adminDashboard");

const adminUsername =
    document.getElementById("adminUsername");

const adminPassword =
    document.getElementById("adminPassword");

const adminLoginBtn =
    document.getElementById("adminLoginBtn");

const adminLoginMessage =
    document.getElementById("adminLoginMessage");

const adminLogoutBtn =
    document.getElementById("adminLogoutBtn");

const pendingCount =
    document.getElementById("pendingCount");

const acceptedCount =
    document.getElementById("acceptedCount");

const declinedCount =
    document.getElementById("declinedCount");

const adminWardFilter =
    document.getElementById("adminWardFilter");

const registrationList =
    document.getElementById("registrationList");

const excoWardSelect =
    document.getElementById("excoWardSelect");

const excoManager =
    document.getElementById("excoManager");

const publicMemberCount =
    document.getElementById("publicMemberCount");


/* =========================================================
   STORAGE
========================================================= */

function getRegistrations() {

    return JSON.parse(
        localStorage.getItem(
            "eswiRegistrations"
        )
    ) || [];
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

    return JSON.parse(
        localStorage.getItem(
            "eswiExcos"
        )
    ) || {};
}


function saveExcos(excos) {

    localStorage.setItem(
        "eswiExcos",
        JSON.stringify(excos)
    );
}


/* =========================================================
   CREATE WARD CARDS
========================================================= */

function createWardCards() {

    wardGrid.innerHTML = "";

    wards.forEach(ward => {

        const card =
            document.createElement("div");

        card.className =
            "ward-card";

        card.innerHTML = `

            <div class="ward-number">
                ${ward.number}
            </div>

            <h3>
                ${ward.name}
            </h3>

            <p>
                View ward information →
            </p>

        `;

        card.addEventListener(
            "click",
            () => showWard(ward.number)
        );

        wardGrid.appendChild(card);

    });
}


/* =========================================================
   POPULATE PUBLIC WARD SELECT
========================================================= */

function populateWardSelect() {

    wardSelect.innerHTML = `

        <option value="">
            Select your ward
        </option>

    `;

    wards.forEach(ward => {

        const option =
            document.createElement("option");

        option.value =
            ward.number;

        option.textContent =
            `Ward ${ward.number}`;

        wardSelect.appendChild(option);

    });
}


/* =========================================================
   POPULATE ADMIN FILTERS
========================================================= */

function populateAdminFilters() {

    adminWardFilter.innerHTML = `

        <option value="all">
            All Wards
        </option>

    `;

    excoWardSelect.innerHTML = `

        <option value="">
            Select Ward
        </option>

    `;

    wards.forEach(ward => {

        const filterOption =
            document.createElement("option");

        filterOption.value =
            ward.number;

        filterOption.textContent =
            `Ward ${ward.number}`;

        adminWardFilter.appendChild(
            filterOption
        );


        const excoOption =
            document.createElement("option");

        excoOption.value =
            ward.number;

        excoOption.textContent =
            `Ward ${ward.number}`;

        excoWardSelect.appendChild(
            excoOption
        );

    });
}


/* =========================================================
   SHOW PUBLIC WARD
========================================================= */

function showWard(wardNumber) {

    const ward =
        wards.find(
            item =>
                item.number === wardNumber
        );

    if (!ward) return;


    const registrations =
        getRegistrations().filter(
            item =>
                Number(item.ward) === wardNumber &&
                item.status === "accepted"
        );


    const allExcos =
        getExcos();

    const wardExcos =
        allExcos[wardNumber] || {};


    let excoHTML = "";


    excoPositions.forEach(
        position => {

            const memberId =
                wardExcos[position];

            const member =
                registrations.find(
                    person =>
                        String(person.id) ===
                        String(memberId)
                );


            excoHTML += `

                <p>
                    <strong>
                        ${position}:
                    </strong>

                    ${
                        member
                            ? escapeHTML(
                                member.fullName
                              )
                            : "Not appointed"
                    }

                </p>

            `;
        }
    );


    let membersHTML = "";


    if (registrations.length === 0) {

        membersHTML = `
            <p>
                No accepted members are currently
                listed for this ward.
            </p>
        `;

    } else {

        membersHTML = `

            <ul class="member-list">

                ${
                    registrations
                        .map(
                            member => `
                                <li>
                                    ${escapeHTML(
                                        member.fullName
                                    )}
                                </li>
                            `
                        )
                        .join("")
                }

            </ul>

        `;
    }


    wardContent.innerHTML = `

        <p class="section-label">
            ADO LOCAL GOVERNMENT
        </p>

        <h2>
            ${ward.name}
        </h2>

        <p>
            Ekiti State Women of Influence —
            ${ward.name}.
        </p>

        <br>

        <h3>
            Accepted Women
        </h3>

        <p>
            ${registrations.length}
            accepted member(s).
        </p>

        ${membersHTML}

        <br>

        <h3>
            Ward Executive Committee
        </h3>

        ${excoHTML}

    `;


    wardDetails.classList.add(
        "active"
    );


    wardDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   CLOSE WARD
========================================================= */

closeWard.addEventListener(
    "click",
    () => {

        wardDetails.classList.remove(
            "active"
        );

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

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


/* =========================================================
   PUBLIC REGISTRATION
========================================================= */

registrationForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const fullName =
            document
                .getElementById("fullName")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const ward =
            wardSelect.value;


        const occupation =
            document
                .getElementById("occupation")
                .value
                .trim();


        const role =
            document
                .getElementById("role")
                .value;


        const message =
            document
                .getElementById("message")
                .value
                .trim();


        if (
            !fullName ||
            !phone ||
            !ward
        ) {

            showFormMessage(
                "Please complete your name, phone number and ward.",
                "error"
            );

            return;
        }


        const registration = {

            id: Date.now(),

            fullName,

            phone,

            email,

            ward,

            occupation,

            role,

            message,

            status: "pending",

            date:
                new Date()
                    .toLocaleString()

        };


        const registrations =
            getRegistrations();


        registrations.push(
            registration
        );


        saveRegistrations(
            registrations
        );


        showFormMessage(
            "Registration submitted successfully. Your application is now awaiting admin approval.",
            "success"
        );


        registrationForm.reset();


        updatePublicMemberCount();

        updateAdminStats();

        renderAdminRegistrations();

    }
);


/* =========================================================
   FORM MESSAGE
========================================================= */

function showFormMessage(
    message,
    type
) {

    formMessage.textContent =
        message;


    formMessage.style.color =
        type === "success"
            ? "#16a34a"
            : "#dc2626";
}


/* =========================================================
   PUBLIC MEMBER COUNT
========================================================= */

function updatePublicMemberCount() {

    const accepted =
        getRegistrations()
            .filter(
                item =>
                    item.status === "accepted"
            )
            .length;


    publicMemberCount.textContent =
        accepted;
}


/* =========================================================
   ADMIN LOGIN
========================================================= */

adminLoginBtn.addEventListener(
    "click",
    loginAdmin
);


adminPassword.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            loginAdmin();
        }

    }
);


function loginAdmin() {

    const username =
        adminUsername.value.trim();

    const password =
        adminPassword.value;


    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        sessionStorage.setItem(
            "eswiAdminLoggedIn",
            "true"
        );


        adminLogin.classList.add(
            "hidden"
        );

        adminLogin.style.display =
            "none";


        adminDashboard.classList.add(
            "active"
        );


        adminLoginMessage.textContent =
            "";


        loadAdminDashboard();

    } else {

        adminLoginMessage.textContent =
            "Invalid administrator username or password.";

        adminLoginMessage.style.color =
            "#dc2626";
    }
}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

adminLogoutBtn.addEventListener(
    "click",
    logoutAdmin
);


function logoutAdmin() {

    sessionStorage.removeItem(
        "eswiAdminLoggedIn"
    );


    adminDashboard.classList.remove(
        "active"
    );


    adminLogin.style.display =
        "block";


    adminUsername.value = "";
    adminPassword.value = "";


    document
        .getElementById("admin")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

function checkAdminSession() {

    const loggedIn =
        sessionStorage.getItem(
            "eswiAdminLoggedIn"
        );


    if (loggedIn === "true") {

        adminLogin.style.display =
            "none";

        adminDashboard.classList.add(
            "active"
        );

        loadAdminDashboard();

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
            item =>
                item.status === "pending"
        ).length;


    const accepted =
        registrations.filter(
            item =>
                item.status === "accepted"
        ).length;


    const declined =
        registrations.filter(
            item =>
                item.status === "declined"
        ).length;


    pendingCount.textContent =
        pending;

    acceptedCount.textContent =
        accepted;

    declinedCount.textContent =
        declined;

    updatePublicMemberCount();
}


/* =========================================================
   RENDER REGISTRATIONS
========================================================= */

function renderAdminRegistrations() {

    if (
        !registrationList
    ) return;


    const registrations =
        getRegistrations();


    const filter =
        adminWardFilter.value ||
        "all";


    let filtered =
        registrations;


    if (filter !== "all") {

        filtered =
            registrations.filter(
                item =>
                    String(item.ward) ===
                    String(filter)
            );
    }


    if (filtered.length === 0) {

        registrationList.innerHTML = `

            <p class="empty-state">
                No registrations found.
            </p>

        `;

        return;
    }


    registrationList.innerHTML = "";


    filtered
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
                            ? `
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
                            : ""
                    }


                    <div
                        class="registration-actions"
                    >

                        ${
                            status === "pending"
                                ? `

                                    <button
                                        class="small-btn accept-btn"
                                        onclick="acceptRegistration(${registration.id})"
                                    >
                                        ✓ Accept
                                    </button>

                                    <button
                                        class="small-btn decline-btn"
                                        onclick="declineRegistration(${registration.id})"
                                    >
                                        ✕ Decline
                                    </button>

                                  `
                                : ""
                        }


                        <button
                            class="small-btn delete-btn"
                            onclick="deleteRegistration(${registration.id})"
                        >
                            Delete
                        </button>

                    </div>

                `;


                registrationList.appendChild(
                    item
                );

            }
        );
}


/* =========================================================
   ACCEPT REGISTRATION
========================================================= */

function acceptRegistration(id) {

    const registrations =
        getRegistrations();


    const person =
        registrations.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!person) return;


    person.status =
        "accepted";


    person.reviewedAt =
        new Date().toLocaleString();


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

function declineRegistration(id) {

    const registrations =
        getRegistrations();


    const person =
        registrations.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!person) return;


    const confirmed =
        confirm(
            `Decline registration for ${person.fullName}?`
        );


    if (!confirmed) return;


    person.status =
        "declined";


    person.reviewedAt =
        new Date().toLocaleString();


    saveRegistrations(
        registrations
    );


    removePersonFromExco(
        person.id
    );


    updateAdminStats();

    renderAdminRegistrations();


    alert(
        `${person.fullName}'s registration has been declined.`
    );
}


/* =========================================================
   DELETE REGISTRATION
========================================================= */

function deleteRegistration(id) {

    const registrations =
        getRegistrations();


    const person =
        registrations.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!person) return;


    const confirmed =
        confirm(
            `Delete ${person.fullName}'s registration permanently?`
        );


    if (!confirmed) return;


    const remaining =
        registrations.filter(
            item =>
                Number(item.id) !==
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


    Object.keys(excos)
        .forEach(
            wardNumber => {

                Object.keys(
                    excos[wardNumber]
                )
                .forEach(
                    position => {

                        if (
                            String(
                                excos[
                                    wardNumber
                                ][position]
                            ) ===
                            String(personId)
                        ) {

                            delete excos[
                                wardNumber
                            ][position];

                            changed = true;
                        }

                    }
                );

            }
        );


    if (changed) {
        saveExcos(excos);
    }
}


/* =========================================================
   EXCO WARD SELECT
========================================================= */

excoWardSelect.addEventListener(
    "change",
    renderExcoManager
);


/* =========================================================
   RENDER EXCO MANAGER
========================================================= */

function renderExcoManager() {

    const wardNumber =
        excoWardSelect.value;


    if (!wardNumber) {

        excoManager.innerHTML = `

            <p class="empty-state">
                Select a ward to manage its EXCO.
            </p>

        `;

        return;
    }


    const acceptedMembers =
        getRegistrations().filter(
            item =>
                Number(item.ward) ===
                Number(wardNumber) &&
                item.status ===
                "accepted"
        );


    if (
        acceptedMembers.length === 0
    ) {

        excoManager.innerHTML = `

            <p class="empty-state">
                There are no accepted members
                in Ward ${wardNumber} yet.
            </p>

        `;

        return;
    }


    const excos =
        getExcos();


    const wardExcos =
        excos[wardNumber] || {};


    let html = `

        <p>
            Select an accepted member for each
            executive position.
        </p>

    `;


    excoPositions.forEach(
        position => {

            const currentId =
                wardExcos[position] || "";


            html += `

                <div class="exco-position">

                    <label>
                        ${position}
                    </label>


                    <select
                        data-position="${escapeHTML(
                            position
                        )}"
                        class="exco-select"
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
                                                    currentId
                                                )
                                                    ? "selected"
                                                    : ""
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


    excoManager.innerHTML =
        html;


    document
        .getElementById(
            "saveExcoBtn"
        )
        .addEventListener(
            "click",
            () => saveWardExco(
                wardNumber
            )
        );
}


/* =========================================================
   SAVE WARD EXCO
========================================================= */

function saveWardExco(
    wardNumber
) {

    const selections =
        document.querySelectorAll(
            ".exco-select"
        );


    const excos =
        getExcos();


    if (!excos[wardNumber]) {

        excos[wardNumber] = {};

    }


    selections.forEach(
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


    showWard(
        Number(wardNumber)
    );
}


/* =========================================================
   ADMIN FILTER
========================================================= */

adminWardFilter.addEventListener(
    "change",
    renderAdminRegistrations
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeWebsite() {

    createWardCards();

    populateWardSelect();

    populateAdminFilters();

    updatePublicMemberCount();

    updateAdminStats();

    checkAdminSession();

}


initializeWebsite();
```
