// ==========================
// Supabase Config
// ==========================
const SUPABASE_URL = "https://erewtavdazxcdnhpmqgp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZXd0YXZkYXp4Y2RuaHBtcWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MzQ1MzQsImV4cCI6MjA3MjUxMDUzNH0.Q9iKGRJt0dIyCW6a6-IFPlvHtpXVx1lRJc51aXneRrc";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================
// DOM Elements
// ==========================
const noteForm = document.getElementById("noteform");
const subjectInput = document.getElementById("subject");
const notesInput = document.getElementById("notes");
const generatorSection = document.getElementById("results");
const library = document.getElementById("flashcard-library");
const saveBar = document.getElementById("saveBar");
const btnSaveSet = document.getElementById("btnSaveSet");
const btnDownloadJSON = document.getElementById("btnDownloadJSON");
const loader = document.getElementById("loader");

// Function URL
const SUPABASE_FUNCTION_URL =
  `${SUPABASE_URL}/functions/v1/flashcards-ai`;

// State
let generatedFlashcards = [];

// ==========================
// Generate Flashcards
// ==========================
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const subject = subjectInput.value.trim();
  const notes = notesInput.value.trim();
  if (!subject || !notes) {
    alert("Please enter both subject and notes.");
    return;
  }

  loader.hidden = false;
  generatorSection.innerHTML = "";

  await generateFlashcards(notes);

  loader.hidden = true;
  saveBar.hidden = generatedFlashcards.length === 0;
});

async function generateFlashcards(notes) {
  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) throw new Error("Failed to generate flashcards");

    const data = await response.json();
    generatedFlashcards = data.flashcards || [];

    renderFlashcards(generatedFlashcards, generatorSection);
  } catch (err) {
    console.error("Error generating flashcards:", err);
    alert("⚠ Error generating flashcards. Try again.");
  }
}

function renderFlashcards(flashcards, container) {
  container.innerHTML = "";
  flashcards.forEach((fc) => {
    const card = document.createElement("div");
    card.className = "flashcard";
    card.innerHTML = `
      <div class="flashcard-face front">${fc.question}</div>
      <div class="flashcard-face back">${fc.answer}</div>
    `;
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
    container.appendChild(card);
  });
}

// ==========================
// Save to Supabase + Library
// ==========================
btnSaveSet.addEventListener("click", async () => {
  if (!generatedFlashcards.length) {
    alert("No flashcards to save.");
    return;
  }

  try {
    const { error } = await supabase
      .from("flashcards")
      .insert([{ set: generatedFlashcards }]);

    if (error) throw error;

    // Move DOM elements from generator to library
    const cards = generatorSection.querySelectorAll(".flashcard");
    cards.forEach((card) => library.appendChild(card));

    // Reset state/UI
    alert("✅ Flashcard set saved successfully");
    generatedFlashcards = [];
    saveBar.hidden = true;
    generatorSection.innerHTML = "";
  } catch (err) {
    console.error("Error saving flashcards:", err);
    alert("❌ Error saving flashcards");
  }
});

