# fuzzyMatch.js
A tiny JS library (1.39 KB minified) that compares two strings and returns a number between 0 and 1 representing their similarity.

# How it Works
1. Each string is split into an array of words. Particle words, punctuation marks, and other non-word characters (e.g. emoji) are stripped out since these are basically "fillers."
2. The algorithm iterates through the words in each string checking to see if the same word appears in the comparison string in the same position or an adjacent position (up to two spaces away). This process returns a score between 0 and 1 representing how many words in the first string appear in the same position within the second string. The process is repeated a second time, comparing the second string against the first, yielding a second score.
3. The algorithm builds a dictionary of words appearing in the first string along with their frequencies. It checks these frequencies against the second string and vice versa, returning a score between 0 and 1 representing how mnay of the word in each string appear with the same frequency in the other string.
4. Finally the algorith returns the highest of the aforementioned scores.

# Example
    var a = "Who rocks?🤗YOU do. We couldn't possibly be named Property Manager of the Year by #kewlstuff without our residents, employees and partners.",
        b = "Who rocks!? You do, we do, random stuff here. We couldn't possibly be named Property Manager of the Year by the #kewlstuff with out our residents, employees, and partners. This is awesome!";

    fuzzyMatch(a, b)
    => 0.88


# How fast is it?
fuzzyMatch.js is lightning fast! Comparing the two strings `a` and `b` from the example 100 times yielded an average execution time of just 0.43ms.

# Contributing
Pull requests are happily accepted.
