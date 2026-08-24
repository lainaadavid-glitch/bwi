/* ============================================================
   EKITI STATE WOMEN OF INFLUENCE
   ADO LOCAL GOVERNMENT

   SUPABASE + REGISTRATION + ADMIN PANEL
============================================================ */


/* ============================================================
   SUPABASE CONFIGURATION
============================================================ */

const SUPABASE_URL =
    "https://yrqwttihowbzofqmormr.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_I92CPrqzXZDb1HHaMfuFRQ_5lCTZ8Fu";


/* ============================================================
   CHECK SUPABASE CONFIG
============================================================ */

if (
    !SUPABASE_URL ||
    !SUPABASE_PUBLISHABLE_KEY ||
    SUPABASE_PUBLISHABLE_KEY ===
        "YOUR_SUPABASE_PUBLISHABLE_KEY"
) {

    console.error(
        "Supabase is not configured."
    );

}


/* ============================================================
   SUPABASE REST REQUEST
============================================================ */

async function supabaseRequest(
    endpoint,
    options = {},
    token = SUPABASE_PUBLISHABLE_KEY
) {

    const headers = {

        "Content-Type":
            "application/json",

        "apikey":
            SUPABASE_PUBLISHABLE_KEY,

        "Authorization":
            `Bearer ${token}`

    };


    if (options.headers) {

        Object.assign(
            headers,
            options.headers
        );

    }


    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoint}`,
            {

                ...options,

                headers

            }
        );


    const text =
        await response.text();


    let data = null;


    if (text) {

        try {

            data =
                JSON.parse(text);

        } catch {

            data =
                text;

        }

    }


    if (!response.ok) {

        console.error(
            "Supabase request failed:",
            response.status,
            data
        );


        let errorMessage =
            `Supabase error ${response.status}`;


        if (
            data &&
            typeof data === "object"
        ) {

            errorMessage =
                data.message ||
                data.msg ||
                data.hint ||
                data.error_description ||
                data.details ||
                errorMessage;

        }


        throw new Error(
            errorMessage
        );

    }


    return data;

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(
    value
) {

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


/* ============================================================
   MOBILE MENU
============================================================ */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


const navMenu =
    document.getElementById(
        "navMenu"
    );


if (
    menuBtn &&
    navMenu
) {

    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "active"
            );

        }
    );

}


/* ============================================================
   REGISTRATION FORM
============================================================ */

const registrationForm =
    document.getElementById(
        "registrationForm"
    );


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        submitRegistration
    );

}


async function submitRegistration(
    event
) {

    event.preventDefault();


    const message =
        document.getElementById(
            "formMessage"
        );


    const button =
        document.getElementById(
            "submitBtn"
        );


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
                "ward"
            )
            .value;


    const pollingBooth =
        document
            .getElementById(
                "pollingBooth"
            )
            .value
            .trim();


    const accountName =
        document
            .getElementById(
                "accountName"
            )
            .value
            .trim();


    const accountNumber =
        document
            .getElementById(
                "accountNumber"
            )
            .value
            .trim();


    const bankName =
        document
            .getElementById(
                "bankName"
            )
            .value
            .trim();


    message.textContent =
        "";


    /* --------------------------------------------------------
       VALIDATION
    -------------------------------------------------------- */

    if (!fullName) {

        showMessage(
            message,
            "Please enter your full name.",
            "error"
        );

        return;

    }


    if (!phone) {

        showMessage(
            message,
            "Please enter your phone number.",
            "error"
        );

        return;

    }


    if (!ward) {

        showMessage(
            message,
            "Please select your ward.",
            "error"
        );

        return;

    }


    if (!pollingBooth) {

        showMessage(
            message,
            "Please enter your polling booth.",
            "error"
        );

        return;

    }


    if (!accountName) {

        showMessage(
            message,
            "Please enter your account name.",
            "error"
        );

        return;

    }


    if (
        !/^[0-9]{10}$/.test(
            accountNumber
        )
    ) {

        showMessage(
            message,
            "Account number must contain exactly 10 digits.",
            "error"
        );

        return;

    }


    if (!bankName) {

        showMessage(
            message,
            "Please enter your bank name.",
            "error"
        );

        return;

    }


    /* --------------------------------------------------------
       DISABLE BUTTON
    -------------------------------------------------------- */

    button.disabled =
        true;


    button.textContent =
        "Submitting...";


    showMessage(
        message,
        "Submitting registration...",
        "info"
    );


    try {

        /* ----------------------------------------------------
           INSERT REGISTRATION
        ---------------------------------------------------- */

        await supabaseRequest(
            "members",
            {

                method:
                    "POST",

                headers: {

                    "Prefer":
                        "return=minimal"

                },

                body:
                    JSON.stringify({

                        full_name:
                            fullName,

                        phone:
                            phone,

                        ward:
                            Number(
                                ward
                            ),

                        polling_booth:
                            pollingBooth,

                        account_name:
                            accountName,

                        account_number:
                            accountNumber,

                        bank_name:
                            bankName,

                        status:
                            "pending"

                    })

            }
        );


        /* ----------------------------------------------------
           SUCCESS
        ---------------------------------------------------- */

        showMessage(
            message,
            "Registration submitted successfully! Your registration is now waiting for admin approval.",
            "success"
        );


        registrationForm.reset();


    } catch (error) {

        console.error(
            "REGISTRATION ERROR:",
            error
        );


        showMessage(
            message,
            `Registration failed: ${error.message}`,
            "error"
        );

    }


    button.disabled =
        false;


    button.textContent =
        "Submit Registration";

}


/* ============================================================
   MESSAGE HELPER
============================================================ */

function showMessage(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.className =
        `form-message ${type}`;

}


/* ============================================================
   AUTH STORAGE
============================================================ */

function getAccessToken() {

    return localStorage.getItem(
        "supabase_access_token"
    );

}


function clearAuth() {

    localStorage.removeItem(
        "supabase_access_token"
    );

    localStorage.removeItem(
        "supabase_refresh_token"
    );

}


/* ============================================================
   ADMIN PAGE ELEMENTS
============================================================ */

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


const adminLogin =
    document.getElementById(
        "adminLogin"
    );


const adminDashboard =
    document.getElementById(
        "adminDashboard"
    );


/* ============================================================
   ADMIN LOGIN
============================================================ */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        adminLoginSubmit
    );

}


async function adminLoginSubmit(
    event
) {

    event.preventDefault();


    const emailInput =
        document.getElementById(
            "adminEmail"
        );


    const passwordInput =
        document.getElementById(
            "adminPassword"
        );


    const message =
        document.getElementById(
            "adminLoginMessage"
        );


    const button =
        document.getElementById(
            "loginBtn"
        );


    const email =
        emailInput.value.trim();


    const password =
        passwordInput.value;


    if (!email || !password) {

        showMessage(
            message,
            "Enter your email and password.",
            "error"
        );

        return;

    }


    button.disabled =
        true;


    button.textContent =
        "Logging in...";


    showMessage(
        message,
        "Connecting to Supabase...",
        "info"
    );


    try {

        /* ----------------------------------------------------
           SUPABASE AUTH LOGIN
        ---------------------------------------------------- */

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY

                    },

                    body:
                        JSON.stringify({

                            email:
                                email,

                            password:
                                password

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(

                data.error_description ||

                data.msg ||

                data.message ||

                "Login failed."

            );

        }


        if (
            !data.access_token
        ) {

            throw new Error(
                "Supabase did not return an access token."
            );

        }


        /* ----------------------------------------------------
           SAVE SESSION
        ---------------------------------------------------- */

        localStorage.setItem(
            "supabase_access_token",
            data.access_token
        );


        if (
            data.refresh_token
        ) {

            localStorage.setItem(
                "supabase_refresh_token",
                data.refresh_token
            );

        }


        showMessage(
            message,
            "Login successful. Loading dashboard...",
            "success"
        );


        /* ----------------------------------------------------
           SHOW DASHBOARD
        ---------------------------------------------------- */

        await openAdminDashboard(
            data.user
        );


    } catch (error) {

        console.error(
            "ADMIN LOGIN ERROR:",
            error
        );


        clearAuth();


        showMessage(
            message,
            `Login failed: ${error.message}`,
            "error"
        );

    }


    button.disabled =
        false;


    button.textContent =
        "Login";

}


/* ============================================================
   OPEN ADMIN DASHBOARD
============================================================ */

async function openAdminDashboard(
    user
) {

    if (!adminLogin ||
        !adminDashboard) {

        return;

    }


    adminLogin.style.display =
        "none";


    adminDashboard.style.display =
        "block";


    const emailElement =
        document.getElementById(
            "adminUserEmail"
        );


    if (emailElement) {

        emailElement.textContent =
            user?.email ||
            "";

    }


    await loadAdminDashboard();

}


/* ============================================================
   CHECK EXISTING ADMIN SESSION
============================================================ */

async function checkExistingAdminSession() {

    if (
        !adminLogin ||
        !adminDashboard
    ) {

        return;

    }


    const token =
        getAccessToken();


    if (!token) {

        adminLogin.style.display =
            "block";

        adminDashboard.style.display =
            "none";

        return;

    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/user`,
                {

                    method:
                        "GET",

                    headers: {

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY,

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const user =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Your session has expired."
            );

        }


        await openAdminDashboard(
            user
        );


    } catch (error) {

        console.error(
            "SESSION ERROR:",
            error
        );


        clearAuth();


        adminLogin.style.display =
            "block";


        adminDashboard.style.display =
            "none";

    }

}


