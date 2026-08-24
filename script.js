/* =========================================================
   EKITI STATE WOMEN OF INFLUENCE
   ADO LOCAL GOVERNMENT

   SUPABASE WEBSITE SCRIPT
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://yrqwttihowbzofqmormr.supabase.co";


/*
   IMPORTANT:

   Put your sb_publishable_... key here.

   NEVER put your sb_secret_... key here.
*/

const SUPABASE_PUBLISHABLE_KEY =
    "YOUR_SUPABASE_PUBLISHABLE_KEY";


/* =========================================================
   BASIC SUPABASE REQUEST
========================================================= */

async function supabaseRequest(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoint}`,
            {

                ...options,

                headers: {

                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_PUBLISHABLE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

                    ...(options.headers || {})

                }

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
            "Supabase error:",
            data
        );


        throw new Error(
            data?.message ||
            data?.msg ||
            data?.hint ||
            data?.error_description ||
            `Supabase error ${response.status}`
        );

    }


    return data;

}


/* =========================================================
   HTML ESCAPE
========================================================= */

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


/* =========================================================
   MOBILE MENU
========================================================= */

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
        function () {

            navMenu.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   REGISTRATION
========================================================= */

const registrationForm =
    document.getElementById(
        "registrationForm"
    );


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "formMessage"
                );


            const submitBtn =
                document.getElementById(
                    "submitBtn"
                );


            /*
               GET FORM VALUES
            */

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


            /*
               CLEAR OLD MESSAGE
            */

            message.textContent =
                "";


            message.style.color =
                "";


            /*
               VALIDATION
            */

            if (!fullName) {

                showFormError(
                    "Please enter your full name."
                );

                return;

            }


            if (!phone) {

                showFormError(
                    "Please enter your phone number."
                );

                return;

            }


            if (!ward) {

                showFormError(
                    "Please select your ward."
                );

                return;

            }


            if (!pollingBooth) {

                showFormError(
                    "Please enter your polling booth."
                );

                return;

            }


            if (!accountName) {

                showFormError(
                    "Please enter the account name."
                );

                return;

            }


            /*
               ACCOUNT NUMBER
            */

            if (
                !/^[0-9]{10}$/.test(
                    accountNumber
                )
            ) {

                showFormError(
                    "Account number must contain exactly 10 digits."
                );

                return;

            }


            if (!bankName) {

                showFormError(
                    "Please enter your bank name."
                );

                return;

            }


            /*
               CHECK PUBLISHABLE KEY
            */

            if (
                !SUPABASE_PUBLISHABLE_KEY ||
                SUPABASE_PUBLISHABLE_KEY ===
                    "YOUR_SUPABASE_PUBLISHABLE_KEY"
            ) {

                showFormError(
                    "Supabase is not configured yet. Add your publishable key to script.js."
                );

                return;

            }


            /*
               DISABLE BUTTON
            */

            submitBtn.disabled =
                true;


            submitBtn.textContent =
                "Submitting...";


            message.textContent =
                "Submitting your registration...";


            message.style.color =
                "#7c1d4a";


            try {

                /*
                   SEND TO SUPABASE
                */

                await supabaseRequest(
                    "members",
                    {

                        method: "POST",

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


                /*
                   SUCCESS
                */

                message.textContent =
                    "Registration submitted successfully! Your application is now waiting for admin approval.";

                message.style.color =
                    "#166534";


                /*
                   CLEAR FORM
                */

                registrationForm.reset();


            } catch (error) {

                console.error(
                    "REGISTRATION ERROR:",
                    error
                );


                /*
                   SHOW THE ACTUAL ERROR

                   This makes debugging much easier.
                */

                message.textContent =
                    "Registration failed: " +
                    error.message;


                message.style.color =
                    "#b91c1c";

            }


            /*
               ENABLE BUTTON
            */

            submitBtn.disabled =
                false;


            submitBtn.textContent =
                "Submit Registration";

        }
    );

}


/* =========================================================
   FORM ERROR HELPER
========================================================= */

function showFormError(
    text
) {

    const message =
        document.getElementById(
            "formMessage"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.style.color =
        "#b91c1c";


    message.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* =========================================================
   WARD CARDS
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


    for (
        let ward = 1;
        ward <= 13;
        ward++
    ) {

        const card =
            document.createElement(
                "a"
            );


        card.className =
            "ward-card";


        card.href =
            `ward.html?ward=${ward}`;


        card.innerHTML = `

            <div class="ward-number">
                ${ward}
            </div>

            <h3>
                Ward ${ward}
            </h3>

            <p>
                View members
            </p>

        `;


        wardGrid.appendChild(
            card
        );

    }

}


createWardCards();


/* =========================================================
   PUBLIC WARD PAGE
========================================================= */

async function loadWardPage() {

    const memberList =
        document.getElementById(
            "memberList"
        );


    if (!memberList) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const ward =
        Number(
            params.get(
                "ward"
            )
        );


    const wardTitle =
        document.getElementById(
            "wardTitle"
        );


    if (
        !ward ||
        ward < 1 ||
        ward > 13
    ) {

        memberList.innerHTML =
            `
            <div class="empty-state">
                Invalid ward.
            </div>
            `;

        return;

    }


    if (wardTitle) {

        wardTitle.textContent =
            `Ward ${ward}`;

    }


    memberList.innerHTML =
        `
        <div class="empty-state">
            Loading members...
        </div>
        `;


    try {

        const members =
            await supabaseRequest(
                `members?ward=eq.${ward}&status=eq.accepted&select=id,full_name,phone,ward,polling_booth,exco_position&order=full_name.asc`,
                {
                    method: "GET"
                }
            );


        if (
            !members ||
            members.length === 0
        ) {

            memberList.innerHTML =
                `
                <div class="empty-state">
                    No accepted members in this ward yet.
                </div>
                `;

            return;

        }


        memberList.innerHTML =
            "";


        members.forEach(
            member => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "member-row";


                row.innerHTML = `

                    <strong>
                        ${escapeHTML(
                            member.full_name
                        )}
                    </strong>

                    <br>

                    <small>
                        Polling Booth:
                        ${escapeHTML(
                            member.polling_booth
                        )}
                    </small>

                    ${
                        member.exco_position
                            ? `
                                <br>

                                <span class="exco-badge">
                                    ${escapeHTML(
                                        member.exco_position
                                    )}
                                </span>
                            `
                            : ""
                    }

                `;


                memberList.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            error
        );


        memberList.innerHTML =
            `
            <div class="empty-state">
                Unable to load members.
            </div>
            `;

    }

}


loadWardPage();


/* =========================================================
   PUBLIC MEMBER COUNT
========================================================= */

async function loadPublicMemberCount() {

    const counter =
        document.getElementById(
            "publicMemberCount"
        );


    if (!counter) {
        return;
    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/members?status=eq.accepted&select=id`,
                {

                    headers: {

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

                        "Prefer":
                            "count=exact"

                    }

                }
            );


        const range =
            response.headers.get(
                "content-range"
            );


        if (!range) {
            return;
        }


        const count =
            range.split(
                "/"
            )[1];


        if (
            count &&
            count !== "*"
        ) {

            counter.textContent =
                count;

        }

    } catch (error) {

        console.error(
            error
        );

    }

}


