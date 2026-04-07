// Custom User State Management
let currentUser = null;

try {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  window.currentUser = currentUser;
} catch (e) {
  console.error("Error reading currentUser from localStorage", e);
}

// Initial UI Update
document.addEventListener("DOMContentLoaded", () => {
  if (currentUser) {
    updateNavUser(currentUser);
  }
});

// Update nav bar user text and logout visibility
function updateNavUser(user) {
  const userNameEl = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');

  if (userNameEl) {
    userNameEl.textContent = user ? 'Welcome, ' + (user.username || user.name) : '';
  }

  if (logoutBtn) {
    logoutBtn.style.display = user ? '' : 'none';
    
    if (!logoutBtn.dataset.listener) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
        logoutBtn.dataset.listener = 'true';
    }
  }
  fetchUnreadNotifications();
}

async function fetchUnreadNotifications() {
    const notifBadge = document.getElementById('notifBadge');
    const token = localStorage.getItem('token');
    if (!notifBadge || !token) return;

    try {
        const apiRes = await fetch(`${window.location.origin}/api/notifications`, {
            headers: { 'x-auth-token': token }
        });
        const notifs = await apiRes.json();
        const unreadCount = (notifs && Array.isArray(notifs)) ? notifs.filter(n => !n.isRead).length : 0;
        
        if (unreadCount > 0) {
            notifBadge.textContent = unreadCount;
            notifBadge.style.display = 'inline-block';
        } else {
            notifBadge.style.display = 'none';
        }
    } catch (err) {
        console.error('Failed to fetch notifications:', err);
    }
}

/* ================= MAIN ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= DARK MODE ================= */
  window.toggleDark = function () {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme !== "light") {
    document.body.classList.add("dark");
  }

  /* ================= NAVIGATION & LOGOUT ================= */
  // Logout logic is now handled in updateNavUser with dataset.listener check

});
// document.addEventListener("DOMContentLoaded", () => {
//   /* ================= GLOBAL DARK MODE ================= */
//   window.toggleDark = function () {
//     document.body.classList.toggle("dark");
//     try {
//       localStorage.setItem(
//         "theme",
//         document.body.classList.contains("dark") ? "dark" : "light",
//       );
//     } catch (e) {}
//   };

//   // Apply saved theme on load
//   try {
//     const savedTheme = localStorage.getItem("theme");
//     if (savedTheme === "dark") {
//       document.body.classList.add("dark");
//     }
//   } catch (e) {}

//   /* ================= BLOG DATA & FEED ================= */
//   (function setupFeed() {
//     const feed = document.getElementById("blogFeed");
//     const searchInput = document.getElementById("searchInput");
//     if (!feed) return; // Not on home page

