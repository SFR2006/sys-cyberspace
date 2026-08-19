import { required } from "../lib/dom";

const CONTACT_EMAIL = "syedarahman2006@gmail.com";

export function initContact(): void {
  const form = required<HTMLFormElement>("#contact-form");
  const errorMsg = required<HTMLParagraphElement>("#contact-error");
  const popup = required("#success-popup");

  const nameInput = required<HTMLInputElement>("#name");
  const emailInput = required<HTMLInputElement>("#email");
  const subjectInput = required<HTMLInputElement>("#subject");
  const messageInput = required<HTMLTextAreaElement>("#message");

  const showError = (msg: string) => {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
  };

  const hideError = () => {
    errorMsg.classList.add("hidden");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    if (!form.checkValidity()) {
      showError("Please fill out every field with a valid value before sending.");
      form.reportValidity();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    popup.classList.remove("scale-0", "opacity-0");
    popup.classList.add("scale-100", "opacity-100");

    form.reset();

    setTimeout(() => {
      popup.classList.add("scale-0", "opacity-0");
      popup.classList.remove("scale-100", "opacity-100");
    }, 3000);
  });
}