loadPublicMemberCount();


/* =========================================================
   SUPABASE AUTH
========================================================= */

let currentAdmin = null;


/* =========================================================
   GET ACCESS TOKEN
========================================================= */

function getAccessToken() {

    return localStorage.getItem(
        "supabase_access_token"
    );

}


/* =========================================================
   AUTHENTICATED ADMIN REQUEST
========================================================= */

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


    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoint}`,
            {

                ...options,

                headers: {

                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_PUBLISHABLE_KEY,

                    "Authorization":
                        `Bearer ${token}`,

                    ...(options.headers || {})

                }

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
            "ADMIN REQUEST ERROR:",
            data
        );


        throw new Error(
            data?.message ||
            data?.hint ||
            data?.msg ||
            `Request failed (${response.status})`
        );

    }


    return data;

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "adminEmail"
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


            const button =
                document.getElementById(
                    "loginBtn"
                );


            button.disabled =
                true;


            button.textContent =
                "Logging in...";


            message.textContent =
                "";


            try {

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
                        data?.msg ||
                        data?.error_description ||
                        "Invalid email or password."
                    );

                }


                localStorage.setItem(
                    "supabase_access_token",
                    data.access_token
                );


                localStorage.setItem(
                    "supabase_refresh_token",
                    data.refresh_token
                );


                message.textContent =
                    "Login successful.";

                message.style.color =
                    "#166534";


                await checkAdminSession();


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                message.textContent =
                    error.message;


                message.style.color =
                    "#b91c1c";

            }


            button.disabled =
                false;


            button.textContent =
                "Login";

        }
    );

}


/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

async function checkAdminSession() {

    const login =
        document.getElementById(
            "adminLogin"
        );


    const dashboard =
        document.getElementById(
            "adminDashboard"
        );


    if (
        !login ||
        !dashboard
    ) {

        return;

    }


    const token =
        getAccessToken();


    if (!token) {

        login.style.display =
            "block";

        dashboard.style.display =
            "none";

        return;

    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/user`,
                {

                    headers: {

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY,

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        if (!response.ok) {

            throw new Error(
                "Session expired."
            );

        }


        currentAdmin =
            await response.json();


        login.style.display =
            "none";


        dashboard.style.display =
            "block";


        await loadAdminData();

        await loadExcoManager();


    } catch (error) {

        console.error(
            error
        );


        localStorage.removeItem(
            "supabase_access_token"
        );


        localStorage.removeItem(
            "supabase_refresh_token"
        );


        login.style.display =
            "block";


        dashboard.style.display =
            "none";

    }

}


