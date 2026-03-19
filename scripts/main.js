const dataUrl = `data/portfolio.json?v=${Date.now()}`

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function formatYear(year) {
  return new Date().getFullYear() === year ? String(year) : `${year} – ${new Date().getFullYear()}`;
}

async function typeWriter(el, text, delay = 60) {
  if (!el) return;
  el.textContent = "";
  el.classList.add("typing");

  for (let i = 0; i < text.length; i += 1) {
    el.textContent += text[i];
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  el.classList.remove("typing");
}

async function renderHero(meta) {
  const photo = qs("#heroPhoto");
  if (meta.photo) {
    // Cache-bust to ensure the latest uploaded image loads
    photo.src = `${meta.photo}?v=${Date.now()}`;
  }
  photo.alt = `${meta.name} — Profile photo`;

  const typing = qs("#heroTyping");
  const greeting = "Hi,";
  const nameLine = ` I'm ${meta.name || "Your Name"}.`;

  const subtitle = meta.subtitle || "";
  const tagline = meta.tagline || "";
  const heroSub = qs("#heroSub");
  const heroTagline = qs("#heroTagline");

  await typeWriter(typing, greeting, 70);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await typeWriter(typing, greeting + nameLine, 70);

  if (subtitle) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    await typeWriter(heroSub, subtitle, 35);
  } else if (heroSub) {
    heroSub.textContent = "";
  }

  if (tagline) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    await typeWriter(heroTagline, tagline, 40);
  } else if (heroTagline) {
    heroTagline.textContent = "";
  }
}

function renderAbout(about) {
  qs("#aboutText").textContent = about;
}

function renderEducation(education) {
  const container = qs("#educationTimeline");
  if (!container || !education) return;
  container.innerHTML = "";

  education.forEach((item, i) => {
    const period = item?.period ?? "";
    const degree = item?.degree ?? "";
    const institution = item?.institution ?? "";
    const description = item?.description ?? "";
    const resultHtml = item?.result ? `<div class="edu-result">${item.result}</div>` : "";

    const eduItem = document.createElement("div");
    eduItem.className = "education-item";
    eduItem.setAttribute("data-reveal", "");
    eduItem.style.transitionDelay = `${i * 150}ms`;

    eduItem.innerHTML = `
      <div class="education-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      </div>
      <div class="education-card">
        <span class="edu-period">${period}</span>
        <h3 class="edu-degree">${degree}</h3>
        <div class="edu-institution">${institution}</div>
        ${resultHtml}
        <p class="edu-desc">${description}</p>
      </div>
    `;
    container.append(eduItem);
  });
}

function renderStats(stats) {
  const grid = qs("#statsGrid");
  if (!grid || !stats) return;
  grid.innerHTML = "";

  stats.forEach((stat) => {
    const card = document.createElement("div");
    card.className = "card stat-card";
    card.innerHTML = `
      <span class="stat-value">${stat.value}</span>
      <span class="stat-label">${stat.label}</span>
      <span class="stat-sub">${stat.sub}</span>
    `;
    grid.append(card);
  });
}

function renderExpertise(expertise) {
  const grid = qs("#expertiseGrid");
  if (!grid || !expertise) return;
  grid.innerHTML = "";

  expertise.forEach((area) => {
    const card = document.createElement("div");
    card.className = "card expertise-card";
    
    const h3 = document.createElement("h3");
    h3.textContent = area.title;
    
    const desc = document.createElement("p");
    desc.className = "description";
    desc.textContent = area.description;
    
    const skillList = document.createElement("div");
    skillList.className = "skill-list chips";
    setChips(skillList, area.skills);
    
    card.append(h3, desc, skillList);
    grid.append(card);
  });
}

