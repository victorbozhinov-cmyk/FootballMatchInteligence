import { showHomeView } from "../views/homeView.js";
import { lib } from "./lib.js";
import { showMatchesView } from "../views/MatchesView.js";
import { showAnalysisView } from "../views/analysisView.js";

lib.page("/", showHomeView)
lib.page("/matches", showMatchesView)
lib.page("/analysis", showAnalysisView)


lib.page()

