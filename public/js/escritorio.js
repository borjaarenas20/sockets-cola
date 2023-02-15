const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblTicket = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorioa");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerText = escritorio;

divAlerta.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

socket.on("ultimo-ticket", (ultimo) => {
  // lblNuevoTicket.innerText = "Ticket " + ultimo;
});

socket.on("tickets-pendientes", (pendientes) => {
  lblPendientes.innerText = pendientes;
  if (pendientes !== 0) {
    lblPendientes.style.display = "";
    divAlerta.style.display = "none";
  }
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = "nadie";
      lblPendientes.style.display = "none";
      return (divAlerta.style.display = "");
    }

    lblTicket.innerText = "Ticket " + ticket.numero;
  });
});