function renderProjects(projects) {
  const grid = qs("#projectsGrid");
  grid.innerHTML = "";

  const groups = new Map();
  projects.forEach((p) => {
    const key = p.category || "Projects";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  });

  function elChips(items) {
    const wrap = document.createElement("div");
    wrap.className = "tags";
    (items || []).slice(0, 6).forEach((t) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      wrap.append(span);
    });
    return wrap;
  }

  groups.forEach((items, category) => {
    const heading = document.createElement("div");
    heading.style.gridColumn = "1 / -1";
    heading.style.marginTop = grid.childElementCount ? "0.5rem" : "0";
    heading.innerHTML = `<h3 style="margin:0.25rem 0 0.25rem;">${category}</h3>`;
    grid.append(heading);

    items.forEach((project) => {
      const card = document.createElement("article");
      card.className = "card project-card";
      card.tabIndex = 0;

      let thumbNode;
      if (project.thumbnail) {
        const img = document.createElement("img");
        img.className = "project-thumb";
        img.src = project.thumbnail;
        img.alt = `${project.title} thumbnail`;
        img.loading = "lazy";
        thumbNode = img;
      } else {
        const ph = document.createElement("div");
        ph.className = "project-thumb--placeholder";
        thumbNode = ph;
      }

      const body = document.createElement("div");
      body.className = "project-body";

      const topline = document.createElement("div");
      topline.className = "project-topline";
      const cat = document.createElement("div");
      cat.className = "project-category";
      cat.textContent = project.category || "Project";
      topline.append(cat);

      const title = document.createElement("h3");
      title.textContent = project.title;

      if (project.id === "thesis-agri") {
        const badge = document.createElement("span");
        badge.className = "badge-research";
        badge.textContent = "Currently Researching";
        body.append(badge);
      }

      body.append(topline, title, elChips(project.techUsed || project.tags));

      const overlay = document.createElement("div");
      overlay.className = "project-overlay";
      const desc = document.createElement("p");
      desc.textContent = project.description || "";

      const actions = document.createElement("div");
      actions.className = "project-actions";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost";
      btn.textContent = "View details";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openProjectModal(project);
      });
      actions.append(btn);

      overlay.append(desc, actions);

      card.addEventListener("click", () => openProjectModal(project));

      card.append(thumbNode, body, overlay);
      grid.append(card);
    });
  });
}

function setChips(container, items) {
  container.innerHTML = "";
  (items || []).forEach((skill, i) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    const skillLower = skill.toLowerCase();
    if (skillLower.includes("react")) {
      chip.classList.add("react");
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React"> ${skill}`;
    } else if (skillLower.includes("node")) {
      chip.classList.add("nodejs");
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js"> ${skill}`;
    } else if (skillLower.includes("mongo")) {
      chip.classList.add("mongodb");
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB"> ${skill}`;
    } else if (skillLower.includes("javascript") || skillLower.includes("typescript")) {
      chip.classList.add("javascript");
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript"> ${skill}`;
    } else if (skillLower.includes("java") && !skillLower.includes("javascript")) {
      chip.classList.add("java");
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java"> ${skill}`;
    } else if (skillLower.includes("python")) {
      chip.classList.add("python");
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python"> ${skill}`;
    } else if (skillLower === "c" || skillLower === "c programming") {
      chip.classList.add("c");
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C"> ${skill}`;
    } else if (skillLower.includes("pytorch")) {
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" alt="PyTorch"> ${skill}`;
    } else if (skillLower.includes("tensorflow")) {
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" alt="TensorFlow"> ${skill}`;
    } else if (skillLower.includes("arduino")) {
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" alt="Arduino"> ${skill}`;
    } else if (skillLower.includes("opencv")) {
      chip.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" alt="OpenCV"> ${skill}`;
    } else {
      chip.textContent = skill;
    }
    chip.style.animationDelay = `${i * 100}ms`;
    container.append(chip);
  });
}

function setList(container, items) {
  container.innerHTML = "";
  (items || []).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    container.append(li);
  });
}

function renderCraft(craft) {
  const tech = qs("#craftTechnical");
  const creative = qs("#craftCreative");
  const soft = qs("#craftSoft");
  if (tech) setChips(tech, craft?.technical);
  if (creative) setChips(creative, craft?.creative);
  if (soft) setList(soft, craft?.soft);
}