//     const blogs = [
//       {
//         user: "Kabir Sharma",
//         title: "Learning to Love Again After Heartbreak",
//         desc: "Healing takes time, but self-love rebuilds what pain once broke. Read more...",
//         likes: "98k",
//         comments: "2.1k",
//         date: "Feb 18 · 4 min read",
//         img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
//       },
//       {
//         user: "Emily Johnson",
//         title: "When Letting Go Becomes Self-Respect",
//         desc: "Sometimes closure is choosing yourself over chaos. Read more...",
//         likes: "76k",
//         comments: "1.9k",
//         date: "Mar 2 · 3 min read",
//         img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
//       },
//       {
//         user: "Arjun Mehta",
//         title: "The Silent Pain of Almost Relationships",
//         desc: "Not every love story gets a proper ending. Read more...",
//         likes: "110k",
//         comments: "4.2k",
//         date: "Jan 11 · 6 min read",
//         img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
//       },
//       {
//         user: "Sophia Martinez",
//         title: "Why Moving On Feels So Heavy",
//         desc: "Because your heart remembers what your mind is trying to forget. Read more...",
//         likes: "89k",
//         comments: "2.7k",
//         date: "Feb 9 · 5 min read",
//         img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
//       },
//       {
//         user: "Rohan Verma",
//         title: "From Attachment to Independence",
//         desc: "Love taught me depth, heartbreak taught me strength. Read more...",
//         likes: "95k",
//         comments: "3.1k",
//         date: "Mar 14 · 4 min read",
//         img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
//       },
//       {
//         user: "Isabella Brown",
//         title: "The Beauty of Emotional Growth",
//         desc: "Pain reshapes us into wiser versions of ourselves. Read more...",
//         likes: "72k",
//         comments: "1.3k",
//         date: "Jan 30 · 4 min read",
//         img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
//       },
//       {
//         user: "Vivaan Kapoor",
//         title: "Late Night Thoughts After Goodbye",
//         desc: "It’s quiet, but the memories are loud. Read more...",
//         likes: "120k",
//         comments: "5.4k",
//         date: "Feb 22 · 5 min read",
//         img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
//       },
//       {
//         user: "Olivia Wilson",
//         title: "Healing Isn’t a Straight Line",
//         desc: "Some days feel strong, others feel fragile — both are valid. Read more...",
//         likes: "83k",
//         comments: "2.2k",
//         date: "Mar 1 · 4 min read",
//         img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400",
//       },
//       {
//         user: "Aditya_Rao_official",
//         title: "Why Closure Comes From Within",
//         desc: "Waiting for answers only delays peace. Read more...",
//         likes: "67k",
//         comments: "1.8k",
//         date: "Feb 3 · 3 min read",
//         img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
//       },
//       {
//         user: "@Liam_Anderson",
//         title: "Lessons My Heart Didn’t Want",
//         desc: "Growth often hides inside discomfort. Read more...",
//         likes: "74k",
//         comments: "2.6k",
//         date: "Jan 25 · 5 min read",
//         img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
//       },
//       {
//         user: "@Ananya_Iyer",
//         title: "Choosing Myself Was Hard",
//         desc: "But staying in pain was harder. Read more...",
//         likes: "105k",
//         comments: "3.8k",
//         date: "Feb 27 · 4 min read",
//         img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
//       },
//       {
//         user: "@NoahThomas",
//         title: "Love That Taught Me Boundaries",
//         desc: "Not every goodbye is a failure. Read more...",
//         likes: "59k",
//         comments: "1.4k",
//         date: "Mar 6 · 4 min read",
//         img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400",
//       },
//       {
//         user: "@IshaanMalhotra",
//         title: "From Broken to Becoming",
//         desc: "Every crack let the light in. Read more...",
//         likes: "92k",
//         comments: "2.9k",
//         date: "Feb 12 · 6 min read",
//         img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
//       },
//       {
//         user: "@MiaDavis",
//         title: "When Memories Hurt the Most",
//         desc: "Because they once meant everything. Read more...",
//         likes: "87k",
//         comments: "2.5k",
//         date: "Jan 17 · 5 min read",
//         img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
//       },
//       {
//         user: "@KrishnaNair",
//         title: "Why I Stopped Chasing Love",
//         desc: "Peace feels better than proving my worth. Read more...",
//         likes: "99k",
//         comments: "3.3k",
//         date: "Mar 9 · 4 min read",
//         img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
//       },
//       {
//         user: "@AvaTaylor",
//         title: "The Strength in Walking Away",
//         desc: "Sometimes distance is the real cure. Read more...",
//         likes: "70k",
//         comments: "1.7k",
//         date: "Feb 6 · 3 min read",
//         img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
//       },
//       {
//         user: "@SiddharthJoshi",
//         title: "Understanding My Own Heart",
//         desc: "I learned what I truly deserve. Read more...",
//         likes: "84k",
//         comments: "2.1k",
//         date: "Jan 29 · 5 min read",
//         img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
//       },
//       {
//         user: "@LucasMiller",
//         title: "Goodbye Was My Turning Point",
//         desc: "It hurt, but it helped me grow. Read more...",
//         likes: "63k",
//         comments: "1.2k",
//         date: "Feb 20 · 4 min read",
//         img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
//       },
//       {
//         user: "@MeeraKulkarni",
//         title: "Healing in Small Steps",
//         desc: "Tiny progress is still progress. Read more...",
//         likes: "101k",
//         comments: "3.5k",
//         date: "Mar 3 · 4 min read",
//         img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
//       },
//       {
//         user: "@EthanWalker",
//         title: "Why Time Doesn’t Erase Everything",
//         desc: "But it does make it lighter. Read more...",
//         likes: "58k",
//         comments: "1.1k",
//         date: "Jan 14 · 4 min read",
//         img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
//       },
//       {
//         user: "@RajRajkummar",
//         title: "Why Broken Hearts Make You Stronger",
//         desc: "Sometimes love leaves quietly, and sometimes it shatters you.But every heartbreak teaches boundaries, self-worth, and emotional strength. Healing isn’t linear — it’s powerful.Read more...",
//         likes: "120k",
//         comments: "3.5k",
//         date: "Feb 14 · 5 min read",
//         img: "download.jfif",
//       },
//       {
//         user: "Steve",
//         title: "Why Developers Love Dark Mode",
//         desc: "Dark mode isn’t just aesthetic — it’s functional. frameworks aren’t needed everywhere. They speed development, add structure, Read more...",
//         likes: 69,
//         comments: 1,
//         date: "Jan 20 · 4 min read",
//         img: "earth.png",
//       },
//       {
//         user: "Aarav",
//         title: "How I Write Cleaner JavaScript",
//         desc: "Readable code beats clever code every time. Read more...",
//         likes: 102,
//         comments: 6,
//         date: "Feb 1 · 6 min read",
//         img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
//       },
//       {
//         user: "Neha",
//         title: "CSS Tricks That Changed My Life",
//         desc: "Small CSS tricks, massive UI improvements. Read more...",
//         likes: 88,
//         comments: 3,
//         date: "Mar 5 · 5 min read",
//         img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
//       },
//       {
//         user: "Rahul",
//         title: "React vs Vanilla JS in 2026",
//         desc: "Do we really need frameworks everywhere? > frameworks aren’t needed everywhere. They speed development, add structure, Read more...",
//         likes: 150,
//         comments: 12,
//         date: "Apr 12 · 7 min read",
//         img: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72",
//       },
//       {
//         user: "Riya",
//         title: "How I Stay Consistent With Coding",
//         desc: "Motivation fades, systems don’t.Read more...",
//         likes: 61,
//         comments: 2,
//         date: "May 8 · 4 min read",
//         img: "eee.jpg",
//       },
//     ];

