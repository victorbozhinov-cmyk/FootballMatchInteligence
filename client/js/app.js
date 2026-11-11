import { showHomeView } from "../views/homeView.js";
import { lib } from "./lib.js";
import { showMatchesView } from "../views/MatchesView.js";

lib.page("/", showHomeView);
lib.page("/matches", showMatchesView);


lib.page()

