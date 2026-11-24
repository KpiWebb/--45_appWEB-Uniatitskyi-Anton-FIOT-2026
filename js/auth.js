/* ---------- ЗАВДАННЯ 10 ----------
У власному вебзастосунку створити вікно авторизації з перевіркою
на валідність введених даних.

Підключення до сторінки:
  <link rel="stylesheet" href="auth.css">
  <button data-open-login>Увійти</button>
  <script src="auth.js"></script>
Вікно будується скриптом само, окремої розмітки в HTML не потрібно.
*/

(function () {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateEmail(value) {
    const email = value.trim();
    if (email === "") return "Введіть email";
    if (!EMAIL_RE.test(email)) return "Некоректний email. Приклад: name@example.com";
    return "";
  }

  function validatePassword(value) {
    if (value === "") return "Введіть пароль";
    if (/\s/.test(value)) return "Пароль не може містити пробіли";
    if (value.length < 8) return "Пароль має містити щонайменше 8 символів";
    if (!/[A-Za-zА-Яа-яІіЇїЄєҐґ]/.test(value)) return "Додайте хоча б одну літеру";
    if (!/\d/.test(value)) return "Додайте хоча б одну цифру";
    return "";
  }

  const TEMPLATE = `
    <dialog class="auth-dialog" aria-labelledby="auth-title">
      <form class="auth-form" novalidate>
        <div class="auth-head">
          <h2 id="auth-title">Вхід до акаунта</h2>
          <button type="button" class="auth-close" aria-label="Закрити">×</button>
        </div>

        <div class="auth-field">
          <label for="auth-email">Email</label>
          <input id="auth-email" name="email" type="email" autocomplete="username"
                 placeholder="name@example.com" aria-describedby="auth-email-error">
          <p class="auth-error" id="auth-email-error" aria-live="polite"></p>
        </div>

        <div class="auth-field">
          <label for="auth-password">Пароль</label>
          <div class="auth-pass">
            <input id="auth-password" name="password" type="password"
                   autocomplete="current-password" aria-describedby="auth-password-error">
            <button type="button" class="auth-toggle" aria-pressed="false">Показати</button>
          </div>
          <p class="auth-error" id="auth-password-error" aria-live="polite"></p>
        </div>

        <label class="auth-remember">
          <input type="checkbox" name="remember"> Запам’ятати мене
        </label>

        <button type="submit" class="auth-submit">Увійти</button>
        <p class="auth-status" role="status"></p>
      </form>
    </dialog>`;

  document.body.insertAdjacentHTML("beforeend", TEMPLATE);

  const dialog = document.querySelector(".auth-dialog");
  const form = dialog.querySelector(".auth-form");
  const status = dialog.querySelector(".auth-status");
  const passInput = form.elements.password;

  const fields = [
    { input: form.elements.email, error: dialog.querySelector("#auth-email-error"), validate: validateEmail, touched: false },
    { input: passInput, error: dialog.querySelector("#auth-password-error"), validate: validatePassword, touched: false },
  ];

  function check(field) {
    const message = field.validate(field.input.value);
    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
    return message === "";
  }

  fields.forEach((field) => {
    field.input.addEventListener("blur", () => {
      field.touched = true;
      check(field);
    });
    field.input.addEventListener("input", () => {
      if (field.touched) check(field);
      status.textContent = "";
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const results = fields.map((field) => {
      field.touched = true;
      return check(field);
    });

    const firstInvalid = fields[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.input.focus();
      status.textContent = "";
      return;
    }

    status.textContent = "Вхід виконано. Дані коректні (демо, без сервера).";
    status.classList.add("auth-status--ok");
    console.log(`Вхід: ${form.elements.email.value.trim()}`);
    setTimeout(() => dialog.close(), 1200);
  });

  dialog.querySelector(".auth-toggle").addEventListener("click", (event) => {
    const show = passInput.type === "password";
    passInput.type = show ? "text" : "password";
    event.currentTarget.textContent = show ? "Сховати" : "Показати";
    event.currentTarget.setAttribute("aria-pressed", String(show));
  });

  dialog.querySelector(".auth-close").addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll("[data-open-login]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // для <a href="#">, щоб сторінка не стрибала вгору
      form.reset();
      status.textContent = "";
      status.classList.remove("auth-status--ok");
      fields.forEach((field) => {
        field.touched = false;
        field.error.textContent = "";
        field.input.setAttribute("aria-invalid", "false");
      });
      dialog.showModal();
      fields[0].input.focus();
    });
  });

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    const regEmail = registerForm.elements.email;
    const regPassword = registerForm.elements.password;

    [regEmail, regPassword].forEach((input) => {
      input.addEventListener("input", () => input.setCustomValidity(""));
    });

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      regEmail.setCustomValidity(validateEmail(regEmail.value));
      regPassword.setCustomValidity(validatePassword(regPassword.value));
      if (!registerForm.reportValidity()) return;

      alert(`Реєстрація успішна (демо, без сервера): ${regEmail.value.trim()}`);
      registerForm.reset();
    });
  }
})();