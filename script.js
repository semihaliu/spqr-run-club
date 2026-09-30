/* ============================================================
   SPQR Run Club — Birleşik Script Dosyası
   Tüm sayfalar bu scripti kullanır; ilgili öğe yoksa sessizce atlanır.
   ============================================================ */

// ============================================================
// 1. SİTE PANELİ / GEÇİŞ DUVARI (GATEKEEPER)
// Şifre: Zs5T3ctn
// ============================================================
const GATE_PASSWORD = "Zs5T3ctn";

function checkSiteGate() {
  const isUnlocked = localStorage.getItem("spqr_gate_unlocked") === "true";
  let gateEl = document.getElementById("spqrGate");

  if (isUnlocked) {
    if (gateEl) gateEl.remove();
    document.body.classList.remove("gate-locked");
    return;
  }

  document.body.classList.add("gate-locked");

  if (!gateEl) {
    gateEl = document.createElement("div");
    gateEl.id = "spqrGate";
    gateEl.innerHTML = `
      <div class="gate-box">
        <img src="logo.png" alt="SPQR Run Club" class="gate-logo" />
        <span class="gate-badge">GİZLİ ERİŞİM</span>
        <h1 class="gate-title">SİTE PANELİ</h1>
        <p class="gate-desc">SPQR Run Club web sitesi şu an yapım aşamasındadır. Önizleme için lütfen erişim şifresini giriniz.</p>
        
        <form class="gate-form" id="gateForm">
          <div class="gate-input-wrap">
            <label for="gatePass">Erişim Şifresi</label>
            <input type="password" id="gatePass" class="gate-input" placeholder="••••••••" autofocus autocomplete="current-password" required />
          </div>
          <button type="submit" class="gate-btn">GİRİŞ YAP →</button>
          <div class="gate-status" id="gateStatus"></div>
        </form>
      </div>
    `;
    document.body.appendChild(gateEl);
  }

  const form = document.getElementById("gateForm");
  const input = document.getElementById("gatePass");
  const status = document.getElementById("gateStatus");

  form.onsubmit = function (e) {
    e.preventDefault();
    const val = input.value.trim();
    if (val === GATE_PASSWORD) {
      localStorage.setItem("spqr_gate_unlocked", "true");
      gateEl.style.transition = "opacity 0.3s ease";
      gateEl.style.opacity = "0";
      setTimeout(() => {
        gateEl.remove();
        document.body.classList.remove("gate-locked");
      }, 300);
    } else {
      status.textContent = "⚠️ Hatalı şifre. Lütfen tekrar deneyin.";
      input.value = "";
      input.focus();
    }
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkSiteGate);
} else {
  checkSiteGate();
}


// ============================================================
// 2. SUPABASE BAĞLANTISI (TÜM SAYFALARDA ORTAK)
// ============================================================
const SUPABASE_URL = "https://akqpdjdgsgwdhrdpgacl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcXBkamRnc2d3ZGhyZHBnYWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MDQzODcsImV4cCI6MjEwNjI4MDM4N30.xmAyFGoA3297AjHtTDpfcbdBsKpXdtN0BtxHlDGUriU";

const sb = (typeof window.supabase !== "undefined" && window.supabase.createClient)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : (typeof window.Supabase !== "undefined" && window.Supabase.createClient)
  ? window.Supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;


// ============================================================
// 3. YIL BİLGİSİ (FOOTER) & MOBİL MENÜ
// ============================================================
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }
})();


// ============================================================
// 4. BİR SONRAKİ KOŞU WIDGET'I (SPQR PROGRAMI)
// Pazartesi 20:00 (Stadyum), Perşembe 20:00 (Stadyum), Cumartesi 08:00 (Açık Alan)
// ============================================================
(function () {
  const dayEl = document.getElementById("nextDay");
  const timeEl = document.getElementById("nextTime");
  const placeEl = document.getElementById("nextPlace");
  if (!dayEl || !timeEl) return;

  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const min = now.getMinutes();

  const slots = [
    { day: 1, hour: 20, label: "PAZARTESİ", time: "20:00", place: "18 Mart Stadyumu · Çanakkale" },
    { day: 4, hour: 20, label: "PERŞEMBE",  time: "20:00", place: "18 Mart Stadyumu · Çanakkale" },
    { day: 6, hour: 8,  label: "CUMARTESİ", time: "08:00", place: "Açık Alan Koşusu · Çanakkale" },
  ];

  function minutesFromNow(slot) {
    let diff = (slot.day - day + 7) % 7;
    if (diff === 0) {
      if (slot.hour * 60 <= hour * 60 + min) diff = 7;
    }
    return diff * 24 * 60;
  }

  const next = slots.reduce((a, b) => minutesFromNow(a) < minutesFromNow(b) ? a : b);
  dayEl.textContent = next.label;
  timeEl.textContent = next.time;
  if (placeEl) placeEl.textContent = next.place;
})();


