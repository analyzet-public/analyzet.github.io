/* Inline-critical theme init — runs before first paint to avoid flash.
   Picks dark/light based on the visitor's local browser time unless
   they've manually overridden it, in which case that choice sticks. */
(function () {
  try {
    var KEY = "analyzet-theme";
    var stored = localStorage.getItem(KEY);
    var theme;
    if (stored === "light" || stored === "dark") {
      theme = stored;
    } else {
      var hour = new Date().getHours();
      theme = (hour >= 19 || hour < 7) ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