function renderLifestyle(lifestyle) {
  const grid = qs("#lifestyleGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const sportsCard = document.createElement("div");
  sportsCard.className = "card";
  sportsCard.innerHTML = `
    <h3>Sports & Achievements</h3>
    <ul class="list">${(lifestyle?.sports || []).map(item => `<li>${item}</li>`).join("")}</ul>
  `;
  grid.append(sportsCard);

  const hobbiesCard = document.createElement("div");
  hobbiesCard.className = "card";
  hobbiesCard.innerHTML = `
    <h3>Hobbies</h3>
    <ul class="list">${(lifestyle?.hobbies || []).map(item => `<li>${item}</li>`).join("")}</ul>
  `;
  grid.append(hobbiesCard);
}

function openProjectModal(project) {
  const modal = qs("#projectModal");
  if (!modal) return;

  qs("#modalTitle").textContent = project.title || "Project";
  qs("#modalMeta").textContent = [project.category, project.team].filter(Boolean).join(" • ");
  qs("#modalDescription").textContent = project.description || "";

  const techWrap = qs("#modalTech");
  techWrap.innerHTML = "";
  (project.techUsed || []).forEach((t) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = t;
    techWrap.append(chip);
  });

  const bullets = [];
  if (project.contribution) bullets.push(`Contribution: ${project.contribution}`);
  (project.features || []).forEach((f) => bullets.push(f));
  (project.details || []).forEach((d) => bullets.push(d));

  setList(qs("#modalBullets"), bullets);

  const linkWrap = qs("#modalLinkWrap");
  if (project.url) {
    linkWrap.innerHTML = `<a class="btn" href="${project.url}">Open link</a>`;
  } else {
    linkWrap.textContent = "";
  }

  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function setupModalClose() {
  const modal = qs("#projectModal");
  if (!modal) return;

  function close() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  qsa("[data-close-modal]").forEach((el) => el.addEventListener("click", close));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") close();
  });
}

function renderCertificates(certificates) {
  const grid = qs("#certificatesGrid");
  grid.innerHTML = "";

  certificates.forEach((cert) => {
    const card = document.createElement("article");
    card.className = "certificate";

    const image = document.createElement("img");
    image.src = cert.image || "assets/certificate.svg";
    image.alt = `${cert.title} certificate`;
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = cert.title;

    const meta = document.createElement("div");
    meta.className = "meta";

    const issuer = document.createElement("div");
    issuer.className = "issuer";
    issuer.textContent = cert.issuer;

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = cert.date;

    meta.append(issuer, date);

    card.append(image, title, meta);
    grid.append(card);
  });
}

function renderSkills(skills) {
  const container = qs("#skillsList");
  if (!container) return;
  container.innerHTML = "";
  (skills || []).forEach((skill) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = skill;
    container.append(chip);
  });
}

