export function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + page)?.classList.add("active");
  document.querySelectorAll("[data-view]").forEach(a =>
    a.classList.toggle("active", a.dataset.view === page)
  );
}