//     // duplicate data to reach 50+
//     const fullList = [];
//     for (let i = 0; i < 10; i++) fullList.push(...blogs);

//     // Rotate list based on stored index so each refresh shows new items
//     function rotateListByStoredIndex(arr) {
//       const key = "lastBlogIndex";
//       let last = parseInt(localStorage.getItem(key) || "-1", 10);
//       if (Number.isNaN(last) || last < 0) last = -1;
//       const next = (last + 1) % arr.length;
//       localStorage.setItem(key, String(next));
//       return arr.slice(next).concat(arr.slice(0, next));
//     }

//     const currentList = rotateListByStoredIndex(fullList);

//     function renderBlogs(blogsToRender) {
//       feed.innerHTML = "";
//       if (!blogsToRender || blogsToRender.length === 0) {
//         feed.innerHTML =
//           '<p style="padding: 20px; text-align: center; color: var(--muted);">No blogs found. Try another search!</p>';
//         return;
//       }
//       blogsToRender.forEach((blog) => {
//         feed.innerHTML += `\n    <div class="card">\n      <div>\n        <span class="meta">${blog.user}</span>\n        <h2>${blog.title}</h2>\n        <p>${blog.desc}</p>\n\n        <div class="actions">\n          <button class="action-btn like-btn">❤️ <span class="like-count">${blog.likes}</span></button>\n          <button class="action-btn">💬 <span>${blog.comments}</span></button>\n          <button class="action-btn save-btn">\n            <svg class="save-icon" viewBox="0 0 407.096 407.096" xmlns="http://www.w3.org/2000/svg">\n              <path d="M402.115,84.008L323.088,4.981C319.899,1.792,315.574,0,311.063,0H17.005C7.613,0,0,7.614,0,17.005v373.086 c0,9.392,7.613,17.005,17.005,17.005h373.086c9.392,0,17.005-7.613,17.005-17.005V96.032 C407.096,91.523,405.305,87.197,402.115,84.008z M300.664,163.567H67.129V38.862h233.535V163.567z" fill="currentColor"/>\n              <path d="M214.051,148.16h43.08c3.131,0,5.668-2.538,5.668-5.669V59.584c0-3.13-2.537-5.668-5.668-5.668h-43.08 c-3.131,0-5.668,2.538-5.668,5.668v82.907C208.383,145.622,210.92,148.16,214.051,148.16z" fill="currentColor"/>\n            </svg>\n          </button>\n          <button class="action-btn">🔗</button>\n        </div>\n\n        <div class="meta">${blog.date}</div>\n      </div>\n\n      <img src="${blog.img}" alt="${blog.title}">\n    </div>\n    `;
//       });

