const filters = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project[data-type]");
const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

if (menuToggle && primaryNav) {
    const closeMobileMenu = () => {
        primaryNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!expanded));
        primaryNav.classList.toggle("open", !expanded);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 620) {
            closeMobileMenu();
        }
    });
}

const projectsMenuButton = document.getElementById("projectsMenuButton");
const projectsMenu = document.getElementById("projectsMenu");

if (projectsMenuButton && projectsMenu) {
    const closeProjectsMenu = () => {
        projectsMenu.classList.remove("open");
        projectsMenuButton.setAttribute("aria-expanded", "false");
    };

    const openProjectsMenu = () => {
        projectsMenu.classList.add("open");
        projectsMenuButton.setAttribute("aria-expanded", "true");
    };

    projectsMenuButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const expanded = projectsMenuButton.getAttribute("aria-expanded") === "true";
        if (expanded) {
            closeProjectsMenu();
            return;
        }
        openProjectsMenu();
    });

    projectsMenuButton.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            openProjectsMenu();
            const firstLink = projectsMenu.querySelector("a");
            if (firstLink) {
                firstLink.focus();
            }
        }
    });

    projectsMenu.addEventListener("click", () => {
        closeProjectsMenu();
    });

    document.addEventListener("click", (event) => {
        if (!projectsMenu.contains(event.target) && event.target !== projectsMenuButton) {
            closeProjectsMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeProjectsMenu();
        }
    });
}

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filters.forEach((item) => item.classList.remove("active"));
        btn.classList.add("active");

        projects.forEach((project) => {
            const match = filter === "all" || project.dataset.type === filter;
            project.classList.toggle("hide", !match);
        });
    });
});

const processNotes = {
    "Pulse City Intro Sequence": "Storyboards were drafted first, then clips were edited to beats using rhythm mapping.",
    "Interactive Magazine Spread": "Built with semantic sections and scroll-triggered CSS classes for editorial pacing.",
    "Forest Ambience Soundscape": "Layered ambient field recordings, then shaped tonal balance with EQ automation.",
    "Culture Zine Layout System": "A 6-column modular grid ensured consistency across print and digital formats."
};

document.querySelectorAll(".mini-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const key = button.dataset.project;
        const note = processNotes[key] || "Process notes coming soon.";
        window.alert(key + "\n\n" + note);
    });
});

const galleryButtons = document.querySelectorAll("#galleryGrid button");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const closeModal = document.getElementById("closeModal");

galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const image = button.querySelector("img");
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = button.dataset.caption || image.alt;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
    });
});

const closeModalView = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
};

closeModal.addEventListener("click", closeModalView);
modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModalView();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModalView();
});

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
            }
        });
    },
    { threshold: 0.15 }
);
revealItems.forEach((item) => observer.observe(item));

const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}

const heroVideo = document.getElementById("heroVideo");
const heroMuteToggle = document.getElementById("heroMuteToggle");
const heroVideoSource = document.getElementById("heroVideoSource");
const heroVideoStatus = document.getElementById("heroVideoStatus");