function renderContact(contact) {
  const contactDetails = qs("#contactDetails");
  if (contactDetails) {
    contactDetails.innerHTML = `
      <div class="contact-details-grid">
        <div class="contact-detail">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <a href="mailto:${contact.email}">${contact.email}</a>
        </div>
        <div class="contact-detail">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.02.75-.25 1.02l-2.2 2.2z"/></svg>
          <span>${contact.phone}</span>
        </div>
        <div class="contact-detail">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8 12v1c0 1.1.9 2 2 2h1v2.93zm6.9-2.54c-.28-.14-2.49-1.23-2.49-1.23s-.23-.11-.36-.02c-.08.06-.14.18-.14.31v1.49c0 .13-.05.26-.15.35-.23.19-1.05.65-1.78.65-.93 0-1.73-.45-2.45-1.17-1.02-.99-1.5-2.2-1.5-3.48s.48-2.49 1.5-3.48c.72-.72 1.52-1.17 2.45-1.17.73 0 1.55.46 1.78.65.1.09.15.22.15.35v1.49c0 .13.06.25.14.31.13.09.36-.02.36-.02s2.21-1.09 2.49-1.23c.28-.14.46-.45.46-.78V8.5c0-.55-.45-1-1-1h-1.5c-.34 0-.67.17-.85.45-.02.03-.04.06-.06.09-.5.83-1.62 1.46-2.09 1.46-.47 0-1.59-.63-2.09-1.46-.02-.03-.04-.06-.06-.09-.18-.28-.51-.45-.85-.45H8c-.55 0-1 .45-1 1v.07c.28.14 2.49 1.23 2.49 1.23s.23.11.36.02c.08-.06.14-.18.14-.31V9.51c0-.13.05-.26.15-.35.23-.19 1.05-.65 1.78-.65.93 0 1.73.45 2.45 1.17 1.02.99 1.5 2.2 1.5 3.48s-.48-2.49-1.5 3.48c-.72.72-1.52-1.17-2.45-1.17-.73 0-1.55-.46-1.78-.65-.1-.09-.15-.22-.15-.35v-1.49c0-.13-.06-.25-.14-.31-.13-.09-.36.02-.36.02s-2.21 1.09-2.49 1.23c-.28.14-.46.45-.46.78v1.43c0 .55.45 1 1 1h1.5c.34 0 .67-.17.85-.45.02-.03.04-.06.06-.09.5-.83 1.62-1.46 2.09-1.46.47 0 1.59.63 2.09 1.46.02.03.04.06.06.09.18.28.51.45.85.45H18c.55 0 1-.45 1-1v-1.43c0-.33-.18-.64-.46-.78z"/></svg>
          <a href="${contact.social.facebook}" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
        <div class="contact-detail">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-7 5.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3zm-5 0a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3z"/></svg>
          <a href="${contact.social.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <div class="contact-detail">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></svg>
          <a href="${contact.social.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    `;
  }

  qs("#footerName").textContent = contact.name;
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  qsa("[data-reveal]").forEach((el) => observer.observe(el));
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setupPremiumCursor() {
  const dot = qs("#cursorDot");
  const ring = qs("#cursorRing");
  if (!dot || !ring) return;

  const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (isCoarse) return;

  document.body.classList.add("premium-cursor");

  const state = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    rx: window.innerWidth / 2,
    ry: window.innerHeight / 2,
    visible: false,
    hover: false,
  };

  function onMove(e) {
    state.x = e.clientX;
    state.y = e.clientY;
    state.visible = true;

    const target = e.target;
    state.hover = !!(
      target.closest("a") ||
      target.closest("button") ||
      target.closest(".project-card") ||
      target.closest(".btn") ||
      target.closest(".trait") ||
      target.hasAttribute("data-close-modal") ||
      window.getComputedStyle(target).cursor === "pointer"
    );
  }

  function onLeave() {
    state.visible = false;
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseleave", onLeave);

  function tick() {
    const ease = 0.18;
    state.rx += (state.x - state.rx) * ease;
    state.ry += (state.y - state.ry) * ease;

    const opacity = state.visible ? 1 : 0;
    dot.style.opacity = opacity;
    ring.style.opacity = opacity;

    const scale = state.hover ? 1.65 : 1;
    const ringColor = state.hover ? "rgba(45, 226, 255, 0.85)" : "rgba(255, 255, 255, 0.55)";

    dot.style.transform = `translate3d(${state.x - 3}px, ${state.y - 3}px, 0)`;
    ring.style.transform = `translate3d(${state.rx - 17}px, ${state.ry - 17}px, 0) scale(${scale})`;
    ring.style.borderColor = ringColor;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function setupHeroSpotlight() {
  const hero = qs("#hero");
  const spotlight = qs("#heroSpotlight");
  if (!hero || !spotlight) return;

  const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (isCoarse) {
    hero.style.setProperty("--sx", "50%");
    hero.style.setProperty("--sy", "25%");
    return;
  }

  function updateFromEvent(e) {
    const rect = hero.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1) * 100;
    const y = clamp((e.clientY - rect.top) / rect.height, 0, 1) * 100;
    hero.style.setProperty("--sx", `${x.toFixed(2)}%`);
    hero.style.setProperty("--sy", `${y.toFixed(2)}%`);
  }

  hero.addEventListener("mousemove", updateFromEvent, { passive: true });
  hero.addEventListener(
    "mouseleave",
    () => {
      hero.style.setProperty("--sx", "50%");
      hero.style.setProperty("--sy", "35%");
    },
    { passive: true }
  );
}

function setupHeroConstellation() {
  const hero = qs("#hero");
  const canvas = qs("#heroCanvas");
  if (!hero || !canvas) return;
  if (prefersReducedMotion()) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const config = {
    count: isCoarse ? 42 : 78,
    maxSpeed: isCoarse ? 0.28 : 0.38,
    connectDist: isCoarse ? 110 : 140,
    repelRadius: isCoarse ? 110 : 160,
    repelStrength: isCoarse ? 0.95 : 1.25,
  };

  let w = 0;
  let h = 0;

  function resize() {
    const rect = hero.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  const mouse = {
    x: w * 0.5,
    y: h * 0.35,
    active: false,
    vx: 0,
    vy: 0,
  };

  function onMove(e) {
    const rect = hero.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;
    mouse.vx = nx - mouse.x;
    mouse.vy = ny - mouse.y;
    mouse.x = nx;
    mouse.y = ny;
    mouse.active = true;
  }

  function onLeave() {
    mouse.active = false;
  }

  if (!isCoarse) {
    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave, { passive: true });
  }

  const particles = Array.from({ length: config.count }, () => {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.cos(angle) * (0.12 + Math.random() * config.maxSpeed),
      vy: Math.sin(angle) * (0.12 + Math.random() * config.maxSpeed),
      r: 1 + Math.random() * 1.2,
      seed: Math.random() * 1000,
    };
  });

  function wrap(p) {
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
    if (p.y < -10) p.y = h + 10;
    if (p.y > h + 10) p.y = -10;
  }

  function tick(t) {
    ctx.clearRect(0, 0, w, h);
    // Deep-blue vignette (avoid pure-black patches)
    const vignette = ctx.createRadialGradient(
      w * 0.52,
      h * 0.42,
      Math.min(w, h) * 0.12,
      w * 0.52,
      h * 0.48,
      Math.max(w, h) * 0.86
    );
    vignette.addColorStop(0, "rgba(11, 18, 33, 0)");
    vignette.addColorStop(1, "rgba(11, 18, 33, 0.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Update
    for (const p of particles) {
      // Tiny hover noise
      const n = Math.sin((t * 0.0012 + p.seed) * 2.0) * 0.03;
      p.vx += n;
      p.vy -= n;

      // Repel
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const rr = config.repelRadius * config.repelRadius;
        if (d2 < rr && d2 > 0.001) {
          const d = Math.sqrt(d2);
          const force = (1 - d / config.repelRadius) * config.repelStrength;
          const ax = (dx / d) * force * 0.22;
          const ay = (dy / d) * force * 0.22;
          p.vx += ax;
          p.vy += ay;
        }
      }

      // Limit speed
      const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const max = config.maxSpeed;
      if (sp > max) {
        p.vx = (p.vx / sp) * max;
        p.vy = (p.vy / sp) * max;
      }

      p.x += p.vx;
      p.y += p.vy;
      wrap(p);
    }

    // Connections
    const connectDist = config.connectDist;
    const connectDist2 = connectDist * connectDist;

    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < connectDist2) {
          const d = Math.sqrt(d2);
          const baseAlpha = 1 - d / connectDist;

          let glow = 0;
          if (mouse.active) {
            const mdx = (a.x + b.x) * 0.5 - mouse.x;
            const mdy = (a.y + b.y) * 0.5 - mouse.y;
            const md = Math.sqrt(mdx * mdx + mdy * mdy);
            glow = clamp(1 - md / (config.repelRadius * 1.15), 0, 1);
          }

          const alpha = clamp(baseAlpha * (0.22 + glow * 0.7), 0, 0.9);
          const r = Math.floor(45 + glow * 0);
          const g = Math.floor(150 + glow * 85);
          const bl = Math.floor(255);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Stars
    for (const p of particles) {
      let glow = 0;
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        glow = clamp(1 - d / config.repelRadius, 0, 1);
      }

      const alpha = 0.55 + glow * 0.35;
      ctx.fillStyle = `rgba(${Math.floor(220 + glow * 20)}, ${Math.floor(235 + glow * 10)}, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + glow * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(tick);
}

function setupHeroTraits() {
  const container = qs("#heroTraits");
  if (!container) return;

  const traits = [
    "Innovator",
    "Problem Solver",
    "AI Enthusiast",
    "Critical Thinker",
    "Fast Learner",
  ];

  container.innerHTML = "";

  const nodes = traits.map((text) => {
    const el = document.createElement("div");
    el.className = "trait";
    const span = document.createElement("span");
    span.className = "trait__text";
    span.textContent = text;
    el.append(span);
    container.append(el);
    return el;
  });

  // Stagger in, then keep a subtle "active" emphasis that moves.
  nodes.forEach((el, i) => {
    window.setTimeout(() => el.classList.add("is-on"), 450 + i * 320);
  });

  let active = 0;
  window.setInterval(() => {
    nodes.forEach((el, i) => {
      if (i === active) {
        el.classList.add("is-on");
        el.classList.remove("is-off");
      } else {
        el.classList.add("is-off");
      }
    });
    active = (active + 1) % nodes.length;
  }, 3200);
}

// Hamburger menu toggle
const hamburger = qs('#hamburger');
const navMenu = qs('#navMenu');
const navClose = qs('#navClose');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.add('active');
    hamburger.style.display = 'none';
  });
}

if (navClose && navMenu) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('active');
    if (hamburger) hamburger.style.display = '';
  });
}

// Smooth scroll for nav links
qsa('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = qs(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
      // Close menu after navigation
      if (navMenu) navMenu.classList.remove('active');
      if (hamburger) hamburger.style.display = '';
    }
  });
});

function setupContactForm(contact) {
  const form = qs("#contactForm");
  const status = qs("#formStatus");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    status.textContent = "Thank you! This demo site doesn’t actually send email, but you can copy the message below and send it from your own inbox.";

    console.group("Contact Form Submission");
    console.log(JSON.stringify(payload, null, 2));
    console.groupEnd();

    form.reset();
  });

  status.textContent = "";
}

async function init() {
  document.body.classList.add("js");
  const year = new Date().getFullYear();
  qs("#currentYear").textContent = year;

  try {
    const response = await fetch(dataUrl);
    const data = await response.json();

    renderHero(data.meta);
    renderAbout(data.about);
    renderEducation(data.education);
    renderStats(data.stats);
    renderProjects(data.projects);
    renderCertificates(data.certificates || []);
    renderSkills(data.skills);
    renderExpertise(data.expertise);
    renderLifestyle(data.lifestyle);
    renderContact(data.contact);
    setupContactForm(data.contact);
    setupReveal();

    setupPremiumCursor();
    setupPremiumCursor();
  setupHeroSpotlight();
    setupHeroConstellation();
    setupHeroTraits();
    setupModalClose();
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
    qs("#aboutText").textContent = "Could not load the portfolio data. Check the console for details.";
  }
}

init().catch((error) => {
  console.error("Portfolio failed to initialize:", error);
  const message = document.createElement("div");
  message.style.padding = "1.5rem";
  message.style.background = "rgba(220, 60, 60, 0.12)";
  message.style.color = "#fff";
  message.style.fontWeight = "600";
  message.style.textAlign = "center";
  message.textContent = "Unable to load portfolio data. Please make sure you are running this from a local server (http://localhost:8000) and refresh the page.";
  document.body.prepend(message);
});