checkAdminSession();


/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

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


            localStorage.removeItem(
                "supabase_access_token"
            );


            localStorage.removeItem(
                "supabase_refresh_token"
            );


            window.location.reload();

        }
    );

}


/* =========================================================
   LOAD ADMIN DATA
========================================================= */

async function loadAdminData() {

    const pendingList =
        document.getElementById(
            "pendingList"
        );


    if (!pendingList) {
        return;
    }


    try {

        const members =
            await adminRequest(
                "members?select=*&order=created_at.desc"
            );


        const pending =
            members.filter(
                member =>
                    member.status ===
                    "pending"
            );


        const accepted =
            members.filter(
                member =>
                    member.status ===
                    "accepted"
            );


        const declined =
            members.filter(
                member =>
                    member.status ===
                    "declined"
            );


        setText(
            "pendingCount",
            pending.length
        );


        setText(
            "acceptedCount",
            accepted.length
        );


        setText(
            "declinedCount",
            declined.length
        );


        renderPending(
            pending
        );


        renderAccepted(
            accepted
        );


        renderWardMembers(
            accepted
        );


    } catch (error) {

        console.error(
            error
        );


        pendingList.innerHTML =
            `
            <div class="empty-state">
                ${escapeHTML(
                    error.message
                )}
            </div>
            `;

    }

}


/* =========================================================
   SET TEXT
========================================================= */

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


/* =========================================================
   PENDING REGISTRATIONS
========================================================= */