// ============================================================
// 5. SCROLL İLE BELİREN ÖĞELER (REVEAL)
// ============================================================
(function () {
  document.documentElement.classList.add("js-ready");
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(r => io.observe(r));
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.visible)").forEach(el => el.classList.add("visible"));
  }, 1200);
})();


// ============================================================
// 6. NAVİGASYON AUTH GÜNCELLEMESİ (TÜM SAYFALARDA)
// ============================================================
async function updateAuthUI() {
  const nav = document.getElementById("navLinks");
  if (!nav || !sb) return;

  try {
    const { data: { session } } = await sb.auth.getSession();
    nav.querySelectorAll(".auth-item").forEach(el => el.remove());

    const kayitLink = nav.querySelector('a[href="#kayit"], a[href="index.html#kayit"]');
    const kayitLi = kayitLink ? kayitLink.closest("li") : null;

    if (session) {
      if (kayitLi) kayitLi.style.display = "none";

      const liProfil = document.createElement("li");
      liProfil.className = "auth-item";
      liProfil.innerHTML = '<a href="profil.html">Profilim</a>';

      const liCikis = document.createElement("li");
      liCikis.className = "auth-item";
      const aCikis = document.createElement("a");
      aCikis.href = "#";
      aCikis.textContent = "Çıkış";
      aCikis.addEventListener("click", async (e) => {
        e.preventDefault();
        await sb.auth.signOut();
        window.location.href = "index.html";
      });
      liCikis.appendChild(aCikis);

      nav.appendChild(liProfil);
      nav.appendChild(liCikis);
    } else {
      if (kayitLi) kayitLi.style.display = "";

      const liGiris = document.createElement("li");
      liGiris.className = "auth-item";
      liGiris.innerHTML = '<a href="giris.html">Giriş</a>';
      nav.appendChild(liGiris);
    }
  } catch (err) {
    console.warn("Auth UI güncellenemedi:", err);
  }
}
updateAuthUI();


// ============================================================
// 7. SUPABASE AUTH STATE DEĞİŞİKLİĞİ (REAKTİF İZLEYİCİ)
// ============================================================
if (sb) {
  sb.auth.onAuthStateChange(async function (event, session) {
    if (event === "SIGNED_IN" && session) {
      // Bekleyen profil varsa otomatik profiles tablosuna ekle
      const raw = localStorage.getItem("spqr_pending_profile");
      if (raw) {
        try {
          const profileData = JSON.parse(raw);
          if (!profileData._email || profileData._email === session.user.email) {
            const { _email, ...fields } = profileData;
            const { data: existing } = await sb.from("profiles").select("id").eq("id", session.user.id).single();
            if (!existing) {
              await sb.from("profiles").insert({ id: session.user.id, ...fields });
            }
            localStorage.removeItem("spqr_pending_profile");
          }
        } catch (_e) { /* sessiz geç */ }
      }
      updateAuthUI();
    } else if (event === "PASSWORD_RECOVERY") {
      if (typeof window._spqrPasswordRecovery === "function") {
        window._spqrPasswordRecovery();
      } else if (!window.location.pathname.includes("sifre-sifirla")) {
        window.location.href = "sifre-sifirla.html";
      }
    } else if (event === "SIGNED_OUT") {
      updateAuthUI();
    }
  });
}


