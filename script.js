// Navigation Handling
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    // Show selected section
    document.getElementById(`${sectionId}-section`).classList.add('active');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Toggle logic
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');
});

// Dynamic Rate Chart highlighting based on chosen delivery timeline
const deliverySelect = document.getElementById('deliveryTime');
deliverySelect.addEventListener('change', (e) => {
    // Reset all rows
    document.querySelectorAll('.rate-table tbody tr').forEach(row => row.classList.remove('highlight-rate'));
    
    // Highlight specific row
    const selection = e.target.value;
    if(selection === 'urgent') document.querySelector('.rate-urgent').classList.add('highlight-rate');
    if(selection === 'standard') document.querySelector('.rate-standard').classList.add('highlight-rate');
    if(selection === 'flexible') document.querySelector('.rate-flexible').classList.add('highlight-rate');
});

// Submit Handlers connecting to backend
document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdfFile', document.getElementById('customerPdf').files[0]);
    formData.append('timeline', deliverySelect.value);

    try {
        const response = await fetch('http://localhost:5000/api/customer-submit', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the backend server.');
    }
});

document.getElementById('writerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('writerName').value);
    formData.append('college', document.getElementById('writerCollege').value);
    formData.append('branch', document.getElementById('writerBranch').value);
    formData.append('handwritingSample', document.getElementById('writerSample').files[0]);
    formData.append('minPages', document.getElementById('minPages').value);

    try {
        const response = await fetch('http://localhost:5000/api/writer-submit', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the backend server.');
    }
});