//       // attach like handlers to newly rendered items
//       attachLikeHandlers();
//       attachSaveHandlers();
//       // attach card click handlers to open blog detail page
//       attachCardHandlers(blogsToRender);
//     }

//     function attachSaveHandlers() {
//       if (!feed) return;
//       feed.querySelectorAll(".save-btn").forEach((btn) => {
//         if (btn.dataset.listenerAttached) return; // avoid duplicates
//         btn.dataset.listenerAttached = "1";
//         btn.addEventListener("click", function (e) {
//           e.stopPropagation();
//           // toggle saved state
//           this.classList.toggle("saved");
//         });
//       });
//     }

//     // when a card is clicked, store the blog object and navigate to detail page
//     function attachCardHandlers(blogsList) {
//       if (!feed) return;
//       const cards = feed.querySelectorAll(".card");
//       cards.forEach((card, idx) => {
//         card.addEventListener("click", () => {
//           try {
//             sessionStorage.setItem(
//               "selectedBlog",
//               JSON.stringify(blogsList[idx]),
//             );
//           } catch (e) {}
//           window.location.href = "blog-detail.html";
//         });
//       });
//     }

//     // helpers for like parsing/formatting and overlay
//     function parseLikes(text) {
//       if (typeof text === "number") return text;
//       if (!text) return 0;
//       text = String(text).trim();
//       if (/k$/i.test(text))
//         return Math.round(parseFloat(text.replace(/k/i, "")) * 1000);
//       if (/m$/i.test(text))
//         return Math.round(parseFloat(text.replace(/m/i, "")) * 1000000);
//       const n = parseInt(text.replace(/[^0-9]/g, ""), 10);
//       return Number.isNaN(n) ? 0 : n;
//     }

//     function formatLikes(n) {
//       if (n >= 1000000)
//         return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "m";
//       if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
//       return String(n);
//     }

//     function attachLikeHandlers() {
//       if (!feed) return;
//       feed.querySelectorAll(".like-btn").forEach((btn) => {
//         if (btn.dataset.listenerAttached) return; // avoid duplicates
//         btn.dataset.listenerAttached = "1";
//         btn.addEventListener("click", function (e) {
//           e.stopPropagation();
//           const card = btn.closest(".card");
//           if (!card) return;
//           const img = card.querySelector("img");
//           const countSpan = btn.querySelector(".like-count");

//           // increment and update display
//           const current =
//             parseLikes(countSpan ? countSpan.textContent : "0") + 1;
//           if (countSpan) countSpan.textContent = formatLikes(current);

//           // create heart overlay and position it centered on the image
//           const heart = document.createElement("span");
//           heart.className = "like-heart";
//           heart.textContent = "❤️";
//           card.appendChild(heart);