function renderPending(
    members
) {

    const container =
        document.getElementById(
            "pendingList"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (
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


    members.forEach(
        member => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "registration-item";


            item.innerHTML = `

                <h4>
                    ${escapeHTML(
                        member.full_name
                    )}
                </h4>

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
                        class="small-btn accept-btn"
                        onclick="approveMember(${member.id})"
                    >
                        ✓ Accept
                    </button>

                    <button
                        class="small-btn decline-btn"
                        onclick="rejectMember(${member.id})"
                    >
                        ✕ Decline
                    </button>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   APPROVE
========================================================= */

async function approveMember(
    id
) {

    if (
        !confirm(
            "Accept this registration?"
        )
    ) {

        return;

    }


    try {

        await adminRequest(
            `members?id=eq.${id}`,
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
                            "accepted",

                        reviewed_at:
                            new Date()
                                .toISOString()

                    })

            }
        );


        await loadAdminData();


    } catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================================
   REJECT
========================================================= */

async function rejectMember(
    id
) {

    if (
        !confirm(
            "Decline this registration?"
        )
    ) {

        return;

    }


    try {

        await adminRequest(
            `members?id=eq.${id}`,
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
                            "declined",

                        reviewed_at:
                            new Date()
                                .toISOString()

                    })

            }
        );


        await loadAdminData();


    } catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================================
   ACCEPTED MEMBERS
========================================================= */

function renderAccepted(
    members
) {

    const container =
        document.getElementById(
            "acceptedList"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (
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


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "member-table-wrapper";


    wrapper.innerHTML = `

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
                        Ward
                    </th>

                    <th>
                        Booth
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

                ${members.map(
                    member => `

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
                                "Not selected"
                            )}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;


    container.appendChild(
        wrapper
    );

}


/* =========================================================
   WARD MEMBERS
========================================================= */

function renderWardMembers(
    members
) {

    const container =
        document.getElementById(
            "wardMembers"
        );


    if (!container) {
        return;
    }


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


        section.innerHTML = `

            <h4>
                Ward ${ward}
                (${wardMembers.length})
            </h4>

            ${
                wardMembers.length === 0
                    ? `
                        <p>
                            No accepted members.
                        </p>
                      `
                    : `
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

                                    ${wardMembers.map(
                                        member => `

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

                                    `
                                    ).join("")}

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

}


/* =========================================================
   EXCO POSITIONS
========================================================= */

const EXCO_POSITIONS = [

    "Chairperson",

    "Vice Chairperson",

    "Secretary",

    "Assistant Secretary",

    "Treasurer",

    "Financial Secretary",

    "Public Relations Officer",

    "Organising Secretary",

    "Welfare Officer"

];


/* =========================================================
   LOAD EXCO
========================================================= */

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

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
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


                const emptyOption =
                    document.createElement(
                        "option"
                    );


                emptyOption.value =
                    "";


                emptyOption.textContent =
                    "Select member";


                select.appendChild(
                    emptyOption
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


                row.appendChild(
                    label
                );


                row.appendChild(
                    select
                );


                container.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            error
        );


        container.innerHTML =
            `
            <div class="empty-state">
                ${escapeHTML(
                    error.message
                )}
            </div>
            `;

    }

}


/* =========================================================
   SAVE EXCO
========================================================= */

const saveExcoBtn =
    document.getElementById(
        "saveExcoBtn"
    );


if (saveExcoBtn) {

    saveExcoBtn.addEventListener(
        "click",
        async function () {

            saveExcoBtn.disabled =
                true;


            saveExcoBtn.textContent =
                "Saving...";


            try {

                /*
                   CLEAR OLD EXCO
                */

                await adminRequest(
                    "members?status=eq.accepted",
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


                /*
                   ASSIGN NEW EXCO
                */

                const selects =
                    document.querySelectorAll(
                        "#excoManager select"
                    );


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


                    await adminRequest(
                        `members?id=eq.${memberId}`,
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


                alert(
                    "EXCO positions saved successfully."
                );


                await loadAdminData();

                await loadExcoManager();


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    error.message
                );

            }


            saveExcoBtn.disabled =
                false;


            saveExcoBtn.textContent =
                "Save EXCO Positions";

        }
    );

}
