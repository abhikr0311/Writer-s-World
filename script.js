// Converts an uploaded PDF/file into an openable data string
function convertFileToDataUrl(file) {
    return new Promise((resolve) => {
        if (!file) resolve('No file uploaded');
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result); // Full openable file string
        };
        reader.onerror = function() {
            resolve('Error reading file');
        };
        reader.readAsDataURL(file);
    });
}

// SheetDB Endpoint Config
const SHEETDB_URL = 'https://sheetdb.io/api/v1/eoq57kfymw90c';

// Navigation Handling
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
// Check if target section exists before adding 'active' class
    const targetSection = document.getElementById(`${sectionId}-section`) || document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.warn(`Section with ID "${sectionId}-section" was not found in HTML.`);
    }    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// View Section Switcher Helper
function showView(viewId) {
    showSection(viewId.replace('-view', ''));
}

// Mobile Menu Toggle logic
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
    });
}

// Dynamic Rate Chart highlighting based on chosen delivery timeline
const deliverySelect = document.getElementById('deliveryTime');
if (deliverySelect) {
    deliverySelect.addEventListener('change', (e) => {
        // Reset all rows
        document.querySelectorAll('.rate-table tbody tr').forEach(row => row.classList.remove('highlight-rate'));
        
        // Highlight specific row
        const selection = e.target.value;
        if(selection === 'urgent') document.querySelector('.rate-urgent')?.classList.add('highlight-rate');
        if(selection === 'standard') document.querySelector('.rate-standard')?.classList.add('highlight-rate');
        if(selection === 'flexible') document.querySelector('.rate-flexible')?.classList.add('highlight-rate');
    });
}

/* ==========================================================================
   CHATBOT CONTROLLER MODULE
   ========================================================================== */

// Toggle chatbot window visibility
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const trigger = document.getElementById('chatTrigger');
    
    if (!chatWindow || !trigger) return;

    if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
        chatWindow.style.display = 'flex';
        trigger.innerHTML = '▼'; // Changes icon to a collapse arrow when open
        
        // Initialize quick-reply shortcuts if it's a fresh chat session
        const msgContainer = document.getElementById('chatMessages');
        if (msgContainer && msgContainer.children.length <= 1) {
            setupQuickReplies();
        }
        if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    } else {
        chatWindow.style.display = 'none';
        trigger.innerHTML = '💬'; // Changes icon back to a message bubble
    }
}

// Generate Quick Menu Buttons dynamically
function setupQuickReplies() {
    // Remove old ones if they somehow exist
    const oldReplies = document.getElementById('quick-replies');
    if (oldReplies) oldReplies.remove();

    const replyContainer = document.createElement('div');
    replyContainer.style.display = 'flex';
    replyContainer.style.flexDirection = 'column';
    replyContainer.style.gap = '8px';
    replyContainer.style.marginTop = '10px';
    replyContainer.id = 'quick-replies';

    const questions = [
        "What is the purpose of this website?",
        "What are the rates for customers?",
        "How much can a writer earn?",
        "How do I get my work started?"
    ];

    questions.forEach(q => {
        const btn = document.createElement('button');
        btn.innerText = q;
        btn.style.background = '#ffffff';
        btn.style.border = '1px solid #3498db';
        btn.style.color = '#3498db';
        btn.style.padding = '8px 12px';
        btn.style.borderRadius = '15px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '13px';
        btn.style.textAlign = 'left';
        btn.style.transition = 'all 0.2s';
        
        btn.onclick = () => {
            const inputField = document.getElementById('chatInput');
            if (inputField) {
                inputField.value = q;
                sendChatMessage();
            }
        };
        replyContainer.appendChild(btn);
    });

    const msgContainer = document.getElementById('chatMessages');
    if (msgContainer) msgContainer.appendChild(replyContainer);
}