//           try {
//             const cardRect = card.getBoundingClientRect();
//             const imgRect = img.getBoundingClientRect();
//             const left = imgRect.left - cardRect.left + imgRect.width / 2;
//             const top = imgRect.top - cardRect.top + imgRect.height / 2;
//             heart.style.left = left - 22 + "px";
//             heart.style.top = top - 22 + "px";
//           } catch (err) {
//             heart.style.left = "50%";
//             heart.style.top = "50%";
//             heart.style.transform = "translate(-50%,-50%)";
//           }

//           // show then remove after 200ms
//           requestAnimationFrame(() => heart.classList.add("show"));
//           setTimeout(() => {
//             heart.classList.remove("show");
//             heart.remove();
//           }, 220);
//         });
//       });
//     }

//     function searchBlogs() {
//       const query = ((searchInput && searchInput.value) || "")
//         .toLowerCase()
//         .trim();

//       if (!query) {
//         renderBlogs(currentList);
//         return;
//       }

//       const filtered = currentList.filter(
//         (blog) =>
//           blog.title.toLowerCase().includes(query) ||
//           blog.desc.toLowerCase().includes(query) ||
//           blog.user.toLowerCase().includes(query),
//       );

//       renderBlogs(filtered);
//     }

//     if (searchInput) {
//       searchInput.addEventListener("keypress", (e) => {
//         if (e.key === "Enter") searchBlogs();
//       });
//     }

//     // expose search function for existing onclick in HTML
//     window.searchBlogs = searchBlogs;

//     // initial render
//     renderBlogs(currentList);
//   })();

//   // --- UrbanDiary animations (GSAP + ScrollTrigger) ---
//   (function setupAnimations() {
//     function run() {
//       try {
//         if (!window.gsap) return;

//         const gsapLib = window.gsap;
//         const ScrollTrigger =
//           (gsapLib && gsapLib.ScrollTrigger) || window.ScrollTrigger;
//         if (ScrollTrigger && gsapLib.registerPlugin) {
//           try {
//             gsapLib.registerPlugin(ScrollTrigger);
//           } catch (e) {}
//         }

//         // Only run UrbanDiary-specific animations if on that page
//         if (!document.querySelector(".ud-page")) {
//           // fallback: reveal everything if not UD page
//           document
//             .querySelectorAll(".reveal")
//             .forEach((r) => r.classList.add("show"));
//           document
//             .querySelectorAll(".reveal-clip")
//             .forEach((r) => r.classList.add("show"));
//           return;
//         }

//         // Nav entrance
//         gsapLib.from("nav", {
//           y: -20,
//           opacity: 0,
//           duration: 0.6,
//           ease: "power2.out",
//         });

//         // Hero timeline (redesigned)
//         const tl = gsapLib.timeline({ defaults: { ease: "power2.out" } });
//         tl.from(".eyebrow", { y: 8, opacity: 0, duration: 0.45 })
//           .from(".hero-headline", { y: 32, opacity: 0, duration: 0.9 }, "-=0.2")
//           .from(".hero-sub", { y: 18, opacity: 0, duration: 0.7 }, "-=0.6")
//           .from(
//             ".hero-ctas .btn",
//             { y: 12, opacity: 0, stagger: 0.12, duration: 0.45 },
//             "-=0.6",
//           )
//           .from(
//             ".visual-card",
//             { scale: 0.98, opacity: 0, duration: 1 },
//             "-=0.9",
//           );

//         // animated gradient orb subtle rotation
//         gsapLib.to(".gradient-orb", {
//           rotation: 30,
//           duration: 12,
//           repeat: -1,
//           ease: "none",
//         });

//         // sticky nav background on scroll
//         if (ScrollTrigger) {
//           ScrollTrigger.create({
//             start: 20,
//             onUpdate: (self) => {
//               const nav = document.querySelector("nav");
//               if (!nav) return;
//               if (self.scrollerProxy) return;
//               if (self.direction && window.scrollY > 12) {
//                 nav.classList.add("scrolled");
//               } else {
//                 if (window.scrollY <= 12) nav.classList.remove("scrolled");
//               }
//             },
//           });
//         }

