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
  // Vaults corrected after Step 0 verification (the original PDF content did not match its answer,
  // or allowed more than one valid code). Every vault has been brute-force checked: its clues now
  // have exactly one solution, and it is the listed answer.
  var CORRECTED = {
    "04": "Added the rule to use only the last digit of two-digit results (the answer already relied on it).",
    "10": "4th-digit sequence changed from 25, 7, 20, 2, 15 to 25, 16, 20, 11, 15 so it really continues to 6.",
    "14": "'First two digits multiply to 24' changed to 32; added 'third digit greater than fourth' so the code is unique.",
    "24": "Added 'first digit greater than 5' (4952 also fitted).",
    "25": "Added 'digits increase left to right' and 'first digit is prime' (7 other codes also fitted).",
    "38": "'Third digit greater than second' changed to 'less than'; added four clues so 5843 is the only code.",
    "39": "Feedback for 4927 and 2751 rewritten to match 2971; added 'first digit is even' so the code is unique.",
    "40": "Last step changed from Add 100 to Add 220 so the steps give 1000.",
    "42": "'First = sum of last two' changed to 'first = 2 × third'; 'last digit is prime' changed to 'last digit is even' (0 is not prime).",
    "43": "Last step changed from Add 60 to Multiply by 6; answer is now 1350 (old answer 510 was wrong and only 3 digits).",
    "44": "Added a fifth guess (9687) so 5867 is the only code (5697 and 5796 also fitted).",
    "48": "Added four clues so 4725 is the only code (44 other codes also fitted).",
    "52": "Second step changed from Add 400 to Add 2600 so the steps give 1680.",
    "54": "Fourth step changed from Multiply by 5 to Multiply by 25; answer is now 1340 (old answer 270 was wrong and only 3 digits).",
    "56": "Answer changed from 7353 (repeats the 3) to 8352; added two clues so it is the only code.",
    "60": "Added what Hot / Warm mean.",
    "61": "Added what Hot / Warm / Cold mean.",
    "72": "Intro said 'the sum of each pair', but the lines also subtract and divide; reworded."
  };

  // Any vault listed here is skipped by the game (use it for future problems found in the sheet).
  var FLAGGED = {};

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
      flagReason: FLAGGED[id] || null,
      corrected: CORRECTED[id] || null,
      hint: HINTS[id] || null
    };
    if (extra) for (var k in extra) v[k] = extra[k];
    return v;
  }

  // Operator hints: a nudge to say out loud, not the answer.
  var HINTS = {
    "01": "The second digit is given. The first digit is 5 more than it.",
    "02": "The first digit is given. Use it to get the second, then the third.",
    "03": "After the first three steps you should have 36.",
    "04": "1st: add 3 each time. 2nd: add 3, 5, 7, 9. 3rd: take away 3, 4, 5, 6. 4th: add 1, 2, 3, 4.",
    "05": "1732 and 5726 rule out 1, 7, 3, 2, 5 and 6. See what is left in 1867 and 3109.",
    "06": "8402 rules out 8, 4, 0 and 2, so in 2980 the 9 must be the correct digit (second place).",
    "07": "After four steps you should have 240.",
    "08": "After four steps you should have 400.",
    "09": "The first digit is 4 more than 2. Everything else follows from the first two digits.",
    "10": "1st: multiply the previous two. 2nd: the gaps grow by 2. 3rd: add the previous two. 4th: two sequences take turns, each going down by 5.",
    "11": "1732 and 5726 rule out 1, 7, 3, 2, 5 and 6. In 8125 only the 8 can be right.",
    "12": "1289 and 8394 rule out 1, 2, 8, 9, 3 and 4. In 4972 only the 7 can be right.",
    "13": "After five steps you should have 189.",
    "14": "Which two digits multiply to 35? Which two multiply to 32 with the smaller one first?",
    "15": "Before the hexagon step you should have 120.",
    "16": "LAYER8 has two vowels: A and E.",
    "17": "Use 'first + last = 10' and 'second + last = 7' together with 'second = third + 2'.",
    "18": "After two steps you should have 1028.",
    "19": "The smallest prime number is 2, not 1.",
    "20": "Just count the letters: O-N-E is 3.",
    "21": "MISSISSIPPI: count the letters that repeat (I, S, P), not how often. A STOP sign is an octagon.",
    "22": "After four steps you should have 163.",
    "23": "The first two digits add to 10 and can't use 1, 5 or 8. Try 7 + 3 or 6 + 4.",
    "24": "The first digit is twice the last and greater than 5, so it must be 8.",
    "25": "Which two digits multiply to 24? The digits go up from left to right.",
    "26": "After three steps you should have 300.",
    "27": "After the 'Divide by 6' step you should have 180.",
    "28": "Look at the number keys directly above Q, W, E and R.",
    "29": "HACK has 4 letters. 2FA means two factors.",
    "30": "After four steps you should have 2040.",
    "31": "After four steps you should have 1708.",
    "32": "After four steps you should have 1200.",
    "33": "After four steps you should have 1200.",
    "34": "4821 reversed is 1284.",
    "35": "1638 reversed is 8361.",
    "36": "Both sums come out to 10, so the difference is 0.",
    "37": "After three steps you should have 2000.",
    "37b": "Start from the second digit: it is 3.",
    "38": "The digits add to 20 and the second is the largest. Try 8 for the second digit.",
    "39": "6408 rules out 6, 4, 0 and 8. 2751 shares three digits with the code.",
    "40": "After three steps you should have 50.",
    "41": "The factors of 10 are 1, 2, 5 and 10.",
    "42": "The first digit is twice the third, and the third is even. Try 4 for the third digit.",
    "43": "After three steps you should have 120.",
    "44": "1234 rules out 1, 2, 3 and 4, so in 7012 only the 7 or the 0 can be right.",
    "45": "A spider has 8 legs.",
    "46": "The second digit is 5, so the first is 8.",
    "47": "After three steps you should have 36.",
    "48": "The third digit is half the first. The last is odd and bigger than the first.",
    "49": "A nibble is half a byte: 4 bits. The OSI model has 7 layers.",
    "50": "After three steps you should have 80.",
    "51": "5837 and 6429 tell you which digits are definitely out. Then use 1578 to place the rest.",
    "52": "After two steps you should have 3000.",
    "53": "PASSWORD has two vowels: A and O. An OTP is usually 6 digits.",
    "54": "After three steps you should have 56.",
    "55": "Work backwards: the third digit is half the second, and the second is half the first.",
    "56": "First + last = 10 and the last is prime. Try 2 or 3 for the last digit.",
    "57": "FIREWALL has three vowels: I, E and A. The primes from 1 to 3 are 2 and 3.",
    "58": "SSH uses port 22. Decimal 3 is 0011 in binary.",
    "59": "AND needs both inputs to be 1. NOT flips the input.",
    "60": "5370 is 1 hot + 3 warm, so the code uses exactly the digits 5, 3, 7 and 0.",
    "61": "4192 is 4 warm, so the code uses exactly the digits 4, 1, 9 and 2.",
    "62": "Gym days: Monday, Wednesday, Friday, Sunday.",
    "63": "S is on key 7 and A is on key 2.",
    "64": "After three steps you should have 45.",
    "65": "After four steps you should have 300.",
    "66": "W is the 2nd key on the top row and I is the 8th.",
    "67": "These are Roman numerals: V is 5.",
    "68": "Take each top face away from 7.",
    "69": "Helium is element 2 and Hydrogen is element 1.",
    "70": "At 25 minutes past, the minute hand points at the 5.",
    "71": "Convert each group from binary: 0111 is 7.",
    "72": "There are 2 weekend days. A unicycle has 1 wheel.",
    "73": "The first digit is greater than 5 and twice the last, so it is 6 or 8.",
    "74": "After four steps you should have 42.",
    "75": "The second digit is 7 − 5 = 2."
  };

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

    T("04", SEQ + " If a missing number has two digits, use only its last digit.", [
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
      "4th digit: 25, 16, 20, 11, 15, ?"
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
      "The first two digits multiply to 32.",
      "The last two digits multiply to 35.",
      "All four digits add up to 24.",
      "The first digit is smaller than the second digit.",
      "The third digit is greater than the fourth digit."
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
      "The second digit is 4 more than the third digit.",
      "The first digit is greater than 5."
    ], "8514"),

    B("25", [
      "Find the 4-digit password.",
      "Exactly two digits are even.",
      "No digit is repeated.",
      "The first and last digits add up to 10.",
      "The middle two digits multiply to 24.",
      "The digits increase from left to right.",
      "The first digit is a prime number."
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
      "The third digit is less than the second.",
      "The last digit is less than the first.",
      "The sum of all digits is 20.",
      "No digit is repeated.",
      "The second digit is the largest digit.",
      "The third digit is 1 more than the last digit.",
      "The last digit is odd."
    ], "5843"),

    B("39", [
      "4927: one digit correct and in the right place, and two digits correct but in the wrong place.",
      "8136: one digit correct but in the wrong place.",
      "2751: three digits correct, two of them in the right place.",
      "6408: nothing is correct.",
      "The first digit is even."
    ], "2971"),

    S("40", "Start with 40, then:", [
      "Multiply by 5", "Add 300", "Divide by 10", "Multiply by 9", "Subtract 60",
      "Multiply by 2", "Add 220"
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
      "First digit = 2 × third digit.",
      "Second digit = first digit − 2.",
      "Third digit is even.",
      "Last digit is even.",
      "Sum of all digits = 18."
    ], "8640"),

    S("43", "Start with 30, then:", [
      "Multiply by 6", "Add 180", "Divide by 3", "Multiply by 5", "Subtract 150",
      "Divide by 2", "Multiply by 6"
    ], "1350"),

    B("44", [
      "❌ 1234: nothing is correct.",
      "🔥 5073: two digits correct, one in the right place.",
      "🌡️ 5890: two digits correct and in the right place.",
      "❌ 7012: one digit correct but in the wrong place.",
      "🔥 9687: three digits correct, one in the right place.",
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
      "Sum = 18.",
      "No digit is repeated.",
      "Second is the largest digit.",
      "Third is half the first.",
      "Last is odd."
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
      "Multiply by 5", "Add 2600", "Divide by 10", "Multiply by 6", "Subtract 120"
    ], "1680"),

    B("53", [
      "Digit 1: number of letters in \"LOGIN\".",
      "Digit 2: number of vowels in \"PASSWORD\".",
      "Digit 3: number of digits in an OTP.",
      "Digit 4: number of factors of 6."
    ], "5264", { answerText: "5, 2, 6, 4 → 5264" }),

    S("54", "Start with 36, then:", [
      "Multiply by 7", "Add 84", "Divide by 6", "Multiply by 25", "Subtract 60"
    ], "1340"),

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
      "Second + third = 8.",
      "Second < third.",
      "Second digit is prime."
    ], "8352"),

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

    T("60", "Hot = right digit in the right place. Warm = right digit in the wrong place.", [
      "1357 → 1 Hot, 2 Warm",
      "7218 → 1 Hot, 0 Warm",
      "4960 → 0 Hot, 1 Warm",
      "2386 → 1 Hot, 0 Warm",
      "5370 → 1 Hot, 3 Warm"
    ], "7305"),

    T("61", "Hot = right digit in the right place. Warm = right digit in the wrong place. Cold = digit not in the code.", [
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

    T("72", "Work out each line. The four results, in order, form the code:", [
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