// Handle Enter keypress in input field
function handleChatKey(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Send and process messages
function sendChatMessage() {
    const inputEl = document.getElementById('chatInput');
    if (!inputEl) return;

    const userText = inputEl.value.trim();
    if (!userText) return;

    // Clean up temporary quick replies container once user submits
    const quickReplies = document.getElementById('quick-replies');
    if (quickReplies) quickReplies.remove();

    // 1. Display User message in the window
    appendMessage(userText, 'user-msg');
    inputEl.value = '';

    // 2. Compute matching response from dictionary
    const botResponse = getBotResponse(userText.toLowerCase());
    
    // Simulate natural response latency (400ms)
    setTimeout(() => {
        appendMessage(botResponse, 'bot-msg');
        // Re-append shortcut menu options to keep user engaged
        setupQuickReplies();
    }, 400);
}

// Helper to inject message blocks into UI layout
function appendMessage(text, className) {
    const msgContainer = document.getElementById('chatMessages');
    if (!msgContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerText = text;
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

// Comprehensive Synonym & Answer Matrix 
function getBotResponse(input) {
    
    // Motivation / Lazy / Aim / Mission / Purpose
    const missionKeywords = ['lazy', 'motive', 'purpose', 'why', 'cheating', 'help', 'benefit', 'vision', 'aim', 'depend'];
    if (missionKeywords.some(keyword => input.includes(keyword))) {
        return "Our website is designed specifically to help busy students who are preparing for competitive exams and do not have enough time to manage repetitive assignment file work. \n\nThis platform does NOT motivate students to become lazy; it acts strictly as a helping hand so you can focus 100% of your valuable energy on your exam syllabus!";
    }
    
    // Customer Price / Cost / Rates / Charges / Fees
    const customerKeywords = ['customer', 'price', 'cost', 'rate', 'charge', 'fee', 'how much to pay', 'buyer', 'order rate'];
    if (customerKeywords.some(keyword => input.includes(keyword))) {
        return "Our customer rates are highly optimized and kept to a minimum:\n\n" +
               "⏳ Urgent (less than 2 days): Rs 6 per page\n" +
               "📅 Standard (2 to 4 days): Rs 5 per page\n" +
               "☕ Normal (greater than 4 days): Rs 4 per page";
    }

    const greetingKeywords = ['hi', 'hello', 'he', 'hey', 'hey body', 'hi bhai', 'hello brother'];
    if (greetingKeywords.some(keyword => input.includes(keyword))) {
        return "Hi welcome to Writer's World, how may I help you?";
    }

    // Writer Earnings / Salary / Income / Making money
    const writerKeywords = ['earn', 'salary', 'income', 'writer pay', 'make money', 'writing job', 'payment', 'payout'];
    if (writerKeywords.some(keyword => input.includes(keyword))) {
        return "Yes, you can earn good money by writing assignments! Here is the payout chart for our writers:\n\n" +
               "🔥 Urgent Tasks (< 2 days): Rs 3 per page\n" +
               "⚡ Standard Tasks (2-4 days): Rs 2.5 per page\n" +
               "✅ Normal Tasks (> 4 days): Rs 2 per page";
    }

    // Forms / Workflow / How to start / Applications
    const workflowKeywords = ['start', 'apply', 'form', 'how to', 'register', 'submit', 'join', 'process'];
    if (workflowKeywords.some(keyword => input.includes(keyword))) {
        return "To get your writing work completed, simply fill out the 'Customer Form' accessible from the Home page card. \n\nIf you want to become an official member of Writer's World and earn money, choose the 'Writer' section card on the Home page and submit your handwriting profile details!";
    }

    // Fallback response for unmapped conversations
    return "I didn't quite catch that. You can ask me things like:\n• 'Is this site making me lazy?'\n• 'What are the page costs for customers?'\n• 'How much do writers get paid?'\n• 'Where do I submit the forms?'";
}

/* ==========================================================================
   MY ACCOUNT / DASHBOARD ENGINE & AUTOMATIC ROUTER
   ========================================================================== */

// 1. AUTOMATIC NAVIGATION & SECTION TOGGLER (PURE JS FIX)
function setupSectionNavigation() {
    const allSections = document.querySelectorAll('section, main > div, .page-section, .section');
    
    const accountSection = document.getElementById('profileName')?.closest('section, main > div, .section, [id*="account"], [id*="dashboard"]') 
                          || document.getElementById('account-section') 
                          || document.getElementById('dashboard');

    if (!accountSection) return;

    window.activateSection = function(targetEl) {
        allSections.forEach(sec => {
            if (sec === targetEl || sec.contains(targetEl) || targetEl.contains(sec)) {
                sec.style.display = ''; 
            } else {
                sec.style.display = 'none'; 
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navLinks = document.querySelectorAll('a, button, nav *');
    navLinks.forEach(link => {
        const text = link.innerText?.toLowerCase().trim() || '';
        const href = link.getAttribute('href') || '';

        if (text.includes('account') || text.includes('dashboard') || text.includes('profile') || href.includes('account')) {
            link.addEventListener('click', () => {
                activateSection(accountSection);
            });
        } 
        else if (href.startsWith('#') && href.length > 1) {
            const targetId = href.substring(1);
            const targetSec = document.getElementById(targetId);
            if (targetSec) {
                link.addEventListener('click', () => {
                    activateSection(targetSec);
                });
            }
        }
    });
}

// 2. SIMULATED MOCK DATABASES
const clientDataStore = {
    name: "Rahul Sharma",
    email: "rahul.sharma@collegemail.com",
    phone: "+91 94567 21000",
    roleMeta: "Active Client",
    stats: {
        col1: { title: "Jobs Ordered", val: "8 Files" },
        col2: { title: "Total Spent", val: "Rs 432" },
        col3: { title: "Completed", val: "5 Files" }
    },
    orders: [
        { id: "#GW-9821", details: "Physics Practical (8 Pages)", time: "Urgent (< 2 days)", status: "Pending", badge: "badge-pending" },
        { id: "#GW-9541", details: "DBMS Lab Manual (24 Pages)", time: "Standard (2-4 days)", status: "In Progress", badge: "badge-progress" },
        { id: "#GW-9011", details: "Chemistry Assignment (10 Pages)", time: "Normal (> 4 days)", status: "Completed", badge: "badge-success" }
    ],
    activityLog: [
        { time: "10:30 AM", event: "Uploaded 'physics_project.pdf' file to assignment #GW-9821." },
        { time: "Yesterday", event: "Processed payment of Rs 120 for assignment #GW-9541." },
        { time: "05 July", event: "Successfully downloaded Chemistry Assignment completion PDF." }
    ]
};

const freelancerDataStore = {
    name: "Ananya Priya",
    email: "ananya.priya@university.edu.in",
    phone: "+91 88776 55432",
    roleMeta: "Verified Elite Writer",
    college: "LNMIIT, Jaipur",
    branch: "Electronics & Comm.",
    capacity: "8 Pages/Day",
    stats: {
        col1: { title: "Jobs Written", val: "14 Tasks" },
        col2: { title: "Total Earned", val: "Rs 1,240" },
        col3: { title: "In Pipeline", val: "3 Tasks" }
    },
    jobs: [
        { id: "#TASK-401", details: "Math Assignment (12 Pages)", pay: "Rs 30.00 (Standard)", status: "In Progress", badge: "badge-progress" },
        { id: "#TASK-392", details: "History Notes Writing (20 Pages)", pay: "Rs 40.00 (Normal)", status: "Completed", badge: "badge-success" },
        { id: "#TASK-351", details: "CS Lab Coding Print (15 Pages)", pay: "Rs 45.00 (Urgent)", status: "Completed", badge: "badge-success" }
    ],
    activityLog: [
        { time: "11:15 AM", event: "Uploaded handwriting completion sheets for #TASK-392." },
        { time: "2 Days Ago", event: "Joined 'Writers World' elite writing division." },
        { time: "01 July", event: "Successfully received payout of Rs 600 directly to UPI." }
    ]
};

// 4. INITIALIZE ON LOAD
document.addEventListener('DOMContentLoaded', () => {
    setupSectionNavigation();

    const profileCheck = document.getElementById('profileName');
    if (profileCheck) {
        switchDashboardRole('customer');
    }
});

/* ==========================================================================
   DYNAMIC LOCAL STORAGE & GOOGLE SHEETS INTEGRATION
   ========================================================================== */

// -------------------------------------------------------------
// 2. CLIENT PORTAL FORM HANDLER (Replace your existing customerForm block)
// -------------------------------------------------------------
// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4BS4kFZ_4cmH-Qa42bj1KB1fMq82Eoudh-8MQfXvQW3jcOeLNikOQz1Q3oYfBlRsp/exec';

// -------------------------------------------------------------
// NAVIGATION HELPERS
// -------------------------------------------------------------
function showSection(sectionId) {
    document.querySelectorAll('.view-section').forEach(section => {
        if (section) section.classList.remove('active');
    });
    
    const target = document.getElementById(sectionId) || document.getElementById(`${sectionId}-section`);
    if (target) {
        target.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showView(viewId) {
    const cleanId = viewId.replace('-view', '');
    showSection(cleanId);
}

// -------------------------------------------------------------
// 1. CLIENT / CUSTOMER FORM HANDLER
// -------------------------------------------------------------
const customerForm = document.getElementById('customerForm');
if (customerForm) {
    customerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = customerForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const fullName = document.getElementById('custName')?.value || '';
        const rollNo = document.getElementById('custRollNo')?.value || '';
        const email = document.getElementById('custEmail')?.value || '';
        
        const collegeSelect = document.getElementById('custCollege');
        const college = collegeSelect ? collegeSelect.options[collegeSelect.selectedIndex]?.text : '';
        
        const deliveryTime = document.getElementById('deliveryTime')?.value || 'Flexible';
        const deliveryAddress = document.getElementById('custAddress')?.value || '';
        const message = document.getElementById('custMessage')?.value || '';

        const pdfFileInput = document.getElementById('customerPdf')?.files[0];

        const sendCustomerData = async (base64File = '', fileName = '', mimeType = '') => {
            const payload = {
                formType: "customer",
                name: fullName,
                rollNo: rollNo,
                email: email,
                college: college,
                deliveryTime: deliveryTime,
                address: deliveryAddress,
                message: message,
                fileData: base64File,
                fileName: fileName,
                mimeType: mimeType
            };

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(payload)
                });

                const res = await response.json();
                if (res.result === 'success') {
                    alert('Client request submitted successfully! PDF saved to Google Drive and linked in Google Sheet.');
                    customerForm.reset();
                } else {
                    alert('Error saving customer data: ' + res.error);
                }
            } catch (err) {
                console.error(err);
                alert('Network error submitting client request.');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        };

        if (pdfFileInput) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                sendCustomerData(evt.target.result, pdfFileInput.name, pdfFileInput.type);
            };
            reader.readAsDataURL(pdfFileInput);
        } else {
            sendCustomerData();
        }

        try {
            if (typeof switchDashboardRole === 'function') switchDashboardRole('customer');
            if (typeof showView === 'function') showView('account-view');
        } catch (err) {
            console.warn('Navigation warning:', err);
        }
    });
}

// -------------------------------------------------------------
// 2. WRITER APPLICATION FORM HANDLER
// -------------------------------------------------------------
const writerForm = document.getElementById('writerForm');
if (writerForm) {
    writerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = writerForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const fullName = document.getElementById('writerName')?.value || '';
        const mobile = document.getElementById('writerPhone')?.value || '';
        const email = document.getElementById('writerEmail')?.value || '';
        const college = document.getElementById('writerCollege')?.value || '';
        const branch = document.getElementById('writerBranch')?.value || '';
        const minPages = document.getElementById('minPages')?.value || '';

        const sampleFileInput = document.getElementById('writerSample')?.files[0];

        const sendWriterData = async (base64File = '', fileName = '', mimeType = '') => {
            const payload = {
                formType: "writer",
                name: fullName,
                mobile: mobile,
                email: email,
                college: college,
                branch: branch,
                minPages: minPages,
                fileData: base64File,
                fileName: fileName,
                mimeType: mimeType
            };

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(payload)
                });

                const res = await response.json();
                if (res.result === 'success') {
                    alert('Writer application submitted! Sample saved to Google Drive and linked in Google Sheet.');
                    writerForm.reset();
                } else {
                    alert('Error saving writer application: ' + res.error);
                }
            } catch (err) {
                console.error(err);
                alert('Network error submitting writer application.');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        };

        if (sampleFileInput) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                sendWriterData(evt.target.result, sampleFileInput.name, sampleFileInput.type);
            };
            reader.readAsDataURL(sampleFileInput);
        } else {
            sendWriterData();
        }

        try {
            if (typeof switchDashboardRole === 'function') switchDashboardRole('writer');
            if (typeof showView === 'function') showView('account-view');
        } catch (err) {
            console.warn('Navigation warning:', err);
        }
    });
}
// 3. UPDATED DASHBOARD SWITCHER TO READ DYNAMIC STORAGE
function switchDashboardRole(role) {
    const isWriter = (role === 'writer');
    
    let db;
    if (isWriter) {
        const storedWriter = localStorage.getItem('savedWriter');
        db = storedWriter ? JSON.parse(storedWriter) : freelancerDataStore;
    } else {
        const storedCustomer = localStorage.getItem('savedCustomer');
        db = storedCustomer ? JSON.parse(storedCustomer) : clientDataStore;
    }

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    setVal('profileName', db.name);
    setVal('profileEmail', db.email);
    setVal('profilePhone', db.phone);
    setVal('profileMeta', db.roleMeta);
    
    const writerSection = document.getElementById('writerSpecificDetails');
    if (writerSection) {
        if (isWriter) {
            setVal('profileCollege', db.college || "N/A");
            setVal('profileBranch', db.branch || "N/A");
            setVal('profileCapacity', db.capacity || "N/A");
            writerSection.style.display = 'block';
        } else {
            writerSection.style.display = 'none';
        }
    }

    setVal('statTitle1', db.stats.col1.title);
    setVal('statValue1', db.stats.col1.val);

    setVal('statTitle2', db.stats.col2.title);
    setVal('statValue2', db.stats.col2.val);

    setVal('statTitle3', db.stats.col3.title);
    setVal('statValue3', db.stats.col3.val);

    const tableHeaderRow = document.getElementById('tableHeaderRow');
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        tableBody.innerHTML = '';

        if (isWriter) {
            setVal('panelTitle', "My Allocated Writing Tasks");
            if (tableHeaderRow) {
                tableHeaderRow.innerHTML = `<th>Task ID</th><th>Work Details</th><th>Total Earnings</th><th>Status</th>`;
            }
            db.jobs.forEach(job => {
                tableBody.insertAdjacentHTML('beforeend', `<tr>
                    <td><strong>${job.id}</strong></td>
                    <td>${job.details}</td>
                    <td><strong style="color: #2ecc71;">${job.pay}</strong></td>
                    <td><span class="badge ${job.badge}">${job.status}</span></td>
                </tr>`);
            });
        } else {
            setVal('panelTitle', "Active Assignment Orders");
            if (tableHeaderRow) {
                tableHeaderRow.innerHTML = `<th>Order ID</th><th>Task Description</th><th>Timeline Priority</th><th>Status</th>`;
            }
            db.orders.forEach(order => {
                tableBody.insertAdjacentHTML('beforeend', `<tr>
                    <td><strong>${order.id}</strong></td>
                    <td>${order.details}</td>
                    <td>${order.time}</td>
                    <td><span class="badge ${order.badge}">${order.status}</span></td>
                </tr>`);
            });
        }
    }

    const timelineContainer = document.getElementById('activityTimeline');
    if (timelineContainer) {
        timelineContainer.innerHTML = '';
        db.activityLog.forEach(log => {
            timelineContainer.insertAdjacentHTML('beforeend', `
                <div class="timeline-item">
                    <div class="timeline-time">${log.time}</div>
                    <div class="timeline-content">${log.event}</div>
                </div>
            `);
        });
    }
}