//         // Parallax hero image on scroll
//         if (ScrollTrigger) {
//           gsapLib.to(".ud-hero-visual img", {
//             yPercent: -8,
//             ease: "none",
//             scrollTrigger: {
//               trigger: ".ud-hero",
//               start: "top top",
//               end: "bottom top",
//               scrub: 0.6,
//             },
//           });

//           // reveal elements using ScrollTrigger
//           gsapLib.utils.toArray(".reveal").forEach((elem) => {
//             gsapLib.fromTo(
//               elem,
//               { opacity: 0, y: 14 },
//               {
//                 opacity: 1,
//                 y: 0,
//                 duration: 0.7,
//                 ease: "power2.out",
//                 scrollTrigger: {
//                   trigger: elem,
//                   start: "top 88%",
//                   toggleActions: "play none none none",
//                 },
//               },
//             );
//           });

//           gsapLib.utils.toArray(".reveal-clip").forEach((elem) => {
//             gsapLib.fromTo(
//               elem,
//               { clipPath: "inset(0 0 100% 0)", opacity: 0 },
//               {
//                 clipPath: "inset(0 0 0 0)",
//                 opacity: 1,
//                 duration: 0.9,
//                 ease: "power2.out",
//                 scrollTrigger: {
//                   trigger: elem,
//                   start: "top 88%",
//                   toggleActions: "play none none none",
//                 },
//               },
//             );
//           });

//           // stagger post cards in redesigned showcase
//           const cards = gsapLib.utils.toArray(".showcase-grid .post-card");
//           if (cards.length) {
//             gsapLib.from(cards, {
//               opacity: 0,
//               y: 22,
//               stagger: 0.12,
//               duration: 0.9,
//               ease: "power2.out",
//               scrollTrigger: { trigger: cards[0], start: "top 88%" },
//             });
//           }

//           // subtle hover micro-interaction for post cards
//           gsapLib.utils.toArray(".post-card").forEach((card) => {
//             card.addEventListener("mouseenter", () =>
//               gsapLib.to(card, { scale: 1.02, duration: 0.22 }),
//             );
//             card.addEventListener("mouseleave", () =>
//               gsapLib.to(card, { scale: 1, duration: 0.22 }),
//             );
//           });

//           // newsletter form submit micro-feedback
//           const newsletter = document.getElementById("newsletterForm");
//           if (newsletter) {
//             newsletter.addEventListener("submit", (e) => {
//               e.preventDefault();
//               const btn = newsletter.querySelector("button");
//               gsapLib
//                 .to(btn, { scale: 0.96, duration: 0.08 })
//                 .to(btn, { scale: 1, duration: 0.16 });
//               gsapLib
//                 .to(".newsletter-card", {
//                   boxShadow: "0 0 0 6px rgba(95,132,255,0.06)",
//                   duration: 0.18,
//                 })
//                 .to(".newsletter-card", {
//                   boxShadow: "8px 12px 30px rgba(16,40,80,0.04)",
//                   duration: 0.22,
//                 });
//               // simple success toast
//               const el = document.createElement("div");
//               el.className = "toast";
//               el.textContent = "Subscribed — check your inbox";
//               document.body.appendChild(el);
//               gsapLib.fromTo(
//                 el,
//                 { y: 8, opacity: 0 },
//                 {
//                   y: 0,
//                   opacity: 1,
//                   duration: 0.28,
//                   onComplete() {
//                     setTimeout(() => {
//                       gsapLib.to(el, {
//                         opacity: 0,
//                         duration: 0.36,
//                         onComplete: () => el.remove(),
//                       });
//                     }, 1500);
//                   },
//                 },
//               );
//             });
//           }

//           // feature cards reveal + micro-hover
//           const featureCards = gsapLib.utils.toArray(".feature-card");
//           if (featureCards.length) {
//             featureCards.forEach((card, i) => {
//               gsapLib.from(card, {
//                 y: 20,
//                 opacity: 0,
//                 duration: 0.7,
//                 ease: "power2.out",
//                 scrollTrigger: { trigger: card, start: "top 86%" },
//               });

