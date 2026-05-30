/* ==========================================================================
   TSS Medical Education - Core JavaScript Component
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Splash Screen Logo Intro (index.html only)
    // -------------------------------------------------------------
    const splashOverlay = document.getElementById('intro-splash-overlay');
    if (splashOverlay) {
        // Automatically fade out the splash screen after 2.5 seconds
        setTimeout(() => {
            splashOverlay.classList.add('fade-away-splash');
            // Remove from DOM layout after transition completes to prevent click blockage
            setTimeout(() => {
                splashOverlay.style.display = 'none';
            }, 800);
        }, 2200);
    }

    // -------------------------------------------------------------
    // Header Shrink Scroll Event
    // -------------------------------------------------------------
    const stickyHeader = document.querySelector('.global-header-sticky');
    if (stickyHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                stickyHeader.classList.add('header-shrunk');
            } else {
                stickyHeader.classList.remove('header-shrunk');
            }
        });
    }

    // -------------------------------------------------------------
    // 2. Sticky Course Sub-Navigation & Smooth Scroll Spy
    // -------------------------------------------------------------
    const courseAnchorsBar = document.getElementById('sticky-course-anchors-bar');
    const courseButtons = document.querySelectorAll('.course-anchor-btn');
    const courseSections = document.querySelectorAll('.course-dedicated-section');

    if (courseAnchorsBar && courseButtons.length > 0) {
        // Handle click transitions for jumps
        courseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    // Compute offsets to account for double sticky headers (nav + sub-nav)
                    const headerHeight = document.querySelector('.global-header-sticky') ? document.querySelector('.global-header-sticky').offsetHeight : 120;
                    const subnavHeight = courseAnchorsBar.offsetHeight;
                    const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - headerHeight - subnavHeight + 2;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Set active visual state immediately
                    courseButtons.forEach(b => b.classList.remove('active-anchor'));
                    btn.classList.add('active-anchor');
                }
            });
        });

        // Set active anchor dynamically on scroll
        window.addEventListener('scroll', () => {
            let currentActiveSectionId = '';
            const headerHeight = document.querySelector('.global-header-sticky') ? document.querySelector('.global-header-sticky').offsetHeight : 120;
            const subnavHeight = courseAnchorsBar.offsetHeight;
            const triggerBoundary = window.scrollY + headerHeight + subnavHeight + 50;

            courseSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (triggerBoundary >= sectionTop && triggerBoundary < sectionTop + sectionHeight) {
                    currentActiveSectionId = section.getAttribute('id');
                }
            });

            if (currentActiveSectionId) {
                courseButtons.forEach(btn => {
                    if (btn.getAttribute('data-target') === currentActiveSectionId) {
                        btn.classList.add('active-anchor');
                        // Center active button inside the horizontal scrolling bar for mobile
                        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    } else {
                        btn.classList.remove('active-anchor');
                    }
                });
            }
        });
    }

    // Handle hash anchoring on load (e.g. coming from homepage cards)
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetElement = document.getElementById(hash);
        if (targetElement) {
            setTimeout(() => {
                const headerHeight = document.querySelector('.global-header-sticky') ? document.querySelector('.global-header-sticky').offsetHeight : 120;
                const subnavHeight = courseAnchorsBar ? courseAnchorsBar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight - subnavHeight + 2;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 500); // Small timeout to ensure pages are rendered
        }
    }

    // -------------------------------------------------------------
    // 3. Mobile Hamburger Menu Toggle
    // -------------------------------------------------------------
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksList = document.getElementById('nav-links-list');

    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => {
            navLinksList.classList.toggle('mobile-show-nav');
            // Change hamburger character to "X" and back
            if (navLinksList.classList.contains('mobile-show-nav')) {
                menuToggle.innerHTML = '✕';
            } else {
                menuToggle.innerHTML = '☰';
            }
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinksList.contains(e.target)) {
                navLinksList.classList.remove('mobile-show-nav');
                menuToggle.innerHTML = '☰';
            }
        });
    }

    // -------------------------------------------------------------
    // 4. Hero Slideshow Auto Transitions (index.html only)
    // -------------------------------------------------------------
    const slides = document.querySelectorAll('.hero-slide-item');
    if (slides.length > 0) {
        let currentSlideIdx = 0;
        const slideIntervalTime = 5000; // 5 seconds change

        function nextHeroSlide() {
            slides[currentSlideIdx].classList.remove('slide-active');
            currentSlideIdx = (currentSlideIdx + 1) % slides.length;
            slides[currentSlideIdx].classList.add('slide-active');
        }

        setInterval(nextHeroSlide, slideIntervalTime);
    }

    // -------------------------------------------------------------
    // 5. Scroll-Driven Fading & Sliding Animation (IntersectionObserver)
    // -------------------------------------------------------------
    const scrollAnimatedElements = document.querySelectorAll(
        '.reveal-on-scroll, .reveal-fade-in, .reveal-slide-left, .reveal-slide-right'
    );

    if ('IntersectionObserver' in window && scrollAnimatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-revealed');
                    // Stop observing once animation triggers (forces state persistence)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // viewport
            threshold: 0.15, // 15% item visible trigger
            rootMargin: '0px 0px -40px 0px' // offset bottom border slightly
        });

        scrollAnimatedElements.forEach(el => {
            scrollObserver.observe(el);
        });
    } else {
        // Fallback for older browsers: show all items immediately
        scrollAnimatedElements.forEach(el => el.classList.add('active-revealed'));
    }

    // -------------------------------------------------------------
    // 6. Interactive FAQ Accordion
    // -------------------------------------------------------------
    const faqCards = document.querySelectorAll('.faq-card-element');
    if (faqCards.length > 0) {
        faqCards.forEach(card => {
            const header = card.querySelector('.faq-header-click');
            const body = card.querySelector('.faq-body-content-wrap');

            header.addEventListener('click', () => {
                const isOpen = card.classList.contains('faq-active');

                // Close all other FAQs for clean single accordian behavior
                faqCards.forEach(c => {
                    c.classList.remove('faq-active');
                    const b = c.querySelector('.faq-body-content-wrap');
                    if (b) b.style.maxHeight = null;
                });

                if (!isOpen) {
                    card.classList.add('faq-active');
                    // Calculate precise scrollHeight for fluid transition
                    body.style.maxHeight = body.scrollHeight + 'px';
                }
            });
        });
    }

    // -------------------------------------------------------------
    // 7. Dynamic Expected Salary Fills (Viewport Trigger)
    // -------------------------------------------------------------
    const salaryFills = document.querySelectorAll('.salary-range-fill-indicator');
    if ('IntersectionObserver' in window && salaryFills.length > 0) {
        const salaryObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fillBar = entry.target;
                    const percentTarget = fillBar.getAttribute('data-percent');
                    fillBar.style.width = percentTarget + '%';
                    observer.unobserve(fillBar);
                }
            });
        }, { threshold: 0.2 });

        salaryFills.forEach(bar => {
            salaryObserver.observe(bar);
        });
    } else {
        // Fallback
        salaryFills.forEach(bar => {
            const pct = bar.getAttribute('data-percent');
            bar.style.width = pct + '%';
        });
    }

    // -------------------------------------------------------------
    // 8. Dynamic Gallery Filter Buttons
    // -------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.gallery-filter-action-btn');
    const galleryItems = document.querySelectorAll('.gallery-pinterest-photo-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active class
                filterButtons.forEach(b => b.classList.remove('filter-active'));
                btn.classList.add('filter-active');

                const filterTarget = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');

                    if (filterTarget === 'all' || itemCategory === filterTarget) {
                        // Smoothly transition cards in
                        item.style.display = 'block';
                        // Trigger micro delay to let display:block apply before scaling
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        // Smooth transition out
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        // Wait for transition before display collapse
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }

    // -------------------------------------------------------------
    // 9. Floating Enquiry Popup Modal & Form Submissions
    // -------------------------------------------------------------
    const modalBackdrop = document.getElementById('global-enquiry-modal');
    const closeBtn = document.getElementById('modal-close-x-btn');
    const floatingBtn = document.getElementById('floating-enquiry-fab');
    const triggerButtons = document.querySelectorAll('.trigger-modal-popup');

    const enquiryForm = document.getElementById('enquiry-form-element');
    const formSuccessScreen = document.getElementById('modal-success-screen');

    // Helper to open modal
    function openGlobalModal(preselectCourse = '') {
        if (modalBackdrop) {
            modalBackdrop.classList.add('modal-open');
            document.body.style.overflow = 'hidden'; // prevent background body scrolling

            // Pre-select target course selection if provided
            if (preselectCourse) {
                const selectElement = document.getElementById('modal-course-select');
                if (selectElement) {
                    selectElement.value = preselectCourse;
                }
            }
        }
    }

    // Helper to close modal
    function closeGlobalModal() {
        if (modalBackdrop) {
            modalBackdrop.classList.remove('modal-open');
            document.body.style.overflow = ''; // restore scrolling

            // Reset success screen and forms after modal completely transitions out
            setTimeout(() => {
                if (enquiryForm) {
                    enquiryForm.reset();
                    enquiryForm.style.display = 'block';
                }
                if (formSuccessScreen) {
                    formSuccessScreen.style.display = 'none';
                }
            }, 400);
        }
    }

    // Floating Button Action
    if (floatingBtn) {
        floatingBtn.addEventListener('click', () => {
            openGlobalModal();
        });
    }

    // Trigger Popup on arbitrary apply buttons across all sections
    if (triggerButtons.length > 0) {
        triggerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const preSelect = btn.getAttribute('data-course-select') || '';
                openGlobalModal(preSelect);
            });
        });
    }

    // Close actions
    if (closeBtn) closeBtn.addEventListener('click', closeGlobalModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeGlobalModal();
        });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('modal-open')) {
            closeGlobalModal();
        }
    });

    // Handle Form Submissions with custom animated success state
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple validation
            const nameInput = document.getElementById('modal-name-input');
            const mobileInput = document.getElementById('modal-mobile-input');
            if (nameInput.value.trim() === '' || mobileInput.value.trim() === '') {
                alert('Please fill out your Name and Mobile Number.');
                return;
            }

            // Simulate form submission
            enquiryForm.style.display = 'none';
            if (formSuccessScreen) {
                formSuccessScreen.style.display = 'block';
                // Trigger animation of success circle
                const checkCircle = formSuccessScreen.querySelector('.success-check-circle');
                if (checkCircle) {
                    checkCircle.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        checkCircle.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        checkCircle.style.transform = 'scale(1)';
                    }, 50);
                }
            }

            // Auto-close modal after 4 seconds of showing success message
            setTimeout(() => {
                closeGlobalModal();
            }, 3500);
        });
    }

    // Handle inline admissions form on admissions.html and contact page forms
    const inlineAdmissionsForm = document.getElementById('inline-admissions-form');
    if (inlineAdmissionsForm) {
        inlineAdmissionsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your enquiry! Our admissions coordinator will contact you shortly on your mobile number.');
            inlineAdmissionsForm.reset();
        });
    }

    const inlineContactForm = document.getElementById('inline-contact-form');
    if (inlineContactForm) {
        inlineContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your message has been sent successfully. We will get back to you soon!');
            inlineContactForm.reset();
        });
    }

    // -------------------------------------------------------------
    // 10. Infinite Scrolling Horizontal Tickers / Cloners
    // -------------------------------------------------------------
    // Since our CSS animation handles text tickers infinitely, we just duplicate
    // items inside code programmatically to ensure perfectly seamless scrolling
    // regardless of screen size.
    const tickerTracks = document.querySelectorAll('.ticker-track-elements');
    tickerTracks.forEach(track => {
        const clonedContent = track.innerHTML;
        track.innerHTML = clonedContent + clonedContent; // double content for infinite seamless wrapping
    });

    const galleryTracks = document.querySelectorAll('.gallery-strip-track');
    galleryTracks.forEach(track => {
        const clonedContent = track.innerHTML;
        track.innerHTML = clonedContent + clonedContent; // double for infinite wrap
    });

    const courseTickerTracks = document.querySelectorAll('.course-ticker-track');
    courseTickerTracks.forEach(track => {
        const clonedContent = track.innerHTML;
        track.innerHTML = clonedContent + clonedContent; // double content for infinite wrap
    });
});
