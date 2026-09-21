/* global language */
"use strict";
window.SupremeCareers = (() => {
  const t = (en, ru, es) => language === "ru" ? ru : language === "es" ? es : en;
  const requested = () => new URL(location.href).searchParams.get("apply") === "1";
  const roles = ["Licensed insurance agent", "Producer", "Service and certificate support", "Other"];
  function pageTitle() {
    document.title = t("Job application | Supreme", "Заявка на работу | Supreme", "Solicitud de empleo | Supreme");
    document.querySelector("header .badge").textContent = t("Job application", "Заявка на работу", "Solicitud de empleo");
  }
  function renderIntro({ app, state, el, render, accept, selectView }) {
    const draft = state.candidateDraft ||= { name: "", email: "", phone: "", role: "", introduction: "", consent: false, file: null };
    document.body.classList.add("candidate-page");
    pageTitle();
    const form = el("form", { class: "candidate-form" });
    const field = (key, label, type, max, required = false) => {
      const input = el(type === "textarea" ? "textarea" : "input", {
        id: `candidate-${key}`, name: key, ...(type === "textarea" ? { rows: "4" } : { type }),
        maxlength: String(max), ...(required ? { required: "" } : {}),
        autocomplete: { name: "name", email: "email", phone: "tel" }[key],
        value: draft[key], disabled: state.busy, oninput: e => { draft[key] = e.target.value; },
      }, type === "textarea" ? draft[key] : null);
      return el("div", {}, el("label", { class: "field-label", for: input.id }, label), input);
    };
    const select = el("select", { id: "candidate-role", required: "", disabled: state.busy, onchange: e => { draft.role = e.target.value; } },
      el("option", { value: "" }, t("Select a role", "Выберите направление", "Elige un puesto")),
      roles.map((role, i) => el("option", { value: role }, [t("Licensed insurance agent", "Лицензированный страховой агент", "Agente de seguros con licencia"), t("Producer", "Специалист по продажам", "Productor"), t("Service and certificate support", "Сервис и сертификаты", "Servicio y certificados"), t("Other", "Другое", "Otro")][i])));
    select.value = draft.role;
    const fileStatus = el("p", { class: "help", role: "status", "aria-live": "polite" });
    const pick = el("input", { type: "file", id: "candidate-resume", accept: ".pdf,application/pdf", disabled: state.busy });
    const showFile = () => { fileStatus.textContent = draft.file ? `${draft.file.name} (${Math.ceil(draft.file.size / 1024)} KB)` : t("PDF, up to 3 MB", "PDF, до 3 МБ", "PDF, hasta 3 MB"); };
    const selectFiles = files => {
      if (state.busy) return;
      const file = files?.[0];
      if (files?.length !== 1 || !file || !/\.pdf$/i.test(file.name) || !file.size || file.size > 3 * 1024 * 1024) {
        draft.file = null; pick.value = "";
        fileStatus.textContent = t("Choose one PDF resume, up to 3 MB.", "Выберите одно резюме PDF до 3 МБ.", "Elige un solo currículum PDF de hasta 3 MB.");
        return;
      }
      draft.file = file; showFile();
    };
    pick.addEventListener("change", () => selectFiles(pick.files));
    const zone = el("div", { class: "candidate-upload" }, el("label", { class: "field-label", for: pick.id }, t("Resume *", "Резюме *", "Currículum *")),
      el("p", {}, t("Drop your PDF here or choose a file", "Перетащите PDF сюда или выберите файл", "Arrastra tu PDF aquí o elige un archivo")), pick, fileStatus);
    zone.addEventListener("dragover", e => { e.preventDefault(); if (!state.busy) zone.classList.add("dragging"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("dragging"));
    zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("dragging"); selectFiles(e.dataTransfer.files); });
    showFile();
    const consent = el("input", { type: "checkbox", id: "candidate-consent", required: "", checked: draft.consent, disabled: state.busy, onchange: e => { draft.consent = e.target.checked; } });
    const trap = el("input", { type: "text", name: "website", tabindex: "-1", autocomplete: "off" });
    form.append(field("name", t("Full name *", "Имя и фамилия *", "Nombre completo *"), "text", 100, true),
      field("email", t("Email *", "Email *", "Correo electrónico *"), "email", 254, true),
      field("phone", t("Phone (optional)", "Телефон (необязательно)", "Teléfono (opcional)"), "tel", 40),
      el("div", {}, el("label", { class: "field-label", for: select.id }, t("Role *", "Направление *", "Puesto *")), select),
      field("introduction", t("Relevant experience (optional)", "Опыт работы (необязательно)", "Experiencia relevante (opcional)"), "textarea", 2000), zone,
      el("div", { class: "candidate-honeypot", "aria-hidden": "true" }, trap),
      el("label", { class: "candidate-consent", for: consent.id }, consent, el("span", {},
        t("I agree to Supreme reviewing and storing my application, resume and assessment for recruitment, as described in the ", "Я согласен на рассмотрение и хранение моей заявки, резюме и ответов для подбора сотрудников согласно ", "Acepto que Supreme revise y guarde mi solicitud, currículum y evaluación para contratación, según la "),
        el("a", { href: "/privacy-policy", target: "_blank", rel: "noopener noreferrer" }, t("Privacy Policy", "политике конфиденциальности", "Política de privacidad")), ".")),
      el("button", { type: "submit", class: "btn primary wide", disabled: state.busy }, state.busy ? t("Uploading resume...", "Загружаем резюме...", "Subiendo currículum...") : t("Continue to required assessment", "Перейти к обязательному тесту", "Continuar a la evaluación obligatoria")));
    if (state.error) form.append(el("div", { class: "error", role: "alert" }, state.error));
    form.addEventListener("submit", async e => {
      e.preventDefault(); if (state.busy || !form.reportValidity()) return;
      if (!draft.file) { state.error = t("Attach your PDF resume first.", "Прикрепите резюме PDF.", "Adjunta primero tu currículum PDF."); render(); return; }
      const data = new FormData();
      for (const key of ["name", "email", "phone", "role", "introduction"]) data.set(key, draft[key]);
      data.set("consent", String(draft.consent)); data.set("website", trap.value); data.set("resume", draft.file);
      state.busy = true; state.error = ""; render();
      try {
        const response = await fetch("/api/team-assessment/applications", { method: "POST", credentials: "same-origin", headers: { "X-UI-Language": language }, body: data });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to start the application.");
        accept(result); state.drafts = {}; state.candidateDraft = null; selectView(); state.focusAfterRender = true;
      } catch (error) { state.error = error.message || "Upload failed. Please try again."; }
      finally { state.busy = false; render(); }
    });
    app.append(el("div", { class: "candidate-layout" }, el("section", {},
      el("p", { class: "eyebrow" }, t("Join our team", "Работа в Supreme", "Únete al equipo")),
      el("h1", {}, t("Apply to Supreme", "Заявка в Supreme", "Postúlate a Supreme")),
      el("p", { class: "lede" }, t("Trucking insurance. Real people. Practical work.", "Страхование грузоперевозок. Работа с людьми и реальными задачами.", "Seguros de transporte. Personas reales. Trabajo práctico.")),
      el("ol", { class: "candidate-steps" },
        el("li", {}, t("Contact details and PDF resume", "Контакты и резюме PDF", "Datos de contacto y currículum PDF")),
        el("li", {}, t("18 situations and 2 written answers, all required", "18 ситуаций и 2 письменных ответа, все обязательны", "18 situaciones y 2 respuestas escritas, todas obligatorias")),
        el("li", {}, t("Submit for personal review", "Отправка на личное рассмотрение", "Envío para revisión personal"))),
      el("p", { class: "help" }, t("No account or password required. Saved drafts are available in this browser for 7 days after starting. There is no time limit during the assessment.", "Аккаунт и пароль не нужны. Сохранённый черновик доступен в этом браузере 7 дней с начала. У теста нет таймера.", "Sin cuenta ni contraseña. El borrador estará disponible en este navegador durante 7 días desde el inicio. La evaluación no tiene cronómetro.")),
      el("p", { class: "help" }, t("Do not include government ID numbers, medical information or banking details. For an accessible alternative, contact ", "Не указывайте номера государственных документов, медицинские и банковские данные. Для альтернативного доступного формата свяжитесь с ", "No incluyas números de identificación, información médica ni bancaria. Para solicitar un formato accesible, contacta con "), el("a", { href: "mailto:info@supremetruckinginsurance.com" }, "info@supremetruckinginsurance.com")),
      el("p", { class: "help" }, t("The pilot assessment supports a conversation; it is not a validated hiring test. An application is not a job offer.", "Предварительный тест служит основой для беседы, а не подтверждённым методом отбора. Заявка не является предложением о работе.", "La evaluación piloto apoya una conversación; no es una prueba de selección validada. La solicitud no es una oferta de empleo.")),
      el("a", { href: "/careers", class: "candidate-back" }, t("Back to Careers", "Вернуться к Careers", "Volver a Empleos"))),
      el("section", { class: "panel candidate-panel" }, el("h2", {}, t("Your application", "Ваша заявка", "Tu solicitud")), form)));
  }
  function banner({ app, state, el, api, accept, render }) {
    const a = state.session?.application; if (!a) return;
    document.body.classList.add("candidate-page");
    pageTitle();
    const complete = state.session.status === "completed";
    const panel = el("section", { class: "candidate-status", role: "status" },
      el("strong", {}, complete ? t("Application submitted", "Заявка отправлена", "Solicitud enviada") : t("Application draft", "Черновик заявки", "Borrador de solicitud")),
      el("p", {}, `${state.session.name} · ${a.role} · ${a.resume.name}`),
      el("p", {}, complete ? t("Your resume and all answers are saved together for the owner's review. There is no automatic hiring decision.", "Резюме и все ответы сохранены вместе для владельца. Решение о найме не принимается автоматически.", "El currículum y todas las respuestas están guardados para revisión del propietario. No hay una decisión automática de contratación.") : t("All 20 answers are required. If you have no relevant example, say so in the written answer.", "Все 20 ответов обязательны. Если подходящего примера нет, напишите об этом в ответе.", "Las 20 respuestas son obligatorias. Si no tienes un ejemplo relevante, indícalo en tu respuesta.")));
    if (complete && !a.notification_sent) {
      panel.append(el("p", {}, t("Your application is saved, but the email notification is delayed.", "Заявка сохранена, но уведомление по email задерживается.", "La solicitud está guardada, pero la notificación por correo está retrasada.")));
      panel.append(el("button", { type: "button", class: "btn secondary", disabled: state.busy, onclick: async () => {
        state.busy = true; state.error = ""; render();
        try { accept(await api("/api/submit", "POST", {})); } catch (e) { state.error = e.message; }
        finally { state.busy = false; render(); }
      } }, t("Retry notification", "Повторить уведомление", "Reintentar notificación")));
    }
    app.prepend(panel);
  }
  return { requested, renderIntro, banner, submitLabel: () => t("Submit application", "Отправить заявку", "Enviar solicitud"), writtenHelp: () => t("A short, specific answer is required. No example? Write that instead.", "Нужен короткий конкретный ответ. Нет примера? Так и напишите.", "Se requiere una respuesta breve y concreta. Si no tienes un ejemplo, indícalo.") };
})();
