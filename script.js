document.addEventListener("DOMContentLoaded", () => {
    // --- Smooth Scrolling for Navbar Links (Good practice for navigation) ---
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Adjust for fixed navbar height if needed
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Contact Section Animation (Optional, but good for UX) ---
    const contactSection = document.getElementById("contact");
    if (contactSection) {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    contactSection.classList.add("visible"); // Add 'visible' class for CSS animations
                    observer.unobserve(contactSection); // Stop observing once visible
                }
            },
            {
                threshold: 0.2, // Trigger when 20% of the section is visible
            }
        );
        observer.observe(contactSection);
    }

    // --- Skills Section Animation (from your previous script) ---
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress-fill');
    const skillCircles = document.querySelectorAll('.progress-ring-fg');

    if (skillsSection) {
        const skillsObserverOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.5 // trigger when 50% of the element is visible
        };

        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate skill bars
                    progressBars.forEach(bar => {
                        const width = bar.style.width; // Get the target width
                        bar.style.width = '0%'; // Reset to 0 for re-animation
                        setTimeout(() => {
                            bar.style.width = width; // Animate to target width
                        }, 100);
                    });

                    // Animate skill circles
                    skillCircles.forEach(circle => {
                        const offset = circle.style.strokeDashoffset; // Get the target offset
                        circle.style.strokeDashoffset = circle.getTotalLength(); // Set to full length to hide
                        setTimeout(() => {
                            circle.style.strokeDashoffset = offset; // Animate back to original
                        }, 100);
                    });
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, skillsObserverOptions);
        skillsObserver.observe(skillsSection);
    }


    // --- Contact Form Local Storage Logic ---
    // Make sure your form has id="contact-form" and inputs have name="name", name="email", name="message"
    const form = document.getElementById("contact-form");
    // This is where submissions will be displayed. Make sure you have <ul id="submission-list"> in your HTML
    const submissionList = document.getElementById("submission-list");

    // Function to display submissions from local storage
    function displaySubmissions() {
        const data = JSON.parse(localStorage.getItem("contactSubmissions")) || []; // Retrieve data
        submissionList.innerHTML = ""; // Clear existing list to avoid duplicates

        if (data.length === 0) {
            submissionList.innerHTML = '<p style="color: #a0a0a0; text-align: center; margin-top: 20px;">No messages yet.</p>';
            return;
        }

        data.forEach((entry, index) => {
            const li = document.createElement("li");
            li.style.padding = "10px 0";
            li.style.borderBottom = "1px solid #3d506d";
            li.style.wordBreak = "break-word"; // Prevent long words from overflowing

            li.innerHTML = `
                <strong>#${index + 1}</strong><br />
                <strong>Name:</strong> ${entry.name}<br />
                <strong>Email:</strong> <a href="mailto:${entry.email}" style="color: #00bcd4; text-decoration: none;">${entry.email}</a><br />
                <strong>Message:</strong> ${entry.message}<br />
                <small style="color: #a0a0a0;"><em>Submitted on: ${new Date(entry.submittedAt).toLocaleString()}</em></small>
            `;
            submissionList.appendChild(li);
        });
    }

    // Display submissions on page load
    displaySubmissions();

    // Add event listener for form submission
    if (form) { // Ensure the form element exists
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevent the default form submission (page reload)

            // Get values from form inputs using their 'name' attributes
            const name = form.elements["name"].value.trim();
            const email = form.elements["email"].value.trim();
            const message = form.elements["message"].value.trim();

            // Basic validation
            if (!name || !email || !message) {
                alert("Please fill in all required fields.");
                return; // Stop execution if validation fails
            }

            // Optional: Basic email format validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }


            // Create an object to store contact data
            const contactData = {
                name,
                email,
                message,
                submittedAt: new Date().toISOString(), // Timestamp for when it was submitted
            };

            // Retrieve existing data from local storage, or initialize an empty array
            const existingData = JSON.parse(localStorage.getItem("contactSubmissions")) || [];
            // Add the new submission to the array
            existingData.push(contactData);
            // Save the updated array back to local storage
            localStorage.setItem("contactSubmissions", JSON.stringify(existingData));

            alert("Thank you! Your message has been saved locally.");
            form.reset(); // Clear the form fields after submission
            displaySubmissions(); // Refresh the displayed list of submissions
        });
    }
});