// ============================================================
// 8. ÇOKLU GÜN SEÇİMİ (Pzt / Per / Cmt / Hepsi)
// ============================================================
window.handleGunChange = function (el) {
  const all = Array.from(document.querySelectorAll('input[name="gun"]'));
  const hepsi = document.querySelector('input[name="gun"][value="Hepsi"]');
  const others = all.filter(c => c.value !== "Hepsi");

  if (el.value === "Hepsi") {
    if (el.checked) {
      others.forEach(c => { c.checked = false; });
    }
  } else {
    if (hepsi) hepsi.checked = false;
    const checkedCount = others.filter(c => c.checked).length;
    if (checkedCount === others.length && hepsi) {
      hepsi.checked = true;
      others.forEach(c => { c.checked = false; });
    }
  }
};


// ============================================================
// 9. KAYIT MODALI (3 ADIMLI WIZARD)
// ============================================================
(function () {
  const modal = document.getElementById("modalOverlay");
  if (!modal) return;

  window.goStep = function (n) {
    [0, 1, 2].forEach(i => {
      const stepEl = document.getElementById("step" + i);
      if (stepEl) stepEl.style.display = i === n ? "" : "none";
    });
    const fill = document.getElementById("progressFill");
    const count = document.getElementById("stepCount");
    if (fill) fill.style.width = ["33%", "66%", "100%"][n];
    if (count) count.textContent = "ADIM " + (n + 1) + "/3";
  };

  window.modalAc = function () {
    modal.classList.add("open");
    goStep(0);
  };

  const closeBtn = document.getElementById("modalKapat");
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove("open");
  }

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("open");
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
    }
  });

  // Kayıt Gönderme
  window.submitKayit = async function () {
    const status = document.getElementById("kayitStatus");
    if (!sb) {
      status.textContent = "⚠️ Veritabanı bağlantısı henüz hazır değil. Lütfen sayfayı yenileyiniz.";
      return;
    }

    const kvkk = document.getElementById("kvkkCheck");
    if (kvkk && !kvkk.checked) {
      status.textContent = "⚠️ Devam etmek için KVKK Aydınlatma Metni'ni onaylamalısın.";
      return;
    }

    const saglik = document.getElementById("saglikCheck");
    if (saglik && !saglik.checked) {
      status.textContent = "⚠️ Devam etmek için Sağlık Beyanı'nı onaylamalısın.";
      return;
    }

    const email = (document.getElementById("rMail")?.value || "").trim();
    const password = document.getElementById("rSifre")?.value || "";
    const adSoyad = (document.getElementById("rAd")?.value || "").trim();
    const telefon = (document.getElementById("rTel")?.value || "").trim();
    const seviye = document.getElementById("rSeviye")?.value || "";
    const gunler = Array.from(document.querySelectorAll('input[name="gun"]:checked')).map(c => c.value).join(", ");
    const kaynak = document.getElementById("rKaynak")?.value || "";
    const notlar = document.getElementById("rNot")?.value || "";
    const bulten = document.getElementById("newsletterCheck")?.checked ?? true;

    if (!adSoyad || !email || !password) {
      status.textContent = "⚠️ Ad Soyad, E-posta ve Şifre alanları zorunludur.";
      return;
    }
    if (password.length < 6) {
      status.textContent = "⚠️ Şifre en az 6 karakter olmalıdır.";
      return;
    }

    status.textContent = "⏳ Kaydın işleniyor...";

    try {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: {
            ad_soyad: adSoyad,
            telefon,
            tempo_seviyesi: seviye,
            katilim_tercihi: gunler,
            kaynak,
            notlar,
            bulten_izni: bulten,
            saglik_onay: true
          }
        }
      });

      if (error) {
        if (/already|registered|exists/i.test(error.message)) {
          status.innerHTML = '⚠️ Bu e-posta zaten kayıtlı. <a href="giris.html" style="color:inherit;font-weight:700;text-decoration:underline;">Giriş Yap</a>';
        } else {
          status.textContent = "⚠️ Kayıt hatası: " + error.message;
        }
        return;
      }

      // E-posta onayı gerekiyorsa
      if (!data.session) {
        localStorage.setItem("spqr_pending_profile", JSON.stringify({
          _email: email,
          ad_soyad: adSoyad,
          telefon,
          tempo_seviyesi: seviye,
          katilim_tercihi: gunler,
          kaynak,
          notlar,
          bulten_izni: bulten,
          saglik_onay: true
        }));
        status.innerHTML = "✅ <strong>Hesabın oluşturuldu!</strong> E-postana gönderilen doğrulama bağlantısına tıklayarak girişini tamamlayabilirsin.";
        return;
      }

      // Direkt oturum açıldıysa profiles tablosuna ekle
      try {
        await sb.from("profiles").insert({
          id: data.user.id,
          ad_soyad: adSoyad,
          telefon,
          tempo_seviyesi: seviye,
          katilim_tercihi: gunler,
          kaynak,
          notlar,
          bulten_izni: bulten,
          saglik_onay: true
        });
      } catch (_err) {}

      status.innerHTML = "🎉 <strong>Aramıza hoş geldin!</strong> Kaydın tamamlandı, panele yönlendiriliyorsun...";
      updateAuthUI();
      setTimeout(() => {
        modal.classList.remove("open");
        window.location.href = "profil.html";
      }, 1500);

    } catch (e) {
      status.textContent = "⚠️ Beklenmeyen bir hata oluştu: " + e.message;
    }
  };
})();