checkExistingAdminSession();


/* ============================================================
   LOGOUT
============================================================ */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        adminLogout
    );

}


async function adminLogout() {

    const token =
        getAccessToken();


    try {

        if (token) {

            await fetch(
                `${SUPABASE_URL}/auth/v1/logout`,
                {

                    method:
                        "POST",

                    headers: {

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY,

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );

        }

    } catch (error) {

        console.error(
            error
        );

    }


    clearAuth();


    if (adminDashboard) {

        adminDashboard.style.display =
            "none";

    }


    if (adminLogin) {

        adminLogin.style.display =
            "block";

    }


    window.scrollTo(
        0,
        0
    );

}


/* ============================================================
   ADMIN REST REQUEST
============================================================ */

async function adminRequest(
    endpoint,
    options = {}
) {

    const token =
        getAccessToken();


    if (!token) {

        throw new Error(
            "You are not logged in."
        );

    }


    return await supabaseRequest(
        endpoint,
        options,
        token
    );

}


/* ============================================================
   LOAD ADMIN DASHBOARD
============================================================ */

async function loadAdminDashboard() {

    try {

        await loadStatistics();

        await loadPendingMembers();

        await loadAcceptedMembers();

        await loadMembersByWard();

        await loadExcoManager();

    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );

    }

}


/* ============================================================
   STATISTICS
============================================================ */

async function loadStatistics() {

    const members =
        await adminRequest(
            "members?select=id,status"
        );


    const pending =
        members.filter(
            m =>
                m.status ===
                "pending"
        ).length;


    const accepted =
        members.filter(
            m =>
                m.status ===
                "accepted"
        ).length;


    const declined =
        members.filter(
            m =>
                m.status ===
                "declined"
        ).length;


    setText(
        "pendingCount",
        pending
    );


    setText(
        "acceptedCount",
        accepted
    );


    setText(
        "declinedCount",
        declined
    );

}


/* ============================================================
   PENDING MEMBERS
============================================================ */

async function loadPendingMembers() {

    const container =
        document.getElementById(
            "pendingList"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        `<div class="loading">
            Loading registrations...
        </div>`;


    try {

        const members =
            await adminRequest(
                "members?status=eq.pending&select=*&order=created_at.desc"
            );


        if (
            !members ||
            members.length === 0
        ) {

            container.innerHTML =
                `
                <div class="empty-state">
                    No pending registrations.
                </div>
                `;

            return;

        }


        container.innerHTML =
            "";


        members.forEach(
            member => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "registration-item";


                card.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            member.full_name
                        )}
                    </h3>

                    <p>
                        <strong>Phone:</strong>
                        ${escapeHTML(
                            member.phone
                        )}
                    </p>

                    <p>
                        <strong>Ward:</strong>
                        Ward ${member.ward}
                    </p>

                    <p>
                        <strong>Polling Booth:</strong>
                        ${escapeHTML(
                            member.polling_booth
                        )}
                    </p>

                    <p>
                        <strong>Account Name:</strong>
                        ${escapeHTML(
                            member.account_name
                        )}
                    </p>

                    <p>
                        <strong>Account Number:</strong>
                        ${escapeHTML(
                            member.account_number
                        )}
                    </p>

                    <p>
                        <strong>Bank:</strong>
                        ${escapeHTML(
                            member.bank_name
                        )}
                    </p>

                    <div class="registration-actions">

                        <button
                            type="button"
                            class="small-btn accept-btn"
                            data-id="${member.id}"
                        >
                            ✓ Accept
                        </button>

                        <button
                            type="button"
                            class="small-btn decline-btn"
                            data-id="${member.id}"
                        >
                            ✕ Decline
                        </button>

                    </div>

                `;


                const acceptButton =
                    card.querySelector(
                        ".accept-btn"
                    );


                const declineButton =
                    card.querySelector(
                        ".decline-btn"
                    );


                acceptButton.addEventListener(
                    "click",
                    () =>
                        updateMemberStatus(
                            member.id,
                            "accepted"
                        )
                );


                declineButton.addEventListener(
                    "click",
                    () =>
                        updateMemberStatus(
                            member.id,
                            "declined"
                        )
                );


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        container.innerHTML =
            `
            <div class="empty-state error">
                ${escapeHTML(
                    error.message
                )}
            </div>
            `;

    }

}


/* ============================================================
   ACCEPT / DECLINE
============================================================ */

async function updateMemberStatus(
    id,
    status
) {

    const action =
        status === "accepted"
            ? "accept"
            : "decline";


    const confirmed =
        confirm(
            `Are you sure you want to ${action} this registration?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await adminRequest(
            `members?id=eq.${encodeURIComponent(id)}`,
            {

                method:
                    "PATCH",

                headers: {

                    "Prefer":
                        "return=minimal"

                },

                body:
                    JSON.stringify({

                        status:
                            status,

                        reviewed_at:
                            new Date()
                                .toISOString()

                    })

            }
        );


        alert(
            `Registration ${status} successfully.`
        );


        await loadAdminDashboard();


    } catch (error) {

        alert(
            `Unable to update registration: ${error.message}`
        );

    }

}


/* ============================================================
   ACCEPTED MEMBERS
============================================================ */

async function loadAcceptedMembers() {

    const container =
        document.getElementById(
            "acceptedList"
        );


    if (!container) {
        return;
    }


    try {

        const members =
            await adminRequest(
                "members?status=eq.accepted&select=*&order=full_name.asc"
            );


        if (
            !members ||
            members.length === 0
        ) {

            container.innerHTML =
                `
                <div class="empty-state">
                    No accepted members yet.
                </div>
                `;

            return;

        }


        let html = `

            <div class="member-table-wrapper">

                <table class="member-table">

                    <thead>

                        <tr>

                            <th>
                                Full Name
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Ward
                            </th>

                            <th>
                                Polling Booth
                            </th>

                            <th>
                                Account
                            </th>

                            <th>
                                Bank
                            </th>

                            <th>
                                EXCO
                            </th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        members.forEach(
            member => {

                html += `

                    <tr>

                        <td>
                            ${escapeHTML(
                                member.full_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.phone
                            )}
                        </td>

                        <td>
                            Ward ${member.ward}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.polling_booth
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.account_name
                            )}
                            <br>
                            ${escapeHTML(
                                member.account_number
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.bank_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.exco_position ||
                                "Not assigned"
                            )}
                        </td>

                    </tr>

                `;

            }
        );


        html += `

                    </tbody>

                </table>

            </div>

        `;


        container.innerHTML =
            html;


    } catch (error) {

        container.innerHTML =
            `
            <div class="empty-state error">
                ${escapeHTML(
                    error.message
                )}
            </div>
            `;

    }

}


/* ============================================================
   MEMBERS BY WARD
============================================================ */

async function loadMembersByWard() {

    const container =
        document.getElementById(
            "wardMembers"
        );


    if (!container) {
        return;
    }


    try {

        const members =
            await adminRequest(
                "members?status=eq.accepted&select=id,full_name,phone,ward,polling_booth,exco_position&order=ward.asc,full_name.asc"
            );


        container.innerHTML =
            "";


        for (
            let ward = 1;
            ward <= 13;
            ward++
        ) {

            const wardMembers =
                members.filter(
                    member =>
                        Number(
                            member.ward
                        ) === ward
                );


            const section =
                document.createElement(
                    "div"
                );


            section.className =
                "ward-admin-section";


            let rows = "";


            wardMembers.forEach(
                member => {

                    rows += `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    member.full_name
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    member.phone
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    member.polling_booth
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    member.exco_position ||
                                    "—"
                                )}
                            </td>

                        </tr>

                    `;

                }
            );


            section.innerHTML = `

                <h3>
                    Ward ${ward}
                    (${wardMembers.length})
                </h3>

                ${
                    wardMembers.length === 0

                    ?

                    `
                    <p class="empty-state">
                        No accepted members.
                    </p>
                    `

                    :

                    `

                    <div class="member-table-wrapper">

                        <table class="member-table">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Polling Booth
                                    </th>

                                    <th>
                                        EXCO
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                ${rows}

                            </tbody>

                        </table>

                    </div>

                    `

                }

            `;


            container.appendChild(
                section
            );

        }

    } catch (error) {

        container.innerHTML =
            `
            <div class="empty-state error">
                ${escapeHTML(
                    error.message
                )}
            </div>
            `;

    }

}


/* ============================================================
   EXCO POSITIONS
============================================================ */

const EXCO_POSITIONS = [
    "LG Coodinator",
    "Ward Coordinator",
    "LG Deputy Coordinator"
    "Deputy Ward Coordinator",
    "Secretary",
    "Mobilization Officer",
    "Women Empowerment Officer",
    "Media/Publicity Officer",
    "Welfare Officer",
    "Polling Unit Officer"
];


/* ============================================================
   LOAD EXCO MANAGER
============================================================ */

async function loadExcoManager() {

    const container =
        document.getElementById(
            "excoManager"
        );


    if (!container) {
        return;
    }


    try {

        const members =
            await adminRequest(
                "members?status=eq.accepted&select=id,full_name,ward,exco_position&order=full_name.asc"
            );


        container.innerHTML =
            "";


        EXCO_POSITIONS.forEach(
            position => {

                const wrapper =
                    document.createElement(
                        "div"
                    );


                wrapper.className =
                    "exco-position";


                const label =
                    document.createElement(
                        "label"
                    );


                label.textContent =
                    position;


                const select =
                    document.createElement(
                        "select"
                    );


                select.dataset.position =
                    position;


                const empty =
                    document.createElement(
                        "option"
                    );


                empty.value =
                    "";


                empty.textContent =
                    "Select member";


                select.appendChild(
                    empty
                );


                members.forEach(
                    member => {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            member.id;


                        option.textContent =
                            `${member.full_name} — Ward ${member.ward}`;


                        if (
                            member.exco_position ===
                            position
                        ) {

                            option.selected =
                                true;

                        }


                        select.appendChild(
                            option
                        );

                    }
                );


                wrapper.appendChild(
                    label
                );


                wrapper.appendChild(
                    select
                );


                container.appendChild(
                    wrapper
                );

            }
        );


    } catch (error) {

        container.innerHTML =
            `
            <div class="empty-state error">
                ${escapeHTML(
                    error.message
                )}
            </div>
            `;

    }

}


/* ============================================================
   SAVE EXCO
============================================================ */

const saveExcoBtn =
    document.getElementById(
        "saveExcoBtn"
    );


if (saveExcoBtn) {

    saveExcoBtn.addEventListener(
        "click",
        saveExcoPositions
    );

}


async function saveExcoPositions() {

    const message =
        document.getElementById(
            "excoMessage"
        );


    saveExcoBtn.disabled =
        true;


    saveExcoBtn.textContent =
        "Saving...";


    try {

        /* ----------------------------------------------------
           GET ALL ACCEPTED MEMBERS
        ---------------------------------------------------- */

        const members =
            await adminRequest(
                "members?status=eq.accepted&select=id,exco_position"
            );


        /* ----------------------------------------------------
           CLEAR EXISTING EXCO POSITIONS
        ---------------------------------------------------- */

        for (
            const member of members
        ) {

            if (
                member.exco_position
            ) {

                await adminRequest(
                    `members?id=eq.${encodeURIComponent(member.id)}`,
                    {

                        method:
                            "PATCH",

                        headers: {

                            "Prefer":
                                "return=minimal"

                        },

                        body:
                            JSON.stringify({

                                exco_position:
                                    null

                            })

                    }
                );

            }

        }


        /* ----------------------------------------------------
           ASSIGN SELECTED POSITIONS
        ---------------------------------------------------- */

        const selects =
            document.querySelectorAll(
                "#excoManager select"
            );


        const selectedMembers =
            new Set();


        for (
            const select of selects
        ) {

            const memberId =
                select.value;


            const position =
                select.dataset.position;


            if (!memberId) {
                continue;
            }


            if (
                selectedMembers.has(
                    memberId
                )
            ) {

                throw new Error(
                    "A member cannot hold more than one EXCO position."
                );

            }


            selectedMembers.add(
                memberId
            );


            await adminRequest(
                `members?id=eq.${encodeURIComponent(memberId)}`,
                {

                    method:
                        "PATCH",

                    headers: {

                        "Prefer":
                            "return=minimal"

                    },

                    body:
                        JSON.stringify({

                            exco_position:
                                position

                        })

                }
            );

        }


        showMessage(
            message,
            "EXCO positions saved successfully.",
            "success"
        );


        await loadAcceptedMembers();

        await loadMembersByWard();


    } catch (error) {

        console.error(
            "EXCO ERROR:",
            error
        );


        showMessage(
            message,
            `Unable to save EXCO: ${error.message}`,
            "error"
        );

    }


    saveExcoBtn.disabled =
        false;


    saveExcoBtn.textContent =
        "Save EXCO Positions";

}


/* ============================================================
   REFRESH BUTTON
============================================================ */

const refreshPendingBtn =
    document.getElementById(
        "refreshPendingBtn"
    );


if (refreshPendingBtn) {

    refreshPendingBtn.addEventListener(
        "click",
        loadAdminDashboard
    );

}


/* ============================================================
   HELPER
============================================================ */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}
