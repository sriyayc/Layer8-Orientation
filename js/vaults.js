/* Password Cracker — vault bank.
   Transcribed VERBATIM from "password cracker.docx.pdf" (Vault Lock 01–75 + 37 Part 2).
   Do not reword clues here; fix content only through the flagged list.

   Each vault:
     id      "01".."75", "37b"
     title   heading as in the PDF
     intro   paragraph above the list (or null)
     items   list lines
     ordered true = numbered steps, false = bullets
     outro   paragraph below the list (or null)
     answer  the 4-digit code the game accepts
     answerText  the answer line exactly as printed, when it differs from `answer`
     flagged true = excluded from play until the content is corrected (see FLAGGED below)

   To re-enable a vault after correcting it, set `flagged: false` (or delete its entry in FLAGGED). */

(function () {
  // Vaults whose printed answer does not match its clues (found during Step 0 verification).
  // They stay in the bank verbatim but are skipped by the game.
  var FLAGGED = {
    "10": "4th-digit sequence (25, 7, 20, 2, 15, ?) continues to -3, not 6",
    "14": "4875: 4 × 8 = 32, not 24 — no code satisfies all clues",
    "24": "4952 also satisfies every clue",
    "25": "7 other codes also satisfy every clue",
    "38": "5843: third digit (4) is not greater than the second (8)",
    "39": "2971 vs 4927 gives 1 correct-place + 2 wrong-place, not 1",
    "40": "steps compute to 880, PDF answer is 1000",
    "42": "8640: last digit 0 is not prime — no code satisfies all clues",
    "43": "steps compute to 285, PDF answer is 510 (also only 3 digits)",
    "44": "5697 and 5796 also satisfy every clue",
    "48": "44 other codes also satisfy every clue",
    "52": "steps compute to 360, PDF answer is 1680",
    "54": "steps compute to 220, PDF answer is 270 (also only 3 digits)",
    "56": "7353 repeats the digit 3 despite 'No repetition'"
  };

  function B(id, items, answer, extra) {
    return make(id, null, items, false, answer, extra);
  }
  function S(id, intro, items, answer, extra) {
    return make(id, intro, items, true, answer, extra);
  }
  function T(id, intro, items, answer, extra) {
    return make(id, intro, items, false, answer, extra);
  }
  function make(id, intro, items, ordered, answer, extra) {
    var v = {
      id: id,
      title: id === "37b" ? "Vault Lock 37 (Part 2)" : "Vault Lock " + id,
      intro: intro,
      items: items,
      ordered: ordered,
      outro: null,
      answer: answer,
      answerText: answer,
      flagged: Object.prototype.hasOwnProperty.call(FLAGGED, id),
      flagReason: FLAGGED[id] || null
    };
    if (extra) for (var k in extra) v[k] = extra[k];
    return v;
  }

  var NO_REPEAT = "Find the 4-digit vault code. No digit is repeated.";
  var SEQ = "Find the missing number in each sequence. The four missing numbers form the vault code.";

  window.VAULTS = [
    B("01", [
      "Find the 4-digit vault code.",
      "All four digits add up to 26.",
      "The second digit is 4.",
      "The first digit is 5 more than the second digit.",
      "The third digit is 1 less than the fourth digit."
    ], "9467"),

    B("02", [
      "Find the 4-digit vault code.",
      "The first digit is 4.",
      "The second digit is 2 more than the first digit.",
      "The second digit is 4 more than the third digit.",
      "The last two digits add up to 10."
    ], "4628"),

    S("03", "Start with 18, then:", [
      "Multiply by 4", "Add 36", "Divide by 3", "Multiply by 7", "Subtract 84",
      "Divide by 2", "Add 16", "Multiply by 12", "Subtract 100"
    ], "1100"),

    T("04", SEQ, [
      "1st digit: 3, 6, 9, 12, ?",
      "2nd digit: 2, 5, 10, 17, ?",
      "3rd digit: 20, 17, 13, 8, ?",
      "4th digit: 1, 2, 4, 7, ?"
    ], "5621"),

    T("05", NO_REPEAT, [
      "1867: one digit is correct and in the correct position.",
      "3109: two digits are correct and in the correct positions.",
      "1732: no digit is correct.",
      "5726: no digit is correct."
    ], "4809"),

    T("06", NO_REPEAT, [
      "2980: one digit is correct and in the correct position.",
      "8402: no digit is correct.",
      "1752: two digits are correct and in the correct positions.",
      "4350: one digit is correct and in the correct position."
    ], "1956"),

    S("07", "Start with 15, then:", [
      "Multiply by 4", "Add 20", "Divide by 2", "Multiply by 6", "Subtract 40",
      "Multiply by 3", "Add 25", "Multiply by 2"
    ], "1250"),

    S("08", "Start with 18, then:", [
      "Multiply by 5", "Add 10", "Divide by 2", "Multiply by 8", "Subtract 40",
      "Multiply by 3", "Add 20", "Multiply by 2"
    ], "2200"),

    B("09", [
      "Find the 4-digit vault code.",
      "All four digits add up to 19.",
      "The second digit is 2.",
      "The first digit is 4 more than the second digit.",
      "The third digit is 5 more than the second digit.",
      "The fourth digit is 2 less than the first digit."
    ], "6274"),

    T("10", SEQ, [
      "1st digit: 1, 2, 2, 4, ?",
      "2nd digit: 20, 18, 14, 8, ?",
      "3rd digit: 0, 1, 1, 2, 3, ?",
      "4th digit: 25, 7, 20, 2, 15, ?"
    ], "8056"),

    T("11", NO_REPEAT, [
      "8125: one digit is correct and in the correct position.",
      "6907: two digits are correct and in the correct positions.",
      "1732: no digit is correct.",
      "5726: no digit is correct."
    ], "8904"),

    T("12", NO_REPEAT, [
      "4972: one digit is correct and in the correct position.",
      "5230: two digits are correct and in the correct positions.",
      "1289: no digit is correct.",
      "8394: no digit is correct."
    ], "5670"),

    S("13", "Start with 12, then:", [
      "Multiply by 6", "Add 8", "Divide by 4", "Add 7", "Multiply by 7",
      "Subtract 9", "Multiply by 6", "Subtract 1"
    ], "1079"),

    B("14", [
      "Find the 4-digit password.",
      "The first two digits multiply to 24.",
      "The last two digits multiply to 35.",
      "All four digits add up to 24.",
      "The first digit is smaller than the second digit."
    ], "4875"),

    S("15", "Start with 100, then:", [
      "Subtract 25", "Divide by 5", "Multiply by 8",
      "A hexagon has 6 sides. Multiply 6 × 1000.",
      "Add the result to your current number."
    ], "6120"),

    T("16", "Find the 4-digit code.", [
      "The first digit is the number of letters in THREE.",
      "The second digit is the number of sides of a square.",
      "The third digit is the number of vowels in LAYER8.",
      "The fourth digit is the number of months in a year divided by 2."
    ], "5426"),

    B("17", [
      "Find the 4-digit password.",
      "It is not 1234.",
      "It is not 4321.",
      "It contains no 0.",
      "The first digit is greater than 5.",
      "The second digit is less than 5.",
      "The third digit is even.",
      "The last digit is odd.",
      "The first and last digits add up to 10.",
      "The second digit is exactly 2 more than the third digit.",
      "The second and last digits add up to 7."
    ], "7423"),

    S("18", "Start with 200, then:", [
      "Multiply by 6", "Subtract 172", "Divide by 2", "Multiply by 3", "Add 18"
    ], "1560"),

    T("19", "Find the 4-digit code.", [
      "Digit 1: the smallest prime number.",
      "Digit 2: the square root of 49.",
      "Digit 3: the number of letters in HACK.",
      "Digit 4: the number of sides on a hexagon."
    ], "2746"),

    T("20", "Find the 4-digit password.", [
      "Digit 1: number of letters in ONE.",
      "Digit 2: number of letters in TWO.",
      "Digit 3: number of letters in THREE.",
      "Digit 4: number of letters in FOUR."
    ], "3354"),

    T("21", "Find the 4-digit password.", [
      "Digit 1: how many different letters appear more than once in MISSISSIPPI?",
      "Digit 2: how many months have 31 days?",
      "Digit 3: how many letters are in HACKER?",
      "Digit 4: how many sides does a STOP sign have?"
    ], "3768", { outro: "⚠️ One of these clues may not have the obvious answer you first expect." }),

    S("22", "Start with 48, then:", [
      "Multiply by 20", "Add 240", "Divide by 4", "Subtract 137", "Multiply by 6",
      "Add 21", "Add 1"
    ], "1000"),

    B("23", [
      "Find the 4-digit password.",
      "All four digits are different.",
      "The password contains no 0, 1, 5 or 8.",
      "The first two digits add up to 10.",
      "The first digit is greater than the second.",
      "The last two digits add up to 11.",
      "The first and last digits add up to 9."
    ], "7392"),

    B("24", [
      "Find the 4-digit password.",
      "All four digits are different.",
      "The first two digits add up to 13.",
      "The last digit is even.",
      "The first digit is twice the last digit.",
      "The second digit is 4 more than the third digit."
    ], "8514"),

    B("25", [
      "Find the 4-digit password.",
      "Exactly two digits are even.",
      "No digit is repeated.",
      "The first and last digits add up to 10.",
      "The middle two digits multiply to 24."
    ], "3467"),

    S("26", "Start with 72, then:", [
      "Multiply by 15", "Subtract 180", "Divide by 3", "Multiply by 8", "Add 64"
    ], "2464"),

    S("27", "Start with 1000, then:", [
      "Add 80", "Divide by 6", "Add 75", "Multiply by 8", "Subtract 100",
      "Divide by 5", "Multiply by 13"
    ], "5044"),

    T("28", "I am not a number, but I can become one. Find the letters where:", [
      "Q comes before W",
      "E comes before R"
    ], "1234", { outro: "Use the keyboard keys directly above these letters." }),

    T("29", "Find the 4-digit password.", [
      "Digit 1: double the number of letters in HACK.",
      "Digit 2: number of sides on a pentagon + 1.",
      "Digit 3: number of letters in SCAM.",
      "Digit 4: number of authentication factors represented by 2FA."
    ], "8642"),

    S("30", "Start with 1000, then:", [
      "Add 80", "Divide by 6", "Add 75", "Multiply by 8", "Subtract 100",
      "Divide by 4", "Multiply by 5"
    ], "2425"),

    S("31", "Start with 750, then:", [
      "Add 150", "Divide by 5", "Add 64", "Multiply by 7", "Subtract 100",
      "Divide by 4", "Multiply by 6"
    ], "2412"),

    S("32", "Start with 800, then:", [
      "Add 200", "Divide by 5", "Add 100", "Multiply by 4", "Subtract 200",
      "Divide by 2", "Multiply by 5"
    ], "2500"),

    S("33", "Start with 900, then:", [
      "Add 100", "Divide by 5", "Add 100", "Multiply by 4", "Subtract 200",
      "Divide by 2", "Multiply by 3"
    ], "1500"),

    S("34", "Start with 4821, then:", [
      "Reverse the number", "Add 1000", "Subtract 321"
    ], "1963"),

    S("35", "Starting code: 1638, then:", [
      "Reverse the number", "Subtract 2000"
    ], "6361"),

    S("36", "Start with 8642, then:", [
      "Add the first and last digits.",
      "Add the second and third digits.",
      "Find the difference between the two results.",
      "Multiply the difference by 100.",
      "Add 2000."
    ], "2000"),

    S("37", "Start with 450, then:", [
      "Add 50", "Multiply by 5", "Subtract 500", "Multiply by 4"
    ], "8000"),

    B("37b", [
      "The password has four digits.",
      "The first digit is 2 more than the second digit.",
      "The third digit is twice the second digit.",
      "The fourth digit is 1 more than the first digit.",
      "The second digit is 3."
    ], "5366"),

    B("38", [
      "The code is not 1111.",
      "The code is not 9999.",
      "The first digit is odd.",
      "The second digit is even.",
      "The third digit is greater than the second.",
      "The last digit is less than the first.",
      "The sum of all digits is 20."
    ], "5843"),

    B("39", [
      "4927: one digit correct and in the right place.",
      "8136: one digit correct but in the wrong place.",
      "2751: two digits correct, but one in the wrong place.",
      "6408: nothing is correct."
    ], "2971"),

    S("40", "Start with 40, then:", [
      "Multiply by 5", "Add 300", "Divide by 10", "Multiply by 9", "Subtract 60",
      "Multiply by 2", "Add 100"
    ], "1000"),

    B("41", [
      "Digit 1: letters in \"CYBER\".",
      "Digit 2: vowels in \"SECURITY\".",
      "Digit 3: number of digits in a PIN.",
      "Digit 4: factors of 10 (count)."
    ], "5344", { answerText: "5, 3, 4, 4 → 5344" }),

    B("42", [
      "No digit repeats.",
      "The code contains no 1, 5, or 9.",
      "First digit = sum of last two digits.",
      "Second digit = first digit − 2.",
      "Third digit is even.",
      "Last digit is prime.",
      "Sum of all digits = 18."
    ], "8640"),

    S("43", "Start with 30, then:", [
      "Multiply by 6", "Add 180", "Divide by 3", "Multiply by 5", "Subtract 150",
      "Divide by 2", "Add 60"
    ], "510"),

    B("44", [
      "❌ 1234: nothing is correct.",
      "🔥 5073: two digits correct, one in the right place.",
      "🌡️ 5890: two digits correct and in the right place.",
      "❌ 7012: one digit correct but in the wrong place.",
      "No repetition."
    ], "5867"),

    B("45", [
      "Digit 1: days in a week.",
      "Digit 2: sides in a triangle.",
      "Digit 3: letters in \"CODE\".",
      "Digit 4: legs on a spider."
    ], "7348"),

    B("46", [
      "All digits different.",
      "Sum = 19.",
      "First digit is 3 more than the second.",
      "Third digit is half of the fourth.",
      "Second digit is 5."
    ], "8524"),

    S("47", "Start with 12, then:", [
      "Multiply by 9", "Add 108", "Divide by 6", "Multiply by 7", "Subtract 42",
      "Multiply by 5"
    ], "1050"),

    B("48", [
      "The code is not 2468.",
      "The code is not 1357.",
      "First digit is even.",
      "Second is odd.",
      "Third is less than the second.",
      "Last is greater than the first.",
      "Sum = 18."
    ], "4725"),

    B("49", [
      "Digit 1: number of bits in a nibble.",
      "Digit 2: number of layers in the OSI model.",
      "Digit 3: number of letters in \"DATA\".",
      "Digit 4: number of digits in an HTTP status code."
    ], "4743"),

    S("50", "Start with 50, then:", [
      "Multiply by 4", "Add 200", "Divide by 5", "Multiply by 6", "Subtract 120",
      "Multiply by 3"
    ], "1080"),

    T("51", "The password contains four different digits. You receive these attempts:", [
      "5837: exactly 2 digits are correct and in the correct position. No other digit appears in the password.",
      "6429: exactly 1 digit is correct and in the correct position. No other digit appears in the password.",
      "1578: exactly 3 digits are correct, but all three are in the wrong positions.",
      "9045: exactly 1 digit is correct, but it is in the wrong position.",
      "1027: exactly 1 digit is correct and in the correct position, and exactly 1 other digit is correct but in the wrong position."
    ], "5821"),

    S("52", "Start with 80, then:", [
      "Multiply by 5", "Add 400", "Divide by 10", "Multiply by 6", "Subtract 120"
    ], "1680"),

    B("53", [
      "Digit 1: number of letters in \"LOGIN\".",
      "Digit 2: number of vowels in \"PASSWORD\".",
      "Digit 3: number of digits in an OTP.",
      "Digit 4: number of factors of 6."
    ], "5264", { answerText: "5, 2, 6, 4 → 5264" }),

    S("54", "Start with 36, then:", [
      "Multiply by 7", "Add 84", "Divide by 6", "Multiply by 5", "Subtract 60"
    ], "270"),

    B("55", [
      "All digits different.",
      "First digit = 2 × second.",
      "Third digit = second ÷ 2.",
      "Fourth digit = first − 2.",
      "Sum = 20."
    ], "8426"),

    B("56", [
      "No repetition.",
      "Contains no 0 or 9.",
      "First digit > second.",
      "Third digit is odd.",
      "Last digit is prime.",
      "First + last = 10.",
      "Second + third = 8."
    ], "7353"),

    B("57", [
      "Digit 1: number of letters in \"PATCH\".",
      "Digit 2: vowels in \"FIREWALL\".",
      "Digit 3: number of sides on a hexagon.",
      "Digit 4: prime numbers between 1 and 3 (count)."
    ], "5362"),

    B("58", [
      "Digit 1: the hex value for the letter 'A' is 41. Take the second digit.",
      "Digit 2: the decimal ASCII code for a newline character (\\n) is 10. Take the last digit.",
      "Digit 3: the standard port number for SSH (22). Add the two digits together.",
      "Digit 4: the binary representation of decimal 3 (0011). Count the number of zeros."
    ], "1042"),

    B("59", [
      "Digit 1: output of an AND gate when Input A = 1 and Input B = 1.",
      "Digit 2: output of an OR gate when Input A = 0 and Input B = 0.",
      "Digit 3: output of a NAND gate when Input A = 1 and Input B = 1.",
      "Digit 4: output of a NOT gate when Input A = 0."
    ], "1001"),

    B("60", [
      "1357 → 1 Hot, 2 Warm",
      "7218 → 1 Hot, 0 Warm",
      "4960 → 0 Hot, 1 Warm",
      "2386 → 1 Hot, 0 Warm",
      "5370 → 1 Hot, 3 Warm"
    ], "7305"),

    B("61", [
      "9124 → 1 Hot, 3 Warm",
      "5830 → Everything is Cold",
      "2678 → 1 Hot, 0 Warm",
      "4192 → 0 Hot, 4 Warm"
    ], "2914"),

    B("62", [
      "Digit 1: a pizza has 8 slices. You eat 3 and your friend eats 2. How many slices are left?",
      "Digit 2: a cricket over has 6 balls. 4 balls have been bowled. How many are left in the over?",
      "Digit 3: you go to the gym every other day, starting Monday, for one week (Monday to Sunday). How many gym days is that?",
      "Digit 4: you buy a ₹91 snack with a ₹100 note. How many rupees of change do you get?"
    ], "3249"),

    T("63", "Use an old phone keypad: 2=ABC, 3=DEF, 4=GHI, 5=JKL, 6=MNO, 7=PQRS, 8=TUV, 9=WXYZ. The code is the word \"SAFE\" typed on this keypad.", [], "7233"),

    S("64", "Start with 35, then:", [
      "Multiply by 6", "Subtract 30", "Divide by 4", "Add 17", "Multiply by 3",
      "Multiply by 6"
    ], "1116"),

    S("65", "Start with 45, then:", [
      "Multiply by 4", "Subtract 60", "Divide by 6", "Multiply by 15", "Add 70",
      "Multiply by 3", "Subtract 11"
    ], "1099"),

    T("66", "Look at your keyboard's top row: Q=1, W=2, E=3, R=4, T=5, Y=6, U=7, I=8, O=9, P=0. The code is the word \"WIRE\" typed using those keys as numbers.", [], "2843"),

    B("67", [
      "Digit 1: V",
      "Digit 2: IX",
      "Digit 3: III",
      "Digit 4: VII"
    ], "5937"),

    T("68", "On a standard die, opposite faces always add up to 7. You can see these top faces: 1, 3, 5, 2. The code is the number on the bottom face of each die, in the same order.", [], "6425"),

    T("69", "The code is the atomic numbers of these elements, in order: Helium, Carbon, Oxygen, Hydrogen.", [], "2681"),

    B("70", [
      "Digit 1: at exactly 3:00, which number does the hour hand point at?",
      "Digit 2: at 4:25, which number does the minute hand point at?",
      "Digit 3: at exactly 6:00, which number does the hour hand point at?",
      "Digit 4: at 7:40, which number does the minute hand point at?"
    ], "3568"),

    T("71", "Each group of 4 bits is one digit of the code: 0111 | 0011 | 1000 | 0100", [], "7384"),

    T("72", "The code is the sum of each pair, in order:", [
      "Digit 1: the number of days in a week minus the number of weekend days.",
      "Digit 2: the number of legs on a spider divided by the number of legs on a human.",
      "Digit 3: the number of sides on a hexagon plus the number of sides on a triangle.",
      "Digit 4: the number of wheels on a car minus the number of wheels on a unicycle."
    ], "5493"),

    B("73", [
      "The password has four different digits.",
      "The first digit is twice the fourth digit.",
      "The second digit is 1 more than the third digit.",
      "The sum of all four digits is 18.",
      "The first digit is greater than 5."
    ], "6543"),

    S("74", "Start with 25, then:", [
      "Multiply by 8", "Subtract 50", "Divide by 5", "Add 12", "Multiply by 3",
      "Multiply by 10", "Add 5"
    ], "1265"),

    B("75", [
      "Find the 4-digit password.",
      "All four digits are different.",
      "All four digits add up to 23.",
      "The first digit is 7.",
      "The second digit is 5 less than the first digit.",
      "The third digit is odd.",
      "The fourth digit is 4 more than the third digit."
    ], "7259")
  ];
})();