// ============================================================
// 10. GİRİŞ SAYFASI (giris.html)
// ============================================================
(function () {
  const form = document.getElementById("loginForm");
  if (!form || !sb) return;

  const status = document.getElementById("loginStatus");
  const btn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("lMail").value.trim();
    const password = document.getElementById("lSifre").value;

    if (!email || !password) {
      status.textContent = "⚠️ Lütfen e-posta ve şifrenizi girin.";
      status.className = "form-status err show";
      return;
    }

    btn.disabled = true;
    btn.textContent = "GİRİŞ YAPILIYOR...";
    status.textContent = "";

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      btn.disabled = false;
      btn.textContent = "GİRİŞ YAP →";
      status.textContent = "⚠️ " + (error.message.includes("Invalid login") ? "E-posta veya şifre hatalı." : error.message);
      status.className = "form-status err show";
      return;
    }

    status.textContent = "✓ Giriş başarılı! Yönlendiriliyorsunuz...";
    status.className = "form-status ok show";
    setTimeout(() => {
      window.location.href = "profil.html";
    }, 800);
  });
})();


// ============================================================
// 11. ŞİFREMİ UNUTTUM SAYFASI (sifremi-unuttum.html)
// ============================================================
(function () {
  const form = document.getElementById("forgotForm");
  if (!form || !sb) return;

  const status = document.getElementById("forgotStatus");
  const btn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const email = document.getElementById("forgotMail").value.trim();
    if (!email) return;

    btn.disabled = true;
    btn.textContent = "GÖNDERİLİYOR...";
    status.className = "form-status";
    status.textContent = "";

    const redirectTo = new URL("sifre-sifirla.html", window.location.href).href;
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });

    btn.disabled = false;
    btn.textContent = "BAĞLANTI GÖNDER →";

    if (error) {
      status.textContent = "⚠️ Hata: " + error.message;
      status.className = "form-status err show";
    } else {
      status.textContent = "✓ Şifre sıfırlama bağlantısı e-posta adresine gönderildi. Lütfen gelen kutunu ve spam klasörünü kontrol et.";
      status.className = "form-status ok show";
      form.reset();
    }
  });
})();


// ============================================================
// 12. ŞİFRE SIFIRLAMA SAYFASI (sifre-sifirla.html)
// ============================================================
(function () {
  const page = document.getElementById("sifreSifirlaPage");
  if (!page || !sb) return;

  const waiting = document.getElementById("resetWaiting");
  const formWrap = document.getElementById("resetFormWrap");
  const form = document.getElementById("passwordResetForm");
  const status = document.getElementById("resetStatus");

  window._spqrPasswordRecovery = function () {
    if (waiting) waiting.hidden = true;
    if (formWrap) formWrap.hidden = false;
    const firstInput = formWrap?.querySelector("input");
    if (firstInput) firstInput.focus();
  };

  sb.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      window._spqrPasswordRecovery();
    }
  });

  setTimeout(() => {
    if (formWrap && formWrap.hidden && waiting) {
      waiting.innerHTML = 'Bağlantı süresi dolmuş veya geçersiz olabilir.<br><br><a href="sifremi-unuttum.html" style="font-weight:700;text-decoration:underline;color:inherit;">Yeniden bağlantı iste →</a>';
    }
  }, 4000);

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const p1 = document.getElementById("newPass").value;
      const p2 = document.getElementById("newPassConfirm").value;

      if (!p1 || p1.length < 6) {
        status.textContent = "⚠️ Şifre en az 6 karakter olmalıdır.";
        status.className = "form-status err show";
        return;
      }
      if (p1 !== p2) {
        status.textContent = "⚠️ Şifreler birbiriyle uyuşmuyor.";
        status.className = "form-status err show";
        return;
      }

      const submitBtn = form.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      submitBtn.textContent = "GÜNCELLENİYOR...";

      const { error } = await sb.auth.updateUser({ password: p1 });
      if (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = "ŞİFREYİ GÜNCELLE →";
        status.textContent = "⚠️ " + error.message;
        status.className = "form-status err show";
      } else {
        status.textContent = "✓ Şifren başarıyla güncellendi! Profiline yönlendiriliyorsun...";
        status.className = "form-status ok show";
        setTimeout(() => { window.location.href = "profil.html"; }, 1500);
      }
    });
  }
})();


