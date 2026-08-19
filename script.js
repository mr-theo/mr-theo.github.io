/* =========================================================
   THEO DIGITAL — Main JavaScript
========================================================= */

(() => {

  "use strict";


  /* =========================================================
     GLOBAL
  ========================================================= */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* =========================================================
     FOOTER YEAR
  ========================================================= */

  const yearEl =
    document.getElementById("year");

  if (yearEl) {

    yearEl.textContent =
      new Date().getFullYear();

  }


  /* =========================================================
     HEADER SCROLL
  ========================================================= */

  const header =
    document.getElementById("siteHeader");


  if (header) {

    const onScroll = () => {

      if (window.scrollY > 24) {

        header.classList.add("scrolled");

      } else {

        header.classList.remove("scrolled");

      }

    };


    onScroll();


    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive:true
      }
    );

  }


  /* =========================================================
     MOBILE NAVIGATION
  ========================================================= */

  const navToggle =
    document.getElementById("navToggle");

  const mainNav =
    document.getElementById("mainNav");


  if (navToggle && mainNav) {

    navToggle.addEventListener(
      "click",
      () => {

        const isOpen =
          mainNav.classList.toggle("open");


        navToggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );


        navToggle.classList.toggle(
          "active",
          isOpen
        );

      }
    );


    mainNav
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {

            mainNav.classList.remove(
              "open"
            );


            navToggle.setAttribute(
              "aria-expanded",
              "false"
            );


            navToggle.classList.remove(
              "active"
            );

          }
        );

      });

  }


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealEls =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {

    const io =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "in-view"
                );


                io.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold:0.15,

          rootMargin:
            "0px 0px -60px 0px"
        }
      );


    revealEls.forEach(
      (el,index) => {

        el.style.transitionDelay =
          `${Math.min(index * 60,300)}ms`;


        io.observe(el);

      }
    );

  } else {

    revealEls.forEach(
      (el) => {

        el.classList.add(
          "in-view"
        );

      }
    );

  }


  /* =========================================================
     STAT COUNTERS
  ========================================================= */

  const statEls =
    document.querySelectorAll(
      ".stat-num"
    );


  const animateCount =
    (el) => {

      const target =
        parseInt(
          el.dataset.count,
          10
        ) || 0;


      const duration =
        1400;


      const start =
        performance.now();


      const step =
        (now) => {

          const progress =
            Math.min(
              (now - start) /
              duration,
              1
            );


          const eased =
            1 -
            Math.pow(
              1 - progress,
              3
            );


          el.textContent =
            Math.round(
              eased * target
            );


          if (
            progress < 1
          ) {

            requestAnimationFrame(
              step
            );

          }

        };


      requestAnimationFrame(
        step
      );

    };


  if (statEls.length) {

    if (
      "IntersectionObserver"
      in window
    ) {

      const statIo =
        new IntersectionObserver(
          (entries) => {

            entries.forEach(
              (entry) => {

                if (
                  entry.isIntersecting
                ) {

                  animateCount(
                    entry.target
                  );


                  statIo.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold:0.6
          }
        );


      statEls.forEach(
        (el) => {

          statIo.observe(el);

        }
      );

    } else {

      statEls.forEach(
        (el) => {

          el.textContent =
            el.dataset.count;

        }
      );

    }

  }


  /* =========================================================
     CURSOR GLOW
  ========================================================= */

  const glow =
    document.getElementById(
      "cursorGlow"
    );


  if (
    glow &&
    window.matchMedia(
      "(hover: hover)"
    ).matches
  ) {

    window.addEventListener(
      "pointermove",
      (event) => {

        glow.style.transform =
          `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;

      },
      {
        passive:true
      }
    );

  }


  /* =========================================================
     HERO NEURAL NETWORK
  ========================================================= */

  const canvas =
    document.getElementById(
      "network"
    );


  if (canvas) {

    const ctx =
      canvas.getContext("2d");


    let width;
    let height;
    let dpr;

    let nodes = [];

    let animId = null;


    const NODE_COUNT_BASE =
      70;


    const LINK_DIST =
      150;


    function resize() {

      dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );


      width =
        canvas.parentElement
          .clientWidth;


      height =
        canvas.parentElement
          .clientHeight;


      canvas.width =
        width * dpr;


      canvas.height =
        height * dpr;


      canvas.style.width =
        width + "px";


      canvas.style.height =
        height + "px";


      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );


      initNodes();

    }


    function initNodes() {

      const area =
        width * height;


      const count =
        Math.max(
          28,
          Math.min(
            NODE_COUNT_BASE,
            Math.round(
              area / 18000
            )
          )
        );


      nodes =
        Array.from(
          {
            length:count
          },
          () => ({

            x:
              Math.random() *
              width,

            y:
              Math.random() *
              height,

            vx:
              (Math.random() - 0.5)
              * 0.28,

            vy:
              (Math.random() - 0.5)
              * 0.28,

            r:
              Math.random() * 1.4
              + 0.6

          })
        );

    }


    function step() {

      ctx.clearRect(
        0,
        0,
        width,
        height
      );


      /* ---------- Update ---------- */

      nodes.forEach(
        (node) => {

          node.x += node.vx;

          node.y += node.vy;


          if (
            node.x < 0 ||
            node.x > width
          ) {

            node.vx *= -1;

          }


          if (
            node.y < 0 ||
            node.y > height
          ) {

            node.vy *= -1;

          }

        }
      );


      /* ---------- Links ---------- */

      for (
        let i = 0;
        i < nodes.length;
        i++
      ) {

        for (
          let j = i + 1;
          j < nodes.length;
          j++
        ) {

          const a =
            nodes[i];

          const b =
            nodes[j];


          const dx =
            a.x - b.x;

          const dy =
            a.y - b.y;


          const dist =
            Math.sqrt(
              dx * dx +
              dy * dy
            );


          if (
            dist < LINK_DIST
          ) {

            const alpha =
              (
                1 -
                dist / LINK_DIST
              ) * 0.35;


            ctx.strokeStyle =
              `rgba(126,166,255,${alpha})`;


            ctx.lineWidth =
              0.6;


            ctx.beginPath();


            ctx.moveTo(
              a.x,
              a.y
            );


            ctx.lineTo(
              b.x,
              b.y
            );


            ctx.stroke();

          }

        }

      }


      /* ---------- Nodes ---------- */

      nodes.forEach(
        (node) => {

          ctx.beginPath();


          ctx.fillStyle =
            "rgba(184,197,255,0.85)";


          ctx.arc(
            node.x,
            node.y,
            node.r,
            0,
            Math.PI * 2
          );


          ctx.fill();

        }
      );


      animId =
        requestAnimationFrame(
          step
        );

    }


    resize();


    window.addEventListener(
      "resize",
      resize
    );


    if (
      !prefersReducedMotion
    ) {

      step();

    } else {

      step();

      cancelAnimationFrame(
        animId
      );

      animId = null;

    }


    /* ---------- Pause when hero isn't visible ---------- */

    if (
      "IntersectionObserver"
      in window
    ) {

      const heroSection =
        document.getElementById(
          "hero"
        );


      if (heroSection) {

        const heroIo =
          new IntersectionObserver(
            (entries) => {

              entries.forEach(
                (entry) => {

                  if (
                    prefersReducedMotion
                  ) {

                    return;

                  }


                  if (
                    entry.isIntersecting &&
                    !animId
                  ) {

                    step();

                  }


                  if (
                    !entry.isIntersecting &&
                    animId
                  ) {

                    cancelAnimationFrame(
                      animId
                    );

                    animId = null;

                  }

                }
              );

            }
          );


        heroIo.observe(
          heroSection
        );

      }

    }

  }


  /* =========================================================
     ENQUIRY FORM
  ========================================================= */

  const enquiryForm =
    document.getElementById(
      "enquiryForm"
    );


  if (!enquiryForm) {
    return;
  }


  const enquiryType =
    document.getElementById(
      "enquiryType"
    );


  const businessNameField =
    document.getElementById(
      "businessNameField"
    );


  const businessName =
    document.getElementById(
      "businessName"
    );


  const otherField =
    document.getElementById(
      "otherField"
    );


  const otherDescription =
    document.getElementById(
      "otherDescription"
    );


  const enquiryStatus =
    document.getElementById(
      "enquiryStatus"
    );


  const enquirySubmit =
    document.getElementById(
      "enquirySubmit"
    );


  /* =========================================================
     CONDITIONAL FIELDS
  ========================================================= */

  enquiryType.addEventListener(
    "change",
    () => {

      const role =
        enquiryType.value;


      /* ---------- Business Owner ---------- */

      if (
        role === "business_owner"
      ) {

        businessNameField
          .classList
          .add("visible");


        businessName.required =
          true;

      } else {

        businessNameField
          .classList
          .remove("visible");


        businessName.required =
          false;


        businessName.value =
          "";

      }


      /* ---------- Other ---------- */

      if (
        role === "other"
      ) {

        otherField
          .classList
          .add("visible");


        otherDescription.required =
          true;

      } else {

        otherField
          .classList
          .remove("visible");


        otherDescription.required =
          false;


        otherDescription.value =
          "";

      }

    }
  );


  /* =========================================================
     SUBMIT FORM
  ========================================================= */

  enquiryForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      /* ---------- Validate ---------- */

      if (
        !enquiryForm.checkValidity()
      ) {

        enquiryForm.reportValidity();

        return;

      }


      /* ---------- Values ---------- */

      const name =
        document
          .getElementById(
            "enquiryName"
          )
          .value
          .trim();


      const mail =
        document
          .getElementById(
            "enquiryMail"
          )
          .value
          .trim();


      const location =
        document
          .getElementById(
            "enquiryLocation"
          )
          .value
          .trim();


      const phone =
        document
          .getElementById(
            "enquiryPhone"
          )
          .value
          .trim();


      const role =
        enquiryType.value;


      const content =
        document
          .getElementById(
            "enquiryContent"
          )
          .value
          .trim();


      /* =====================================================
         PAYLOAD

         This is what n8n receives.
      ===================================================== */

      const payload = {

        name:name,

        mail:mail,

        location:location,

        phone:phone,

        role:role,

        business_name:
          role === "business_owner"
            ? businessName.value.trim()
            : "",

        other_description:
          role === "other"
            ? otherDescription.value.trim()
            : "",

        content:content

      };


      console.log(
        "Theo Digital enquiry:",
        payload
      );


      /* =====================================================
         LOADING STATE
      ===================================================== */

      enquirySubmit
        .classList
        .add("loading");


      enquirySubmit.disabled =
        true;


      enquiryStatus.textContent =
        "Sending your enquiry...";


      enquiryStatus.className =
        "form-status loading";


      /* =====================================================
         SEND TO N8N
      ===================================================== */

      try {

        const response =
          await fetch(
            "https://n8n-automation-aaih.onrender.com/webhook-test/theoDigitalTrigger",
            {

              method:"POST",

              headers:{
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  payload
                )

            }
          );


        /* ---------- HTTP error ---------- */

        if (!response.ok) {

          throw new Error(
            `Webhook returned HTTP ${response.status}`
          );

        }


        /* ===================================================
           SUCCESS
        =================================================== */

        enquiryStatus.textContent =
          "Thank you. Your enquiry has been sent successfully. We'll get back to you within one business day.";


        enquiryStatus.className =
          "form-status success";


        /* ---------- Reset form ---------- */

        enquiryForm.reset();


        /* ---------- Hide conditional fields ---------- */

        businessNameField
          .classList
          .remove("visible");


        otherField
          .classList
          .remove("visible");


        businessName.required =
          false;


        otherDescription.required =
          false;


      } catch (error) {

        console.error(
          "Theo Digital enquiry failed:",
          error
        );


        enquiryStatus.textContent =
          "We couldn't send your enquiry right now. Please try again in a moment.";


        enquiryStatus.className =
          "form-status error";

      } finally {

        enquirySubmit
          .classList
          .remove("loading");


        enquirySubmit.disabled =
          false;

      }

    }
  );


})();
