/* ============================================================
   SPQR Run Club — Birleşik Script Dosyası
   Tüm sayfalar bu scripti kullanır; ilgili öğe yoksa sessizce atlanır.
   ============================================================ */

// ============================================================
// 1. SİTE PANELİ / GEÇİŞ DUVARI (GATEKEEPER)
// Şifre: Zs5T3ctn
// ============================================================
const GATE_PASSWORD = "Zs5T3ctn";

// Eski kalıcı kilidi temizle
try { localStorage.removeItem("spqr_gate_unlocked"); } catch(_e) {}

function checkSiteGate() {
  const isUnlocked = sessionStorage.getItem("spqr_gate_unlocked") === "true";
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
        <img src="logo-light.png" alt="SPQR Run Club" class="gate-logo" />
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
      sessionStorage.setItem("spqr_gate_unlocked", "true");
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
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        e.target.classList.add("in-view");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  reveals.forEach(r => io.observe(r));
})();



// ============================================================
// 6. NAVİGASYON AUTH GÜNCELLEMESİ (TÜM SAYFALARDA)
// ============================================================
async function updateAuthUI() {
  const nav = document.getElementById("navLinks");
  if (!nav || !sb) return;

  try {
    const { data: { session } } = await sb.auth.getSession();
    
    // Eski auth ve legacy öğeleri temizle
    nav.querySelectorAll(".auth-item, #navGirisLi, #navPanelLi").forEach(el => el.remove());

    const kayitLink = nav.querySelector('a[href="#kayit"], a[href="index.html#kayit"]');
    const kayitLi = kayitLink ? kayitLink.closest("li") : null;
    const isProfil = window.location.pathname.endsWith("profil.html");
    const isGiris = window.location.pathname.endsWith("giris.html");

    if (session) {
      if (kayitLi) kayitLi.style.display = "none";

      const liProfil = document.createElement("li");
      liProfil.className = "auth-item";
      liProfil.innerHTML = `<a href="profil.html"${isProfil ? ' class="active"' : ''}>Profilim</a>`;

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
      liGiris.innerHTML = `<a href="giris.html"${isGiris ? ' class="active"' : ''}>Giriş</a>`;
      nav.appendChild(liGiris);
    }

    // Mobil menü bağlantı tıklanınca kapansın
    nav.querySelectorAll(".auth-item a").forEach(a => {
      a.addEventListener("click", () => nav.classList.remove("open"));
    });
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
          emailRedirectTo: window.location.origin + "/profil.html",
          data: {
            ad_soyad: adSoyad,
            telefon,
            tempo_seviyesi: seviye,
            katilim_tercihi: gunler,
            kaynak,
            notlar,
            bulten_izni: bulten,
            saglik_onay: false
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
          saglik_onay: false
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
          saglik_onay: false
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
(async function () {
  const page = document.getElementById("profilPage") || document.getElementById("profileSection");
  if (!page || !sb) return;

  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = "giris.html";
    return;
  }

  const userId = session.user.id;

  // ============================================================
  // ⚡ SAĞLIK BEYANI MANUEL KONTROLÜ:
  // Koddan manuel test etmek veya FALSE yapmak istersen:
  // MANUEL_SAGLIK_ONAY değerini 'false' yapabilirsin.
  // Otomatiğe dönmek için tekrar 'null' yapman yeterlidir.
  // ============================================================
  const MANUEL_SAGLIK_ONAY = null; // false, true veya null

  // 🛠️ Konsoldan hızlı test için fonksiyon (F12 Konsolu):
  // setSaglikOnay(false) yazarak anında false yapabilirsin!
  window.setSaglikOnay = async function(durum) {
    const val = !!durum;
    localStorage.setItem("spqr_saglik_onay", val ? "true" : "false");
    try { await sb.from("profiles").update({ saglik_onay: val }).eq("id", userId); } catch (_e) {}
    try { await sb.auth.updateUser({ data: { saglik_onay: val } }); } catch (_e) {}
    location.reload();
  };

  let profile = {
    ad_soyad: session.user.user_metadata?.ad_soyad || "",
    telefon: session.user.user_metadata?.telefon || "",
    dogum_tarihi: session.user.user_metadata?.dogum_tarihi || "",
    tempo_seviyesi: session.user.user_metadata?.tempo_seviyesi || "",
    katilim_tercihi: session.user.user_metadata?.katilim_tercihi || "",
    bulten_izni: session.user.user_metadata?.bulten_izni ?? true,
    saglik_onay: false
  };

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || "—"; };
  const setVal  = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };

  // --- Profil yükle & ekrana yaz ---
  async function loadProfile() {
    setText("pEmail", session.user.email || "—");

    let dbProfile = null;
    try {
      const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (!error && data) {
        dbProfile = data;
        profile = { ...profile, ...data };
      }
    } catch (_err) {}

    // Sağlık onayı öncelik sırası:
    // 1. MANUEL_SAGLIK_ONAY (koddan elle true/false girilmişse)
    // 2. Supabase 'profiles' tablosundaki 'saglik_onay' (Veritabanındaki gerçek değer)
    // 3. Fallback: localStorage
    if (MANUEL_SAGLIK_ONAY !== null) {
      profile.saglik_onay = MANUEL_SAGLIK_ONAY;
    } else if (dbProfile && typeof dbProfile.saglik_onay === "boolean") {
      profile.saglik_onay = dbProfile.saglik_onay;
      localStorage.setItem("spqr_saglik_onay", profile.saglik_onay ? "true" : "false");
    } else if (localStorage.getItem("spqr_saglik_onay") !== null) {
      profile.saglik_onay = localStorage.getItem("spqr_saglik_onay") === "true";
    } else {
      profile.saglik_onay = false;
    }

    setText("pAd",      profile.ad_soyad        || "—");
    setText("pTel",     profile.telefon          || "—");
    setText("pYas",     profile.dogum_tarihi     || "—");
    setText("pTempo",   profile.tempo_seviyesi   || "—");
    setText("pKatilim", profile.katilim_tercihi  || "—");
    setText("pBulten",  profile.bulten_izni ? "Evet" : "Hayır");

    const saglikBanner = document.getElementById("saglikBanner");
    if (saglikBanner) {
      saglikBanner.hidden = !!profile.saglik_onay;
    }
  }

  await loadProfile();

  // --- Sağlık beyanı onay ---
  const saglikKabulBtn = document.getElementById("saglikKabulBtn");
  if (saglikKabulBtn) {
    saglikKabulBtn.addEventListener("click", async function () {
      const cb = document.getElementById("saglikCb");
      const st = document.getElementById("saglikStatus");
      if (!cb.checked) {
        st.textContent = "Lütfen beyanı onaylayın.";
        st.className = "form-status err show";
        return;
      }
      saglikKabulBtn.disabled = true;
      saglikKabulBtn.textContent = "KAYDEDİLİYOR...";

      try {
        await sb.from("profiles").update({ saglik_onay: true }).eq("id", userId);
      } catch (_e) {}

      try {
        await sb.auth.updateUser({ data: { saglik_onay: true } });
      } catch (_e) {}

      localStorage.setItem("spqr_saglik_onay", "true");
      profile = { ...profile, saglik_onay: true };

      saglikKabulBtn.disabled = false;
      saglikKabulBtn.textContent = "ONAYLA →";

      const saglikBanner = document.getElementById("saglikBanner");
      if (saglikBanner) saglikBanner.hidden = true;

      if (typeof renderRacesFunc === "function") {
        renderRacesFunc();
      }
    });
  }

  // --- Düzenleme toggle ---
  const editBtn    = document.getElementById("editBtn");
  const editCancel = document.getElementById("editCancel");
  const profilView = document.getElementById("profilView");
  const editWrap   = document.getElementById("profilEditWrap");
  const editStatus = document.getElementById("editStatus");

  function openEdit() {
    if (profile) {
      setVal("eAd",      profile.ad_soyad);
      setVal("eTel",     profile.telefon);
      setVal("eYas",     profile.dogum_tarihi);
      setVal("eTempo",   profile.tempo_seviyesi);
      setVal("eKatilim", profile.katilim_tercihi);
      const bultenEl = document.getElementById("eBulten");
      if (bultenEl) bultenEl.checked = !!profile.bulten_izni;
    }
    profilView.hidden = true;
    editWrap.hidden   = false;
    const first = editWrap.querySelector("input, select");
    if (first) first.focus();
  }

  function closeEdit() {
    profilView.hidden = false;
    editWrap.hidden   = true;
    if (editStatus) { editStatus.className = "form-status"; editStatus.textContent = ""; }
  }

  if (editBtn)    editBtn.addEventListener("click", openEdit);
  if (editCancel) editCancel.addEventListener("click", closeEdit);

  // --- Profil güncelleme ---
  const editForm = document.getElementById("profilEditForm");
  if (editForm && editStatus) {
    editForm.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      const btn = editForm.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "KAYDEDİLİYOR...";
      editStatus.className = "form-status";

      const updates = {
        ad_soyad:        document.getElementById("eAd").value.trim(),
        telefon:         document.getElementById("eTel").value.trim() || null,
        dogum_tarihi:    document.getElementById("eYas").value || null,
        tempo_seviyesi:  document.getElementById("eTempo").value || null,
        katilim_tercihi: document.getElementById("eKatilim").value || null,
        bulten_izni:     document.getElementById("eBulten").checked
      };

      if (!updates.ad_soyad) {
        editStatus.textContent = "Ad Soyad boş bırakılamaz.";
        editStatus.className = "form-status err show";
        btn.disabled = false; btn.textContent = "KAYDET →";
        return;
      }

      try {
        await sb.from("profiles").upsert({ id: userId, ...updates });
      } catch (_e) {}

      try {
        await sb.auth.updateUser({ data: updates });
      } catch (_e) {}

      btn.disabled = false;
      btn.textContent = "KAYDET →";

      profile = { ...profile, ...updates };
      await loadProfile();
      closeEdit();
    });
  }

  // --- Yarış Takvimi ---
  const MONTHS = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];

  const defaultRaces = [
    {
      id: "spqr-night-2026",
      isim: "SPQR Gece Koşusu 2026",
      tarih: "2026-10-15",
      konum: "Kordon Boyu · Çanakkale",
      mesafeler: ["5K", "10K"],
      kontenjan: 50
    },
    {
      id: "canakkale-2026",
      isim: "Çanakkale Yarı Maratonu 2026",
      tarih: "2026-10-18",
      konum: "Kordon & Merkez · Çanakkale",
      mesafeler: ["10K", "21K"],
      kontenjan: 100
    },
    {
      id: "istanbul-2026",
      isim: "İstanbul Maratonu 2026",
      tarih: "2026-11-08",
      konum: "Kıtalararası · İstanbul",
      mesafeler: ["15K", "42K"],
      kontenjan: 30
    },
    {
      id: "troya-2027",
      isim: "18 Mart Troya Zafer Koşusu 2027",
      tarih: "2027-03-18",
      konum: "Troya Tarihi Parkur · Çanakkale",
      mesafeler: ["10K", "21K"],
      kontenjan: 80
    },
    {
      id: "gelibolu-2027",
      isim: "Gelibolu Barış Maratonu 2027",
      tarih: "2027-04-25",
      konum: "Eceabat & Yarımada · Çanakkale",
      mesafeler: ["10K", "21K", "42K"],
      kontenjan: 120
    }
  ];

  let renderRacesFunc = null;

  async function loadRaces() {
    const listEl = document.getElementById("racesList");
    if (!listEl) return;

    const today = new Date().toISOString().slice(0, 10);

    let races = defaultRaces;
    let joined = {};
    let entryCounts = {};

    try {
      const [racesRes, entriesRes] = await Promise.all([
        sb.from("races").select("*").order("tarih"),
        sb.from("race_entries").select("race_id, mesafe_secimi").eq("user_id", userId)
      ]);

      if (!racesRes.error && racesRes.data && racesRes.data.length > 0) {
        const _all = racesRes.data;
        races = [
          ..._all.filter(r => r.tarih >= today).sort((a, b) => a.tarih.localeCompare(b.tarih)),
          ..._all.filter(r => r.tarih <  today).sort((a, b) => b.tarih.localeCompare(a.tarih))
        ];
      }

      if (!entriesRes.error && entriesRes.data) {
        entriesRes.data.forEach(e => { joined[e.race_id] = { mesafe: e.mesafe_secimi }; });
      }
    } catch (_err) {}

    // Yerel depolama desteği
    const localJoined = JSON.parse(localStorage.getItem("spqr_joined_races") || "[]");
    localJoined.forEach(id => {
      if (!joined[id]) joined[id] = { mesafe: null };
    });

    const pickerOpen = new Set();

    function renderRaces() {
      listEl.innerHTML = races.map(race => {
        const past       = race.tarih < today;
        const isJoined   = !!joined[race.id];
        const myDist     = isJoined ? joined[race.id].mesafe : null;
        const hasDists   = Array.isArray(race.mesafeler) && race.mesafeler.length > 0;
        const showPicker = !past && !isJoined && pickerOpen.has(race.id);
        const katilimci  = entryCounts[race.id] || 0;
        const kontenjan  = race.kontenjan || null;
        const dolu       = kontenjan !== null && katilimci >= kontenjan && !isJoined;

        const d = new Date(race.tarih + "T00:00:00");
        const metaParts = [race.konum, hasDists ? race.mesafeler.join(" / ") : null].filter(Boolean);

        const kontenjanHtml = kontenjan !== null && !past
          ? `<div class="race-kontenjan ${dolu ? "dolu" : ""}">${dolu ? "Kontenjan doldu" : `${kontenjan - katilimci} yer kaldı`}</div>`
          : "";

        const pickerHtml = showPicker ? `
          <div class="race-dist-picker">
            <span class="race-pick-label">Mesafe:</span>
            <div class="race-dist-opts">
              ${race.mesafeler.map(m =>
                `<button class="race-dist-opt" data-action="pick" data-race-id="${race.id}" data-dist="${m}">${m}</button>`
              ).join("")}
            </div>
            <button class="race-cancel-dist" data-action="cancel" data-race-id="${race.id}">İptal</button>
          </div>` : "";

        let ctrlHtml = "";
        if (!past) {
          if (!profile?.saglik_onay) {
            ctrlHtml = `<span class="race-saglik-warn">Yarışa katılmak için sağlık beyanını onayla</span>`;
          } else if (isJoined) {
            ctrlHtml = `
              <div class="race-joined-info">✓ Katılıyorum${myDist ? ` · ${myDist}` : ""}</div>
              <button class="race-join-btn leave" data-action="leave" data-race-id="${race.id}">Vazgeç</button>`;
          } else if (dolu) {
            ctrlHtml = `<span class="race-saglik-warn">Kontenjan doldu</span>`;
          } else if (!showPicker) {
            ctrlHtml = `<button class="race-join-btn" data-action="join" data-race-id="${race.id}">Katılacağım →</button>`;
          }
        }

        return `
          <div class="race-card ${isJoined ? "joined" : ""} ${past ? "race-past" : ""}" data-race-id="${race.id}">
            <div class="race-date"><span class="d">${d.getDate()}</span><span class="m">${MONTHS[d.getMonth()]}</span></div>
            <div class="race-body">
              <div class="race-name">${race.isim}</div>
              ${metaParts.length ? `<div class="race-meta">${metaParts.join(" · ")}</div>` : ""}
              ${kontenjanHtml}
              ${pickerHtml}
            </div>
            <div class="race-ctrl">${ctrlHtml}</div>
          </div>`;
      }).join("");
    }

    renderRacesFunc = renderRaces;
    renderRaces();

    listEl.addEventListener("click", async function (ev) {
      const target = ev.target.closest("[data-action]");
      if (!target || target.disabled) return;

      const action = target.dataset.action;
      const raceId = target.dataset.raceId;
      const race   = races.find(r => r.id === raceId);
      if (!race) return;

      const hasDists = Array.isArray(race.mesafeler) && race.mesafeler.length > 0;
      target.disabled = true;

      function updateLocalJoined(add, id) {
        let stored = JSON.parse(localStorage.getItem("spqr_joined_races") || "[]");
        if (add) {
          if (!stored.includes(id)) stored.push(id);
        } else {
          stored = stored.filter(x => x !== id);
        }
        localStorage.setItem("spqr_joined_races", JSON.stringify(stored));
      }

      if (action === "join") {
        if (hasDists) {
          pickerOpen.add(raceId);
          renderRaces();
        } else {
          try {
            await sb.from("race_entries").upsert({ user_id: userId, race_id: raceId, mesafe_secimi: null }, { onConflict: "user_id,race_id" });
          } catch (_e) {}
          updateLocalJoined(true, raceId);
          if (!joined[raceId]) entryCounts[raceId] = (entryCounts[raceId] || 0) + 1;
          joined[raceId] = { mesafe: null };
          renderRaces();
        }
      } else if (action === "pick") {
        const dist = target.dataset.dist;
        try {
          await sb.from("race_entries").upsert({ user_id: userId, race_id: raceId, mesafe_secimi: dist }, { onConflict: "user_id,race_id" });
        } catch (_e) {}
        updateLocalJoined(true, raceId);
        if (!joined[raceId]) entryCounts[raceId] = (entryCounts[raceId] || 0) + 1;
        joined[raceId] = { mesafe: dist };
        pickerOpen.delete(raceId);
        renderRaces();
      } else if (action === "cancel") {
        pickerOpen.delete(raceId);
        renderRaces();
      } else if (action === "leave") {
        try {
          await sb.from("race_entries").delete().eq("user_id", userId).eq("race_id", raceId);
        } catch (_e) {}
        updateLocalJoined(false, raceId);
        entryCounts[raceId] = Math.max(0, (entryCounts[raceId] || 0) - 1);
        delete joined[raceId];
        renderRaces();
      }
    });
  }

  await loadRaces();
})();
