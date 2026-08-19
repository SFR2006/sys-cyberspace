import "./style.css";
import { initNav } from "./sections/nav";
import { renderAbout } from "./sections/about";
import { renderJourney } from "./sections/journey";
import { renderProjects } from "./sections/projects";
import { renderGames } from "./sections/games";
import { initContact } from "./sections/contact";

renderAbout();
renderJourney();
renderProjects();
renderGames();
initContact();
initNav();
