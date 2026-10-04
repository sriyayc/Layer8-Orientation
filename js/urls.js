/* Real or Fake — URL bank (20 pairs), verbatim from logos.pdf.
   The PDF gives two lists ("Wrong website urls" and "Right website urls");
   pairs are matched by position in those lists. */

(function () {
  var WRONG = [
    "https://help-netflix.com/account/verify",
    "https://linkedin-helpdesk.com/security/login",
    "https://paypal-support.com/account/verify",
    "https://support-microsoft.com/en-us/account",
    "https://facebook-security.com/help/login",
    "https://instagram-helpcenter.com/accounts/login",
    "https://github-security.com/account/verify",
    "https://zoom-support.com/account/login",
    "https://reddit-support.com/hc/en-us",
    "https://adobe-helpdesk.com/account/verify",
    "https://canva-support.com/account/login",
    "https://canva-security.com/verify/account",
    "https://steampowered-login.com/account",
    "https://appleid-support.com/account/manage",
    "https://apple-security-check.com/verify",
    "https://accounts-google.com/ServiceLogin",
    "https://amazon-helpdesk.com/gp/help/account",
    "https://spotify-support.com/account/settings",
    "https://discord-support.com/login",
    "https://dropbox-security.com/account/verify"
  ];
  var RIGHT = [
    "https://help.netflix.com/en/node/412",
    "https://www.linkedin.com/help/linkedin/answer/47856",
    "https://www.paypal.com/us/cshelp/article/how-do-i-reset-my-password-help143",
    "https://support.microsoft.com/en-us/account-billing",
    "https://www.facebook.com/help/103873106370583",
    "https://help.instagram.com/374546259294234",
    "https://docs.github.com/en/authentication",
    "https://support.zoom.com/hc/en/article?id=zm_kb",
    "https://support.reddithelp.com/hc/en-us",
    "https://helpx.adobe.com/account.html",
    "https://www.canva.com/help/account/",
    "https://www.canva.com/design/templates",
    "https://help.steampowered.com/en/wizard/HelpWithLogin",
    "https://support.apple.com/en-in/HT201487",
    "https://appleid.apple.com/account/manage",
    "https://accounts.google.com/ServiceLogin",
    "https://www.amazon.com/gp/help/customer/display.html",
    "https://support.spotify.com/us/article/account-settings/",
    "https://support.discord.com/hc/en-us",
    "https://help.dropbox.com/account-settings"
  ];

  window.URLS = RIGHT.map(function (real, i) {
    return { id: i + 1, real: real, fake: WRONG[i] };
  });
})();
