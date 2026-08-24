/* =========================================================
   EKITI STATE WOMEN OF INFLUENCE
   ADO LOCAL GOVERNMENT
   SUPABASE + WEBSITE JAVASCRIPT
========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://yrqwttihowbzofqmormr.supabase.co";

/*
   REPLACE THIS WITH YOUR SUPABASE PUBLISHABLE KEY.

   DO NOT PUT YOUR sb_secret_ KEY HERE.
*/

const SUPABASE_PUBLISHABLE_KEY =
    "YOUR_SUPABASE_PUBLISHABLE_KEY";


/* =========================================================
   SUPABASE REQUEST HELPER
========================================================= */

async function supabaseRequest(
    endpoint,
    options = {}
) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

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

            data = JSON.parse(text);

        } catch {

            data = text;

        }

    }


    if (!response.ok) {

        throw new Error(
            data?.message ||
            data?.error_description ||
            data?.hint ||
            "Supabase request failed"
        );

    }


    return data;
}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");


if (menuBtn && navMenu) {

    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   WARD LIST
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


        wardGrid.appendChild(card);

    }

}


createWardCards();


/* =========================================================
   REGISTRATION FORM
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


            const ward =
                document
                    .getElementById("ward")
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


            const bankName =
                document
                    .getElementById(
                        "bankName"
                    )
                    .value
                    .trim();


            const message =
                document.getElementById(
                    "formMessage"
                );


            const submitButton =
                document.getElementById(
                    "submitBtn"
                );


            if (
                !fullName ||
                !phone ||
                !ward ||
                !pollingBooth ||
                !accountName ||
                !bankName
            ) {

                message.textContent =
                    "Please complete all fields.";

                message.style.color =
                    "#b91c1c";

                return;

            }


            submitButton.disabled =
                true;


            submitButton.textContent =
                "Submitting...";


            message.textContent =
                "Submitting your registration...";


            message.style.color =
                "#7c1d4a";


            try {

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
                                    Number(ward),

                                polling_booth:
                                    pollingBooth,

                                account_name:
                                    accountName,

                                bank_name:
                                    bankName,

                                status:
                                    "pending"

                            })

                    }
                );


                message.textContent =
                    "Registration submitted successfully. Please wait for admin approval.";

                message.style.color =
                    "#166534";


                registrationForm.reset();


            } catch (error) {

                console.error(
                    error
                );


                message.textContent =
                    "Registration failed. Please try again.";

                message.style.color =
                    "#b91c1c";

            }


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Submit Registration";

        }
    );

}


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
            params.get("ward")
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
            `<div class="empty-state">
                Invalid ward.
            </div>`;

        return;

    }


    if (wardTitle) {

        wardTitle.textContent =
            `Ward ${ward}`;

    }


    memberList.innerHTML =
        `<div class="empty-state">
            Loading members...
        </div>`;


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
                `<div class="empty-state">
                    No accepted members in this ward yet.
                </div>`;

            return;

        }


        memberList.innerHTML = "";


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
            `<div class="empty-state">
                Unable to load members.
            </div>`;

    }

}


loadWardPage();


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

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

        const result =
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
            result.headers.get(
                "content-range"
            );


        if (range) {

            const count =
                range.split("/")[1];


            if (count !== "*") {

                counter.textContent =
                    count;

            }

        }

    } catch (error) {

        console.error(
            error
        );

    }

}


loadPublicMemberCount();


/* =========================================================
   ADMIN LOGIN
========================================================= */

/*
   TEMPORARY FRONT-END ADMIN LOGIN.

   IMPORTANT:
   This is NOT secure authentication.

   We will replace this with Supabase Auth
   before putting the admin system into production.
*/

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                document.getElementById(
                    "adminUsername"
                ).value.trim();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            const message =
                document.getElementById(
                    "adminLoginMessage"
                );


            /*
               TEMPORARY credentials.
            */

            if (
                username === "admin" &&
                password === "Admin123!"
            ) {

                sessionStorage.setItem(
                    "ado_admin_logged_in",
                    "true"
                );


                window.location.href =
                    "admin.html";

            } else {

                message.textContent =
                    "Invalid admin login.";

                message.style.color =
                    "#b91c1c";

            }

        }
    );

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const adminDashboard =
    document.getElementById(
        "adminDashboard"
    );