//               card.addEventListener("mouseenter", () =>
//                 gsapLib.to(card, {
//                   y: -6,
//                   scale: 1.01,
//                   duration: 0.18,
//                   boxShadow: "10px 14px 30px rgba(16,40,80,0.06)",
//                 }),
//               );
//               card.addEventListener("mouseleave", () =>
//                 gsapLib.to(card, {
//                   y: 0,
//                   scale: 1,
//                   duration: 0.18,
//                   boxShadow: "none",
//                 }),
//               );
//             });
//           }

//           // small parallax on mousemove for hero visual on wider screens
//           const heroVisual = document.querySelector(".ud-hero-visual");
//           if (heroVisual && window.innerWidth > 720) {
//             heroVisual.style.willChange = "transform";
//             heroVisual.addEventListener("mousemove", (e) => {
//               const r = heroVisual.getBoundingClientRect();
//               const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
//               const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
//               gsapLib.to(".ud-hero-visual img", {
//                 x: dx * 8,
//                 y: dy * 6,
//                 rotation: dx * 0.8,
//                 duration: 0.5,
//                 ease: "power3.out",
//               });
//             });
//             heroVisual.addEventListener("mouseleave", () =>
//               gsapLib.to(".ud-hero-visual img", {
//                 x: 0,
//                 y: 0,
//                 rotation: 0,
//                 duration: 0.6,
//                 ease: "power3.out",
//               }),
//             );
//           }

//           // micro-interactions for nav links
//           document.querySelectorAll(".nav-links a").forEach((link) => {
//             link.addEventListener("mouseenter", () =>
//               gsapLib.to(link, { y: -3, duration: 0.12 }),
//             );
//             link.addEventListener("mouseleave", () =>
//               gsapLib.to(link, { y: 0, duration: 0.12 }),
//             );
//           });
//         } else {
//           // fallback: show reveals promptly
//           document
//             .querySelectorAll(".reveal")
//             .forEach((r) => r.classList.add("show"));
//           document
//             .querySelectorAll(".reveal-clip")
//             .forEach((r) => r.classList.add("show"));
//         }
//       } catch (err) {
//         // graceful degrade
//         document
//           .querySelectorAll(".reveal")
//           .forEach((r) => r.classList.add("show"));
//         document
//           .querySelectorAll(".reveal-clip")
//           .forEach((r) => r.classList.add("show"));
//       }
//     }

//     if (window.gsap) run();
//     else window.addEventListener("load", run);
//   })();

//   /* ================= PROFILE PAGE - BLOG POST ================= */
//   window.postBlog = function () {
//     const text = document.getElementById("blogText")?.value;
//     const imageInput = document.getElementById("blogImage");
//     const caption = document.getElementById("imageCaption")?.value;

//     if (!text && (!imageInput || imageInput.files.length === 0)) {
//       alert("Write something or upload image!");
//       return;
//     }


//     // Handle image file - for now we'll use a placeholder or data URL
//     let imgHTML = "";
//     if (imageInput && imageInput.files.length > 0) {
//       const imgURL = URL.createObjectURL(imageInput.files[0]);
//       imgHTML = `
//         <img src="${imgURL}" alt="Blog image">
//         ${caption ? `<div class="caption">${caption}</div>` : ""}
//       `;
//     }

//     // Prepare blog data for API
//     const blogData = {
//       title: caption || "Untitled Blog",
//       content: text,
//       author: currentUser.name || "Anonymous",
//     };

//     // Save to backend API
//     saveBlogToAPI(blogData)
//       .then((savedBlog) => {
//         // Display in UI
//         const blog = document.createElement("div");
//         blog.classList.add("blog-post");

//         blog.innerHTML = `
//           <p>${text}</p>
//           ${imgHTML}
//         `;

//         const blogContainer = document.getElementById("blogContainer");
//         if (blogContainer) {
//           blogContainer.prepend(blog);
//         }

//         // Clear inputs
//         if (document.getElementById("blogText"))
//           document.getElementById("blogText").value = "";
//         if (imageInput) imageInput.value = "";
//         if (document.getElementById("imageCaption"))
//           document.getElementById("imageCaption").value = "";

