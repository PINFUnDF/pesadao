window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "1035081404705-h0pnr74vvpt92s72lkk0t54v1fqs9jhu.apps.googleusercontent.com",
    callback: onSuccess,
  });
  google.accounts.id.renderButton(document.getElementById("googleButton"), {
    theme: "outline",
    size: "large",
    text: "continue_with",
  });
  google.accounts.id.prompt();
};

async function onSuccess(googleuser) {
  const { given_name } = parseJwt(googleuser.credential);
  const data = { nome: given_name };
  try {
    const response = await fetch("/login/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      redirect: "follow",
    });

    const result = await response.json();
    window.location.href = result.url;
  } catch (error) {
    console.error("Error:", error);
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}