// ============================================================
// 13. PROFİL SAYFASI (profil.html)
// ============================================================
(function () {
  const profileContainer = document.getElementById("profileSection");
  if (!profileContainer || !sb) return;

  async function initProfile() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      window.location.href = "giris.html";
      return;
    }

    const user = session.user;
    const meta = user.user_metadata || {};

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || "—";
    };

    // Temel bilgiler
    setText("pEmail", user.email);
    setText("pAd", meta.ad_soyad);
    setText("pTel", meta.telefon);
    setText("pTempo", meta.tempo_seviyesi);
    setText("pKatilim", meta.katilim_tercihi);

    // Supabase profiles tablosundan kontrol
    try {
      const { data } = await sb.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        if (data.ad_soyad) setText("pAd", data.ad_soyad);
        if (data.telefon) setText("pTel", data.telefon);
        if (data.tempo_seviyesi) setText("pTempo", data.tempo_seviyesi);
        if (data.katilim_tercihi) setText("pKatilim", data.katilim_tercihi);
      }
    } catch (_e) {}

    // Düzenleme modu
    const editBtn = document.getElementById("editBtn");
    const editWrap = document.getElementById("profilEditWrap");
    const viewWrap = document.getElementById("profilView");
    const cancelBtn = document.getElementById("editCancel");
    const editForm = document.getElementById("profilEditForm");

    if (editBtn && editWrap && viewWrap) {
      editBtn.onclick = () => {
        viewWrap.hidden = true;
        editWrap.hidden = false;
        document.getElementById("eAd").value = document.getElementById("pAd").textContent.replace("—", "");
        document.getElementById("eTel").value = document.getElementById("pTel").textContent.replace("—", "");
        document.getElementById("eTempo").value = document.getElementById("pTempo").textContent.replace("—", "");
        document.getElementById("eKatilim").value = document.getElementById("pKatilim").textContent.replace("—", "");
      };

      if (cancelBtn) {
        cancelBtn.onclick = () => {
          editWrap.hidden = true;
          viewWrap.hidden = false;
        };
      }

      if (editForm) {
        editForm.onsubmit = async (e) => {
          e.preventDefault();
          const ad = document.getElementById("eAd").value.trim();
          const tel = document.getElementById("eTel").value.trim();
          const tempo = document.getElementById("eTempo").value;
          const katilim = document.getElementById("eKatilim").value;
          const status = document.getElementById("editStatus");

          status.textContent = "Kaydediliyor...";
          status.className = "form-status";

          await sb.auth.updateUser({
            data: { ad_soyad: ad, telefon: tel, tempo_seviyesi: tempo, katilim_tercihi: katilim }
          });

          try {
            await sb.from("profiles").upsert({
              id: user.id,
              ad_soyad: ad,
              telefon: tel,
              tempo_seviyesi: tempo,
              katilim_tercihi: katilim
            });
          } catch (_e) {}

          setText("pAd", ad);
          setText("pTel", tel);
          setText("pTempo", tempo);
          setText("pKatilim", katilim);

          status.textContent = "✓ Bilgilerin güncellendi!";
          status.className = "form-status ok show";
          setTimeout(() => {
            editWrap.hidden = true;
            viewWrap.hidden = false;
            status.textContent = "";
            status.className = "form-status";
          }, 1000);
        };
      }
    }
  }

  initProfile();
})();