/* ==========================================================================
   LOCAL ACCOUNT AUTHENTICATION PORTAL
   ========================================================================== */

const localLoginForm = document.getElementById('localLoginForm');
if (localLoginForm) {
    localLoginForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const enteredEmail = document.getElementById('loginEmail')?.value.trim().toLowerCase();
        const selectedRole = document.getElementById('loginRole')?.value;
        
        if (selectedRole === 'customer') {
            const savedCustomerRaw = localStorage.getItem('savedCustomer');
            
            if (savedCustomerRaw) {
                const customerData = JSON.parse(savedCustomerRaw);
                if (customerData.email.toLowerCase() === enteredEmail) {
                    alert(`Welcome back, ${customerData.name}!`);
                    if (typeof showView === 'function') showView('account-view');
                    
                    const roleSelector = document.getElementById('userRoleSelector');
                    if (roleSelector) roleSelector.value = 'customer';
                    switchDashboardRole('customer');
                    return;
                }
            }
            alert("No customer account found matching this email address on this browser.");
            
        } else if (selectedRole === 'writer') {
            const savedWriterRaw = localStorage.getItem('savedWriter');
            
            if (savedWriterRaw) {
                const writerData = JSON.parse(savedWriterRaw);
                if (writerData.email.toLowerCase() === enteredEmail) {
                    alert(`Welcome back to the studio, ${writerData.name}!`);
                    if (typeof showView === 'function') showView('account-view');
                    
                    const roleSelector = document.getElementById('userRoleSelector');
                    if (roleSelector) roleSelector.value = 'writer';
                    switchDashboardRole('writer');
                    return;
                }
            }
            alert("No writer profile found matching this email address on this browser.");
        }
    });
}