// ==========================================
// YOUR EXISTING CODE (Lines 1 - 76)
// ==========================================


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
 const greetingKeywords = ['hi', 'Hi', 'HI', 'HELLO', 'Hello', 'he', 'hey', 'hey body', 'hi bhai', 'hello brother'];
    if (greetingKeywords.some(keyword => input.includes(keyword))) {
        return "Hi welcome to writer's World , how may i help you";
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

// my account section

/* ==========================================================================
   MY ACCOUNT / DASHBOARD ENGINE & AUTOMATIC ROUTER
   ========================================================================== */

// 1. AUTOMATIC NAVIGATION & SECTION TOGGLER (PURE JS FIX)
function setupSectionNavigation() {
    // Find all top-level sections on the page dynamically
    const allSections = document.querySelectorAll('section, main > div, .page-section, .section');
    
    // Attempt to locate the account panel wrapper
    const accountSection = document.getElementById('profileName')?.closest('section, main > div, .section, [id*="account"], [id*="dashboard"]') 
                          || document.getElementById('account-section') 
                          || document.getElementById('dashboard');

    if (!accountSection) return;

    // Helper: Show specific target and hide all other sections
    window.activateSection = function(targetEl) {
        allSections.forEach(sec => {
            if (sec === targetEl) {
                sec.style.display = ''; // Restore original CSS display state
            } else if (sec.contains(targetEl) || targetEl.contains(sec)) {
                sec.style.display = ''; 
            } else {
                sec.style.display = 'none'; // Hide non-active sections
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Auto-detect and attach click handlers to all navigation links on the page
    const navLinks = document.querySelectorAll('a, button, nav *');
    navLinks.forEach(link => {
        const text = link.innerText?.toLowerCase().trim() || '';
        const href = link.getAttribute('href') || '';

        // If link points to "My Account" / "Dashboard" / "Profile"
        if (text.includes('account') || text.includes('dashboard') || text.includes('profile') || href.includes('account')) {
            link.addEventListener('click', (e) => {
                activateSection(accountSection);
            });
        } 
        // If link points to any other section (Home, About, Services, etc.)
        else if (href.startsWith('#') && href.length > 1) {
            const targetId = href.substring(1);
            const targetSec = document.getElementById(targetId);
            if (targetSec) {
                link.addEventListener('click', (e) => {
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


// 3. DASHBOARD ROLE SWITCHER
function switchDashboardRole(role) {
    const isWriter = (role === 'writer');
    const db = isWriter ? freelancerDataStore : clientDataStore;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    // 1. Update Core Bio Details
    setVal('profileName', db.name);
    setVal('profileEmail', db.email);
    setVal('profilePhone', db.phone);
    setVal('profileMeta', db.roleMeta);
    
    // Toggle academic sections for Writer
    const writerSection = document.getElementById('writerSpecificDetails');
    if (writerSection) {
        if (isWriter) {
            setVal('profileCollege', db.college);
            setVal('profileBranch', db.branch);
            setVal('profileCapacity', db.capacity);
            writerSection.style.display = 'block';
        } else {
            writerSection.style.display = 'none';
        }
    }

    // 2. Load Top Quick Stats Row
    setVal('statTitle1', db.stats.col1.title);
    setVal('statValue1', db.stats.col1.val);

    setVal('statTitle2', db.stats.col2.title);
    setVal('statValue2', db.stats.col2.val);

    setVal('statTitle3', db.stats.col3.title);
    setVal('statValue3', db.stats.col3.val);

    // 3. Update active table structure dynamically
    const tableHeaderRow = document.getElementById('tableHeaderRow');
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        tableBody.innerHTML = ''; // Clear old entries

        if (isWriter) {
            setVal('panelTitle', "My Allocated Writing Tasks");
            if (tableHeaderRow) {
                tableHeaderRow.innerHTML = `
                    <th>Task ID</th>
                    <th>Work Details</th>
                    <th>Total Earnings</th>
                    <th>Status</th>
                `;
            }
            db.jobs.forEach(job => {
                const row = `<tr>
                    <td><strong>${job.id}</strong></td>
                    <td>${job.details}</td>
                    <td><strong style="color: #2ecc71;">${job.pay}</strong></td>
                    <td><span class="badge ${job.badge}">${job.status}</span></td>
                </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        } else {
            setVal('panelTitle', "Active Assignment Orders");
            if (tableHeaderRow) {
                tableHeaderRow.innerHTML = `
                    <th>Order ID</th>
                    <th>Task Description</th>
                    <th>Timeline Priority</th>
                    <th>Status</th>
                `;
            }
            db.orders.forEach(order => {
                const row = `<tr>
                    <td><strong>${order.id}</strong></td>
                    <td>${order.details}</td>
                    <td>${order.time}</td>
                    <td><span class="badge ${order.badge}">${order.status}</span></td>
                </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        }
    }

    // 4. Update timeline details
    const timelineContainer = document.getElementById('activityTimeline');
    if (timelineContainer) {
        timelineContainer.innerHTML = '';
        db.activityLog.forEach(log => {
            const item = `
                <div class="timeline-item">
                    <div class="timeline-time">${log.time}</div>
                    <div class="timeline-content">${log.event}</div>
                </div>
            `;
            timelineContainer.insertAdjacentHTML('beforeend', item);
        });
    }
}


// 4. INITIALIZE ON LOAD
document.addEventListener('DOMContentLoaded', () => {
    // Setup section visibility and auto navigation
    setupSectionNavigation();

    // Render initial Customer details safely
    const profileCheck = document.getElementById('profileName');
    if (profileCheck) {
        switchDashboardRole('customer');
    }
});
/* ==========================================================================
   DYNAMIC LOCAL STORAGE INTEGRATION
   ========================================================================== */

// 1. SAVE CUSTOMER DATA ON FORM SUBMISSION
const customerForm = document.getElementById('customerForm');
if (customerForm) {
    customerForm.addEventListener('submit', function(e) {
        // Prevent page reload so we can save data first
        e.preventDefault(); 
        
        // Grab values from your existing input elements (adjust IDs to match yours)
        const customerData = {
            name: document.getElementById('custName')?.value || "Active Customer",
            email: document.getElementById('custEmail')?.value || "customer@example.com",
            phone: document.getElementById('custPhone')?.value || "+91 XXXXX XXXXX",
            roleMeta: "Registered Client",
            stats: {
                col1: { title: "Jobs Ordered", val: "1 File" },
                col2: { title: "Total Spent", val: "Rs 60" }, // Mock calculation
                col3: { title: "Completed", val: "0 Files" }
            },
            orders: [
                { 
                    id: "#GW-" + Math.floor(1000 + Math.random() * 9000), // Generates random ID
                    details: "Your Submitted Assignment Task", 
                    time: "Standard (2-4 days)", 
                    status: "Pending", 
                    badge: "badge-pending" 
                }
            ],
            activityLog: [
                { time: "Just Now", event: "Successfully registered and submitted assignment order." }
            ]
        };

        // Save into Browser Storage
        localStorage.setItem('savedCustomer', JSON.stringify(customerData));
        alert('Order submitted successfully! Your profile has been created.');
        
        // Redirect to Account View
        showView('account-view');
        switchDashboardRole('customer');
    });
}

// 2. SAVE WRITER DATA ON FORM SUBMISSION
const writerForm = document.getElementById('writerForm');
if (writerForm) {
    writerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const writerData = {
            name: document.getElementById('writerName')?.value || "Active Writer",
            email: document.getElementById('writerEmail')?.value || "writer@example.com",
            phone: document.getElementById('writerPhone')?.value || "+91 XXXXX XXXXX",
            roleMeta: "Verified Candidate",
            college: document.getElementById('writerCollege')?.value || "Not Specified",
            branch: document.getElementById('writerBranch')?.value || "Not Specified",
            capacity: "5 Pages/Day",
            stats: {
                col1: { title: "Jobs Written", val: "0 Tasks" },
                col2: { title: "Total Earned", val: "Rs 0.00" },
                col3: { title: "In Pipeline", val: "0 Tasks" }
            },
            jobs: [
                { id: "#TASK-NEW", details: "Profile Under Verification Process", pay: "N/A", status: "In Progress", badge: "badge-progress" }
            ],
            activityLog: [
                { time: "Just Now", event: "Applied to Writer's World. Awaiting profile check." }
            ]
        };

        // Save into Browser Storage
        localStorage.setItem('savedWriter', JSON.stringify(writerData));
        alert('Application received! Your writer profile is ready to view.');
        
        // Redirect to Account View
        showView('account-view');
        switchDashboardRole('writer');
    });
}

// 3. UPDATED DASHBOARD SWITCHER TO READ DYNAMIC STORAGE
function switchDashboardRole(role) {
    const isWriter = (role === 'writer');
    
    // Check if we have saved data in localStorage, otherwise fall back to default hardcoded store
    let db;
    if (isWriter) {
        const storedWriter = localStorage.getItem('savedWriter');
        db = storedWriter ? JSON.parse(storedWriter) : freelancerDataStore;
    } else {
        const storedCustomer = localStorage.getItem('savedCustomer');
        db = storedCustomer ? JSON.parse(storedCustomer) : clientDataStore;
    }

    // Update HTML Elements exactly like before
    document.getElementById('profileName').innerText = db.name;
    document.getElementById('profileEmail').innerText = db.email;
    document.getElementById('profilePhone').innerText = db.phone;
    document.getElementById('profileMeta').innerText = db.roleMeta;
    
    const writerSection = document.getElementById('writerSpecificDetails');
    if (writerSection) {
        if (isWriter) {
            document.getElementById('profileCollege').innerText = db.college || "N/A";
            document.getElementById('profileBranch').innerText = db.branch || "N/A";
            document.getElementById('profileCapacity').innerText = db.capacity || "N/A";
            writerSection.style.display = 'block';
        } else {
            writerSection.style.display = 'none';
        }
    }

    document.getElementById('statTitle1').innerText = db.stats.col1.title;
    document.getElementById('statValue1').innerText = db.stats.col1.val;

    document.getElementById('statTitle2').innerText = db.stats.col2.title;
    document.getElementById('statValue2').innerText = db.stats.col2.val;

    document.getElementById('statTitle3').innerText = db.stats.col3.title;
    document.getElementById('statValue3').innerText = db.stats.col3.val;

    const tableHeaderRow = document.getElementById('tableHeaderRow');
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        tableBody.innerHTML = '';

        if (isWriter) {
            document.getElementById('panelTitle').innerText = "My Allocated Writing Tasks";
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
            document.getElementById('panelTitle').innerText = "Active Assignment Orders";
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
        e.preventDefault(); // Stop page reload
        
        const enteredEmail = document.getElementById('loginEmail').value.trim().toLowerCase();
        const selectedRole = document.getElementById('loginRole').value;
        
        if (selectedRole === 'customer') {
            // Check for customer data in local browser storage
            const savedCustomerRaw = localStorage.getItem('savedCustomer');
            
            if (savedCustomerRaw) {
                const customerData = JSON.parse(savedCustomerRaw);
                // Verify if the email address matches what they registered with
                if (customerData.email.toLowerCase() === enteredEmail) {
                    alert(`Welcome back, ${customerData.name}!`);
                    showView('account-view');
                    
                    // Set dropdown to Customer and load their specific details
                    document.getElementById('userRoleSelector').value = 'customer';
                    switchDashboardRole('customer');
                    return;
                }
            }
            alert("No customer account found matching this email address on this browser.");
            
        } else if (selectedRole === 'writer') {
            // Check for writer data in local browser storage
            const savedWriterRaw = localStorage.getItem('savedWriter');
            
            if (savedWriterRaw) {
                const writerData = JSON.parse(savedWriterRaw);
                // Verify if the writer email address matches
                if (writerData.email.toLowerCase() === enteredEmail) {
                    alert(`Welcome back to the studio, ${writerData.name}!`);
                    showView('account-view');
                    
                    // Set dropdown to Writer and load their specific details
                    document.getElementById('userRoleSelector').value = 'writer';
                    switchDashboardRole('writer');
                    return;
                }
            }
            alert("No writer profile found matching this email address on this browser.");
        }
    });
}