if (adminDashboard) {

    const loggedIn =
        sessionStorage.getItem(
            "ado_admin_logged_in"
        );


    if (
        loggedIn !== "true"
    ) {

        window.location.href =
            "admin.html";

    }

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "ado_admin_logged_in"
            );


            window.location.href =
                "admin.html";

        }
    );

}


/* =========================================================
   ADMIN MEMBER FUNCTIONS
========================================================= */

async function getMembers(
    status = null,
    ward = null
) {

    let endpoint =
        "members?select=*";


    if (status) {

        endpoint +=
            `&status=eq.${encodeURIComponent(
                status
            )}`;

    }


    if (ward) {

        endpoint +=
            `&ward=eq.${ward}`;

    }


    endpoint +=
        "&order=created_at.desc";


    return await supabaseRequest(
        endpoint,
        {
            method: "GET"
        }
    );

}


/* =========================================================
   ACCEPT MEMBER
========================================================= */

async function acceptMember(
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

        await supabaseRequest(
            `members?id=eq.${id}`,
            {

                method: "PATCH",

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


        alert(
            "Registration accepted."
        );


        loadAdminData();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Unable to accept registration."
        );

    }

}


/* =========================================================
   DECLINE MEMBER
========================================================= */

async function declineMember(
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

        await supabaseRequest(
            `members?id=eq.${id}`,
            {

                method: "PATCH",

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


        alert(
            "Registration declined."
        );


        loadAdminData();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Unable to decline registration."
        );

    }

}


/* =========================================================
   ADMIN DATA
========================================================= */

async function loadAdminData() {

    const pendingList =
        document.getElementById(
            "pendingList"
        );


    const acceptedList =
        document.getElementById(
            "acceptedList"
        );


    if (
        !pendingList &&
        !acceptedList
    ) {

        return;

    }


    if (pendingList) {

        pendingList.innerHTML =
            `<div class="empty-state">
                Loading registrations...
            </div>`;

    }


    try {

        const members =
            await getMembers();


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


        updateAdminStat(
            "pendingCount",
            pending.length
        );


        updateAdminStat(
            "acceptedCount",
            accepted.length
        );


        updateAdminStat(
            "declinedCount",
            declined.length
        );


        renderPendingMembers(
            pending
        );


        renderAcceptedMembers(
            accepted
        );


        renderWardMembers(
            accepted
        );


    } catch (error) {

        console.error(
            error
        );


        if (pendingList) {

            pendingList.innerHTML =
                `<div class="empty-state">
                    Unable to load registrations.
                </div>`;

        }

    }

}


/* =========================================================
   ADMIN STATS
========================================================= */

