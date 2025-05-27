document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const image = document.querySelector('input[name="profileImageUrl"]').files[0];
  const errorBox = document.getElementById("errorMsg");

  if (!fullName || !email || !password) {
    errorBox.textContent = "Please fill in all required fields.";
    return;
  }

  const formData = new FormData();
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("password", password);
  if (image) formData.append("profileImageUrl", image);

  try {
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || "Signup failed";
      return;
    }

    alert("Signup successful! Redirecting to login...");
    window.location.href = "/login";
  } catch (err) {
    console.error("Signup Error", err);
    errorBox.textContent = "Something went wrong.";
  }
});