if (heroVideo && heroMuteToggle) {
    const sourceCandidates = [
        "media/videos/bannervideo.mp4",
        "./media/videos/bannervideo.mp4",
        "media/videos/BannerVideo.mp4"
    ];
    let currentSourceIndex = 0;

    const updateMuteButton = () => {
        const muted = heroVideo.muted;
        heroMuteToggle.textContent = muted ? "Unmute Video" : "Mute Video";
        heroMuteToggle.setAttribute("aria-pressed", String(!muted));
    };

    const setVideoSource = (index) => {
        if (!heroVideoSource) return;
        heroVideoSource.src = sourceCandidates[index];
        heroVideo.load();
    };

    const tryAutoplayMuted = async () => {
        heroVideo.muted = true;
        try {
            await heroVideo.play();
        } catch (error) {
            // Ignore if autoplay is blocked until user interaction.
        }
        updateMuteButton();
    };

    if (heroVideoSource) {
        heroVideoSource.addEventListener("error", () => {
            currentSourceIndex += 1;
            if (currentSourceIndex < sourceCandidates.length) {
                setVideoSource(currentSourceIndex);
                tryAutoplayMuted();
                return;
            }

            if (heroVideoStatus) {
                heroVideoStatus.hidden = false;
            }
        });
    }

    tryAutoplayMuted();

    heroMuteToggle.addEventListener("click", async () => {
        heroVideo.muted = !heroVideo.muted;
        if (heroVideo.paused) {
            try {
                await heroVideo.play();
            } catch (error) {
                // Ignore play rejection and keep current state.
            }
        }
        updateMuteButton();
    });
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    const statusEl = document.getElementById("formStatus");

    const fields = {
        fullName: {
            input: document.getElementById("fullName"),
            error: document.getElementById("fullNameError"),
            validate: (value) => {
                const trimmed = value.trim();
                const namePattern = /^[A-Za-z][A-Za-z .'-]{1,79}$/;

                if (!trimmed) return "Full name is required.";
                if (!namePattern.test(trimmed)) {
                    return "Enter a valid full name (letters, spaces, apostrophes, periods, or hyphens).";
                }
                return "";
            }
        },
        emailAddress: {
            input: document.getElementById("emailAddress"),
            error: document.getElementById("emailAddressError"),
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Email address is required.";

                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!emailPattern.test(trimmed)) return "Enter a valid email address.";
                return "";
            }
        },
        projectTopic: {
            input: document.getElementById("projectTopic"),
            error: document.getElementById("projectTopicError"),
            validate: (value) => {
                if (!value) return "Please select a project topic.";
                return "";
            }
        },
        message: {
            input: document.getElementById("message"),
            error: document.getElementById("messageError"),
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Message is required.";
                if (trimmed.length < 20) return "Message must be at least 20 characters long.";
                if (trimmed.length > 600) return "Message must be less than 600 characters.";
                return "";
            }
        }
    };

    const updateFieldUI = (fieldConfig, message) => {
        if (!fieldConfig || !fieldConfig.input || !fieldConfig.error) return;
        fieldConfig.error.textContent = message;
        fieldConfig.input.classList.remove("invalid", "valid");

        if (message) {
            fieldConfig.input.classList.add("invalid");
            fieldConfig.input.setAttribute("aria-invalid", "true");
            return;
        }

        fieldConfig.input.classList.add("valid");
        fieldConfig.input.setAttribute("aria-invalid", "false");
    };

    const validateField = (fieldConfig) => {
        const message = fieldConfig.validate(fieldConfig.input.value);
        updateFieldUI(fieldConfig, message);
        return !message;
    };

    Object.values(fields).forEach((fieldConfig) => {
        if (!fieldConfig.input) return;
        fieldConfig.input.addEventListener("blur", () => {
            validateField(fieldConfig);
        });
        fieldConfig.input.addEventListener("input", () => {
            if (fieldConfig.input.classList.contains("invalid")) {
                validateField(fieldConfig);
            }
        });
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const allValid = Object.values(fields).every((fieldConfig) => validateField(fieldConfig));
        if (!allValid) {
            if (statusEl) {
                statusEl.textContent = "Please fix the highlighted fields and try again.";
                statusEl.classList.remove("success");
                statusEl.classList.add("error");
            }
            return;
        }

        if (statusEl) {
            statusEl.textContent = "Message validated successfully. You can now integrate this form with your backend.";
            statusEl.classList.remove("error");
            statusEl.classList.add("success");
        }

        contactForm.reset();
        Object.values(fields).forEach((fieldConfig) => {
            fieldConfig.error.textContent = "";
            fieldConfig.input.classList.remove("invalid", "valid");
            fieldConfig.input.removeAttribute("aria-invalid");
        });
    });
}