function updateAdminStat(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   PENDING MEMBERS
========================================================= */

function renderPendingMembers(
    members
) {

    const container =
        document.getElementById(
            "pendingList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        members.length === 0
    ) {

        container.innerHTML =
            `<div class="empty-state">
                No pending registrations.
            </div>`;

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

                <div class="registration-header">

                    <div>

                        <h4>
                            ${escapeHTML(
                                member.full_name
                            )}
                        </h4>

                        <span class="status pending">
                            Pending
                        </span>

                    </div>

                </div>


                <div class="registration-details">

                    <div>
                        <strong>Phone:</strong>
                        ${escapeHTML(
                            member.phone
                        )}
                    </div>

                    <div>
                        <strong>Ward:</strong>
                        ${member.ward}
                    </div>

                    <div>
                        <strong>Polling Booth:</strong>
                        ${escapeHTML(
                            member.polling_booth
                        )}
                    </div>

                    <div>
                        <strong>Account Name:</strong>
                        ${escapeHTML(
                            member.account_name
                        )}
                    </div>

                    <div>
                        <strong>Bank:</strong>
                        ${escapeHTML(
                            member.bank_name
                        )}
                    </div>

                    <div>
                        <strong>Registered:</strong>
                        ${escapeHTML(
                            new Date(
                                member.created_at
                            ).toLocaleString()
                        )}
                    </div>

                </div>


                <div class="registration-actions">

                    <button
                        class="small-btn accept-btn"
                        onclick="acceptMember(${member.id})"
                    >
                        ✓ Accept
                    </button>


                    <button
                        class="small-btn decline-btn"
                        onclick="declineMember(${member.id})"
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
   ACCEPTED MEMBERS
========================================================= */

function renderAcceptedMembers(
    members
) {

    const container =
        document.getElementById(
            "acceptedList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        members.length === 0
    ) {

        container.innerHTML =
            `<div class="empty-state">
                No accepted members yet.
            </div>`;

        return;

    }


    const tableWrapper =
        document.createElement(
            "div"
        );


    tableWrapper.className =
        "member-table-wrapper";


    tableWrapper.innerHTML = `

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
                        Polling Booth
                    </th>

                    <th>
                        Account Name
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
                        </td>

                        <td>
                            ${escapeHTML(
                                member.bank_name
                            )}
                        </td>

                        <td>

                            ${
                                member.exco_position
                                    ? `
                                        <span class="exco-badge">
                                            ${escapeHTML(
                                                member.exco_position
                                            )}
                                        </span>
                                      `
                                    : `
                                        <span class="not-exco">
                                            Not selected
                                        </span>
                                      `
                            }

                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;


    container.appendChild(
        tableWrapper
    );

}


/* =========================================================
   WARD MEMBER LIST
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


    container.innerHTML = "";


    for (
        let ward = 1;
        ward <= 13;
        ward++
    ) {

        const wardMembers =
            members.filter(
                member =>
                    Number(member.ward) ===
                    ward
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "admin-card";


        card.innerHTML = `

            <div class="ward-member-header">

                <div>

                    <strong>
                        Ward ${ward}
                    </strong>

                    <span>
                        ${wardMembers.length}
                        accepted member(s)
                    </span>

                </div>

            </div>

            ${
                wardMembers.length === 0
                    ? `
                        <div class="empty-state">
                            No accepted members
                            in Ward ${ward}.
                        </div>
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

                                                ${
                                                    member.exco_position
                                                        ? escapeHTML(
                                                            member.exco_position
                                                        )
                                                        : "Not selected"
                                                }

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
            card
        );

    }

}


/* =========================================================
   LOAD ADMIN DATA
========================================================= */

if (
    document.getElementById(
        "pendingList"
    ) ||
    document.getElementById(
        "acceptedList"
    )
) {

    loadAdminData();

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

    "Welfare Officer",

    "Organising Secretary"

];


/* =========================================================
   LOAD EXCO MANAGER
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
            await getMembers(
                "accepted"
            );


        container.innerHTML = "";


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


                const empty =
                    document.createElement(
                        "option"
                    );


                empty.value = "";

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
            `<div class="empty-state">
                Unable to load EXCO members.
            </div>`;

    }

}


loadExcoManager();


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

            const selects =
                document.querySelectorAll(
                    "#excoManager select"
                );


            saveExcoBtn.disabled =
                true;


            saveExcoBtn.textContent =
                "Saving...";


            try {

                /*
                   First clear existing EXCO positions.
                */

                await supabaseRequest(
                    "members?status=eq.accepted",
                    {

                        method: "PATCH",

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
                   Assign selected positions.
                */

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


                    await supabaseRequest(
                        `members?id=eq.${memberId}`,
                        {

                            method: "PATCH",

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


                loadAdminData();

                loadExcoManager();


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Unable to save EXCO positions."
                );

            }


            saveExcoBtn.disabled =
                false;


            saveExcoBtn.textContent =
                "Save EXCO Positions";

        }
    );

}
