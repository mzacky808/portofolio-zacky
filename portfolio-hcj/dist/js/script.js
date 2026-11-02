(function () {
  "use strict";

  var kurangiGerak = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ------------------------------------------------------
     1. Efek mengetik nama (satu kali, tidak berulang)
  ------------------------------------------------------ */
  var elTyped = document.getElementById("typed");

  if (elTyped && !kurangiGerak) {
    var teks = elTyped.textContent.trim();
    var posisi = 0;

    elTyped.textContent = "";

    (function ketik() {
      if (document.hidden) {
        setTimeout(ketik, 500);
        return;
      }

      posisi++;
      elTyped.textContent = teks.slice(0, posisi);

      if (posisi < teks.length) {
        setTimeout(ketik, 90);
      }
    })();
  }

  /* ------------------------------------------------------
     2. Animasi muncul saat scroll (sekali per elemen)
  ------------------------------------------------------ */
  var daftarReveal = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !kurangiGerak) {
    var pengamat = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            pengamat.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    daftarReveal.forEach(function (el) {
      pengamat.observe(el);
    });
  } else {
    daftarReveal.forEach(function (el) {
      el.classList.add("show");
    });
  }

  /* ------------------------------------------------------
     3. Tombol scroll ke atas
  ------------------------------------------------------ */
  var tombolAtas = document.querySelector(".scroll-up");
  var menunggu = false;

  function cekScroll() {
    if (tombolAtas) {
      tombolAtas.classList.toggle("tampil", window.scrollY > 400);
    }
    menunggu = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!menunggu) {
        menunggu = true;
        requestAnimationFrame(cekScroll);
      }
    },
    { passive: true },
  );

  cekScroll();

  /* ------------------------------------------------------
     4. Foto yang belum ada otomatis disembunyikan
  ------------------------------------------------------ */
  document.addEventListener(
    "error",
    function (e) {
      var img = e.target;

      if (img.tagName === "IMG" && img.closest(".galeri")) {
        var galeri = img.parentElement;
        img.remove();

        if (!galeri.querySelector("img")) {
          galeri.remove();
        }
      }
    },
    true,
  );

  /* ------------------------------------------------------
     5. Lightbox foto
  ------------------------------------------------------ */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxTutup = document.getElementById("lightbox-tutup");
  var terakhirFokus = null;

  function bukaLightbox(img) {
    terakhirFokus = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add("aktif");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxTutup.focus();
  }

  function tutupLightbox() {
    lightbox.classList.remove("aktif");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";

    if (terakhirFokus) {
      terakhirFokus.focus();
    }
  }

  document.addEventListener("click", function (e) {
    if (e.target.matches(".galeri img")) {
      bukaLightbox(e.target);
    } else if (e.target === lightbox || e.target === lightboxTutup) {
      tutupLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("aktif")) {
      tutupLightbox();
    }
  });
})();