// ==========================
// Download JSON
// ==========================
btnDownloadJSON.addEventListener("click", () => {
  if (!generatedFlashcards.length) {
    alert("No flashcards to download.");
    return;
  }
  const blob = new Blob([JSON.stringify(generatedFlashcards, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flashcards.json";
  a.click();
  URL.revokeObjectURL(url);
});


// // Interactive Flashcard
document.querySelectorAll('.flashcard').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});





// // ==========================
// // Flashcard Generator Section
// // ==========================

// // Authorization Header
// const SUPABASE_URL = "https://erewtavdazxcdnhpmqgp.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZXd0YXZkYXp4Y2RuaHBtcWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MzQ1MzQsImV4cCI6MjA3MjUxMDUzNH0.Q9iKGRJt0dIyCW6a6-IFPlvHtpXVx1lRJc51aXneRrc"; // From project settings

// // Generator variable declaration
// const noteForm = document.getElementById("noteform");
// const subjectInput = document.getElementById("subject");
// const notesInput = document.getElementById("notes");
// const resultsGrid = document.getElementById("results");
// const saveBar = document.getElementById("saveBar");
// const loader = document.getElementById("loader");

// // Supabase Function URL
// const SUPABASE_FUNCTION_URL = "https://erewtavdazxcdnhpmqgp.supabase.co/functions/v1/flashcards-ai";

// // Store the current generated flashcards temporarily
// let generatedFlashcards = []; // stores last generated set

// // Handle Generate Button
// noteForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const subject = subjectInput.value.trim();
//   const notes = notesInput.value.trim();
//   if (!subject || !notes) {
//     alert("Please enter both subject and notes.");
//     return;
//   }

//   // Show loader
//   loader.hidden = false;
//   loader.setAttribute("aria-busy", "true");
//   resultsGrid.innerHTML = "";

//   await generateFlashcards(notes);

//   loader.hidden = true;
//   loader.setAttribute("aria-busy", "false");
// });

//   // wrapped in a generateflashcards function
//   async function generateFlashcards(notes) {
//     try {
//     // Call Supabase Function → which calls Hugging Face securely
//     const response = await fetch(SUPABASE_FUNCTION_URL, {
//       method: "POST",
//       headers: { 
//         "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
//         "Content-Type": "application/json"},
//       body: JSON.stringify({ notes }),
//     });

//     if (!response.ok) throw new Error("Failed to generate flashcards");
    
//     const data = await response.json();
//     const flashcards = data.flashcards; // should be an array of {question, answer}

//     generatedFlashcards = flashcards; // update global set

//     renderFlashcards(flashcards, "generator-section"); // display them
//   } catch (err) {
//     console.error("Error generating flashcards:", err);
//   }
// }

// function renderFlashcards(flashcards, results) {
//   const container = document.getElementById(results);
//   container.innerHTML = ""; //clear old ones

//   flashcards.forEach(fc => {
//     const card = document.createElement("div");
//     card.className = "flashcard";

//     card.innerHTML = `
//     <div class="flashcard-face front">${fc.question}</div>
//     <div class="flashcard-face back">${fc.answer}</div>
//     `;

//     container.appendChild(card);
//   });
// };


// // Save Set (move from generator => library + Supabase)
// async function saveSet() {
//   const generatorCards = document.querySelectorAll("#generator-section .flashcard");
//   const library = document.getElementById("flashcard-library");

//   let flashcardData = [];

//   generatorCards.forEach(card => {
//     const question = card.querySelector(".flashcard-face.front").innerText;
//     const answer = card.querySelector(".flashcard-face.back").innerText;

//     flashcardData.push({ question, answer });

//     // Move DOM element
//     library.appendChild(card);
//   });
// }


// // ==========================
// // Save Generated Set to Supabase + Move to Library
// // ==========================
// const btnSaveSet = document.getElementById("btnSaveSet");
// btnSaveSet.addEventListener("click", async () => {
//   if (!generatedFlashcards.length) {
//     alert("No flashcards to save.");
//     return;
//   }

//   try {
//     // 1. Insert into Supabase
//     const { data, error } = await supabase
//       .from("flashcards")
//       .insert([{ set: generatedFlashcards }]); // use the array we built earlier

//     if (error) throw error;

//     // 2. Move DOM elements from generator to library
//     const generator = document.getElementById("generator-section");
//     const library = document.getElementById("flashcard-library");

//     // Copy all cards
//     const cards = generator.querySelectorAll("#generator-section .flashcard");
//     cards.forEach(card => {
//       library.appendChild(card); // move each card into library
//     });

//     // 3. Clear state + UI
//     alert("Flashcard set saved successfully ✅");
//     generatedFlashcards = []; // reset the array
//     saveBar.hidden = true;
//     generator.innerHTML = ""; // clear generator section if you want

//   } catch (err) {
//     console.error("Error saving flashcards:", err);
//     alert("Error saving flashcards ❌");
//   }
// });


// // ==========================
// // Download JSON
// // ==========================
// const btnDownloadJSON = document.getElementById("btnDownloadJSON");
// btnDownloadJSON.addEventListener("click", () => {
//   if (!generatedFlashcards.length) {
//     alert("No flashcards to download.");
//     return;
//   }
//   const blob = new Blob([JSON.stringify(generatedFlashcards, null, 2)], {
//     type: "application/json",
//   });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "flashcards.json";
//   a.click();
//   URL.revokeObjectURL(url);
// });


// // Generator Logic
// // Elements
// // const saveBar = document.getElementById("saveBar");
// // const btnSaveSet = document.getElementById("btnSaveSet");
// // const resultsGrid = document.getElementById("results");

// // Save all generated flashcards to Supabase
// // btnSaveSet.addEventListener("click", async () => {
// //   const subject = document.getElementById("subject").value.trim() || "General";
  
//   // Collect generated flashcards from results grid
//   // const flashcards = Array.from(resultsGrid.querySelectorAll(".flashcard")).map(card => {
//   //   return {
//   //     subject,
//   //     question: card.querySelector(".card-question").innerText.trim(),
//   //     answer: card.querySelector(".card-answer").innerText.trim(),
//   //   };
//   // });

//   // if (flashcards.length === 0) {
//   //   showToast("No flashcards to save!", "warning");
//   //   return;
//   // }

//   // try {
//   //   const { data, error } = await supabase.from("flashcards").insert(flashcards);

//   //   if (error) throw error;

//     // Success!
//     // showToast(`${flashcards.length} flashcards saved!`, "success");

//     // Refresh library to show new cards instantly
//     // loadFlashcards(true);

//     // Hide save bar after saving
// //     saveBar.hidden = true;
// //   } catch (err) {
// //     console.error("Error saving flashcards:", err.message);
// //     showToast("Error saving flashcards. Try again.", "danger");
// //   }
// // });

// // Download generated flashcards as JSON
// // document.getElementById("btnDownloadJSON").addEventListener("click", () => {
// //   const resultsGrid = document.getElementById("results");
// //   const cards = resultsGrid.querySelectorAll(".flashcard");

// //   if (cards.length === 0) {
// //     alert("⚠ No flashcards to download.");
// //     return;
// //   }

//   // Collect data
//   // const flashcards = Array.from(cards).map(card => {
//   //   const question = card.querySelector(".card-question")?.innerText || "";
//   //   const answer = card.querySelector(".card-answer")?.innerText || "";
//   //   return { question, answer };
//   // });

//   // Convert to JSON
//   // const blob = new Blob([JSON.stringify(flashcards, null, 2)], {
//   //   type: "application/json",
//   // });

//   // Create download link
// //   const url = URL.createObjectURL(blob);
// //   const a = document.createElement("a");
// //   a.href = url;
// //   a.download = "flashcards.json";
// //   document.body.appendChild(a);
// //   a.click();
// //   document.body.removeChild(a);
// //   URL.revokeObjectURL(url);
// // });


// // For Flashcard Library
// /* ========= Supabase Flashcards ========= */
// const PAGE_SIZE = 5;
// let page = 0;
// let currentSearch = '';
// let currentSort = 'recent';

// function escapeHtml(str = '') {
//   return String(str)
//     .replaceAll('&', '&amp;')
//     .replaceAll('<', '&lt;')
//     .replaceAll('>', '&gt;')
//     .replaceAll('"', '&quot;')
//     .replaceAll("'", '&#039;');
// }

// async function saveFlashcard({ subject = '', question, answer }) {
//   const { data, error } = await db
//     .from('flashcards')
//     .insert([{ subject, question, answer }])
//     .select()
//     .single();
//   if (error) throw error;
//   return data;
// }

// async function fetchFlashcards({ page = 0, pageSize = PAGE_SIZE, search = '', sort = 'recent' } = {}) {
//   let query = db.from('flashcards').select('*', { count: 'exact' });

//   if (search) {
//     query = query.or(`subject.ilike.%${search}%,question.ilike.%${search}%,answer.ilike.%${search}%`);
//   }

//   if (sort === 'subject') {
//     query = query.order('subject', { ascending: true }).order('created_at', { ascending: false });
//   } else {
//     query = query.order('created_at', { ascending: false });
//   }

//   const from = page * pageSize;
//   const to = from + pageSize - 1;
//   const { data, error, count } = await query.range(from, to);
//   if (error) throw error;
//   return { rows: data || [], total: count ?? 0 };
// }

// async function deleteFlashcard(id) {
//   const { error } = await db.from('flashcards').delete().eq('id', id);
//   if (error) throw error;
// }

// async function updateFlashcard(id, fields) {
//   const { error } = await db.from('flashcards').update(fields).eq('id', id);
//   if (error) throw error;
// }

// /* ========= UI Rendering ========= */
// const grid = document.getElementById('libraryGrid');
// const searchInput = document.getElementById('search');
// const sortSelect = document.getElementById('sort');
// const toggleBtn = document.getElementById('toggleFlashcards');

// function cardTemplate(row) {
//   const subj = escapeHtml(row.subject || 'Flashcard');
//   const q = escapeHtml(row.question);
//   const a = escapeHtml(row.answer);
//   const id = row.id;

//   return `
//   <div class="col">
//     <div class="card h-100 shadow-sm">
//       <div class="card-body">
//         <h5 class="card-title mb-2">${subj}</h5>
//         <p class="card-text mb-1"><strong>Q:</strong> ${q}</p>
//         <p class="card-text text-muted"><strong>A:</strong> ${a}</p>
//       </div>
//       <div class="card-footer bg-white d-flex justify-content-end gap-2">
//         <button class="btn btn-sm btn-outline-secondary" data-edit="${id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
//         <button class="btn btn-sm btn-outline-danger" data-delete="${id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
//       </div>
//     </div>
//   </div>`;
// }

// async function renderPage({ reset = false } = {}) {
//   if (reset) {
//     page = 0;
//     grid.innerHTML = '';
//   }

//   const { rows, total } = await fetchFlashcards({
//     page,
//     pageSize: PAGE_SIZE,
//     search: currentSearch,
//     sort: currentSort
//   });

//   grid.insertAdjacentHTML('beforeend', rows.map(cardTemplate).join(''));

//   // Show More / Less button
//   const shown = (page + 1) * PAGE_SIZE;
//   if (toggleBtn) {
//     if (shown < total) {
//       toggleBtn.textContent = 'Show More';
//       toggleBtn.disabled = false;
//       toggleBtn.dataset.mode = 'more';
//     } else if (total > PAGE_SIZE) {
//       toggleBtn.textContent = 'Show Less';
//       toggleBtn.disabled = false;
//       toggleBtn.dataset.mode = 'less';
//     } else {
//       toggleBtn.disabled = true;
//       toggleBtn.textContent = 'Show More';
//     }
//   }
// }

// /* ========= Controls ========= */
// if (toggleBtn) {
//   toggleBtn.addEventListener('click', async () => {
//     const mode = toggleBtn.dataset.mode || 'more';
//     if (mode === 'more') {
//       page += 1;
//       await renderPage();
//     } else {
//       await renderPage({ reset: true });
//     }
//   });
// }

// if (searchInput) {
//   searchInput.addEventListener('input', debounce(async (e) => {
//     currentSearch = e.target.value.trim();
//     await renderPage({ reset: true });
//   }, 300));
// }

// if (sortSelect) {
//   sortSelect.addEventListener('change', async (e) => {
//     currentSort = e.target.value;
//     await renderPage({ reset: true });
//   });
// }

// /* Delegated Edit/Delete */
// grid?.addEventListener('click', async (e) => {
//   const delBtn = e.target.closest('[data-delete]');
//   const editBtn = e.target.closest('[data-edit]');

//   try {
//     if (delBtn) {
//       const id = delBtn.getAttribute('data-delete');
//       if (confirm('Delete this flashcard?')) {
//         await deleteFlashcard(id);
//         showToast('Flashcard deleted');
//         await renderPage({ reset: true });
//       }
//     }
//     if (editBtn) {
//       const id = editBtn.getAttribute('data-edit');
//       const newQuestion = prompt('Update question:');
//       if (newQuestion === null) return;
//       const newAnswer = prompt('Update answer:');
//       if (newAnswer === null) return;
//       await updateFlashcard(id, { question: newQuestion, answer: newAnswer });
//       showToast('Flashcard updated');
//       await renderPage({ reset: true });
//     }
//   } catch (err) {
//     console.error(err);
//     showToast('Something went wrong', 'error');
//   }
// });

// /* Toast */
// function showToast(message, type = 'success') {
//   const toast = document.getElementById('toast');
//   if (!toast) return;
//   toast.querySelector('.toast-msg').textContent = message;
//   toast.hidden = false;
//   toast.classList.remove('toast--error', 'toast--success');
//   toast.classList.add(type === 'error' ? 'toast--error' : 'toast--success');
//   setTimeout(() => { toast.hidden = true; }, 2000);
// }

// /* Realtime (✨ hackathon wow factor) */
// function initRealtime() {
//   try {
//     db
//       .channel('realtime:flashcards')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'flashcards' }, async () => {
//         await renderPage({ reset: true });
//       })
//       .subscribe();
//   } catch (e) {
//     console.warn('Realtime not enabled. Enable in Database → Replication → Publications.');
//   }
// }

// /* Debounce helper */
// function debounce(fn, ms = 300) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn.apply(this, args), ms);
//   };
// }

// /* Init */
// document.addEventListener('DOMContentLoaded', async () => {
//   await renderPage({ reset: true });
//   initRealtime();
// });