//         alert("Blog posted successfully!");
//       })
//       .catch((error) => {
//         alert("Error posting blog: " + error.message);
//       });
//   };

//   /* ================= PROFILE PAGE - EDIT PROFILE ================= */
//   window.editProfile = function () {
//     const newName = prompt("Enter new name:");
//     const newUsername = prompt("Enter username:");
//     const newBio = prompt("Enter bio:");
//     const newInsta = prompt("Enter Instagram link:");

//     if (newName) {
//       const profileName = document.getElementById("profileName");
//       const avatarLetter = document.getElementById("avatarLetter");
//       if (profileName) profileName.innerText = newName;
//       if (avatarLetter)
//         avatarLetter.innerText = newName.charAt(0).toUpperCase();
//     }

//     if (newUsername) {
//       const profileUsername = document.getElementById("profileUsername");
//       if (profileUsername) profileUsername.innerText = "@" + newUsername;
//     }

//     if (newBio) {
//       const profileBio = document.getElementById("profileBio");
//       if (profileBio) profileBio.innerText = newBio;
//     }

//     if (newInsta) {
//       const instaLink = document.getElementById("instaLink");
//       if (instaLink) instaLink.href = newInsta;
//     }
//   };

//   /* ================= LIBRARY PAGE - TABS ================= */
//   window.openTab = function (evt, id) {
//     if (!evt || !evt.currentTarget) return;

//     const tabs = document.querySelectorAll(".tab");
//     tabs.forEach((t) => t.classList.remove("active"));
//     evt.currentTarget.classList.add("active");

//     document
//       .querySelectorAll(".tab-content")
//       .forEach((c) => c.classList.remove("active"));
//     const panel = document.getElementById(id);
//     if (panel) panel.classList.add("active");
//   };

//   /* ================= LIBRARY PAGE - THEME TOGGLE ================= */
//   (function setupLibraryTheme() {
//     const themeToggle = document.getElementById("themeToggle");
//     if (!themeToggle) return;

//     function applyTheme(theme) {
//       if (theme === "dark") {
//         document.body.classList.add("dark");
//         themeToggle.textContent = "☀️";
//       } else {
//         document.body.classList.remove("dark");
//         themeToggle.textContent = "🌙";
//       }
//       themeToggle.setAttribute(
//         "aria-pressed",
//         document.body.classList.contains("dark"),
//       );
//     }

//     themeToggle.addEventListener("click", function () {
//       const isDark = !document.body.classList.contains("dark");
//       applyTheme(isDark ? "dark" : "light");
//       try {
//         localStorage.setItem("theme", isDark ? "dark" : "light");
//       } catch (e) {}
//     });

//     // Initialize from localStorage or system preference
//     const saved = (() => {
//       try {
//         return localStorage.getItem("theme");
//       } catch (e) {
//         return null;
//       }
//     })();

//     const prefersDark =
//       window.matchMedia &&
//       window.matchMedia("(prefers-color-scheme: dark)").matches;
//     applyTheme(saved || (prefersDark ? "dark" : "light"));
//   })();

//   /* ================= HAMBURGER MENU ================= */
//   (function setupHamburger() {
//     const menuToggle = document.getElementById("menu-toggle");
//     const navLinks = document.querySelector(".nav-links");

//     if (menuToggle && navLinks) {
//       // Close menu when link is clicked
//       const links = navLinks.querySelectorAll("a");
//       links.forEach((link) => {
//         link.addEventListener("click", () => {
//           menuToggle.checked = false;
//         });
//       });
//     }
//   })();

//   /* ================= SMOOTH SCROLLING ================= */
//   document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//     anchor.addEventListener("click", function (e) {
//       const href = this.getAttribute("href");
//       if (href === "#" || href === "#0") return;

//       e.preventDefault();
//       const target = document.querySelector(href);
//       if (target) {
//         target.scrollIntoView({ behavior: "smooth" });
//       }
//     });
//   });
// });