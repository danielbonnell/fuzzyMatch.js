/*
 * fuzzyMatch.js v1.0.1
 * https://github.com/danielbonnell/fuzzyMatch
 * Copyright 2018 Daniel Bonnell
 *
 * Description: Compares two strings and returns a number between 0 and 1 representing their similarity
 * Demo: https://jsfiddle.net/dq1x7c3u/15/
 */

function fuzzyMatch(input, source, prevScore) {
    var duplicateWordsCount = 0,
        precision = 2, // How many adjacent spaces to check for repeat words
        inputWords = input.split(/\W/).filter(function(word) { return validWord(word) }).map(function(word) { return word.toLowerCase() }),
        sourceWords = source.split(/\W/).filter(function(word) { return validWord(word) }).map(function(word) { return word.toLowerCase() });

    // Break out if there are no words to compare
    if(inputWords.length === 0 || sourceWords.length === 0) return 0;

    // Iterate through the input words and find how many times each word appears in the same
    // (or adjacent) position within the source array
    inputWords.forEach(function(word, index) {
        if(index + 1 > sourceWords.length) {
            // Stop checking for duplicates once we reach the end of the sourceWords array
            return false;
        } else {
            var foundDuplicate = false,
                indices = [index];

            // Construct the list of adjacent indices to check
            for(var i=0; i <= precision; i++) {
                var next = index + i,
                    prev = index - i;

                if(!indices.includes(prev) && prev > 0) indices.unshift(prev);
                if(!indices.includes(next) && next < sourceWords.length) indices.push(next);
            }

            // Check the same index in the source array OR check the adjacent indices in the source array
            if(inputWords[index] === sourceWords[index]) {
                duplicateWordsCount++;
            } else {
                indices.forEach(function(i) {
                    if(!foundDuplicate && inputWords[i] === sourceWords[i]) {
                        duplicateWordsCount++;
                        foundDuplicate = true; // So adjacent repeated words aren't double-counted when precision is high
                    }
                });
            }
        }
    });

    // Private Functions
    function validWord(word) {
        var excludedParticles = 'and be but by do for if in is it of or so that the this to too'.split(' ');
        return typeof(word) === 'string' && word.length > 1 && !excludedParticles.includes(word);
    }
    function getWordCounts(array) {
        // Build a hash with the number of times each word appears in the input array
        var hash = {};

        array.forEach(function(word) {
            hash[word] = typeof(hash[word]) === 'undefined' ? 1 : hash[word] + 1;
        });

        return hash;
    }
    function compareWordCounts(inputWordCounts, sourceWordCounts) {
        // Check how many times each word appears in the input and source. Then compare the counts to
        // see how many times a word appears the same number of times in each array.
        var totalInputWordCount = Object.values(inputWordCounts).reduce(function(a, b) { return a + b; }),
            totalSourceWordCount = Object.values(sourceWordCounts).reduce(function(a, b) { return a + b; });

        var inputMatches = 0,
            inputMatchesPercent = 0,
            sourceMatches = 0,
            sourceMatchesPercent = 0;

        // First pass: Check the input against the source
        Object.keys(inputWordCounts).forEach(function(key) {
            if(sourceWordCounts[key] === inputWordCounts[key]) inputMatches++;
        });

        // Second pass: Check the source against the input
        Object.keys(sourceWordCounts).forEach(function(key) {
            if(inputWordCounts[key] === sourceWordCounts[key]) sourceMatches++;
        });

        inputMatchesPercent = Math.round((parseFloat(inputMatches) / totalInputWordCount) * 100) / 100;
        sourceMatchesPercent = Math.round((parseFloat(sourceMatches) / totalSourceWordCount) * 100) / 100;

        // Return the highest match percent
        return [inputMatchesPercent, sourceMatchesPercent].sort()[1];
    }

    // Calculate the array comparison score for this cycle
    thisScore = Math.round((parseFloat(duplicateWordsCount) / sourceWords.length) * 100) / 100;

    // Perform a reverse comparison (source against the input) or calculate the frequency score
    // and then return the final highest score
    if(typeof(prevScore) === 'undefined') {
        return fuzzyMatch(source, input, thisScore);
    } else {
        // Check the frequency with which each word in the input appears in the source and vice versa.
        // A score of 1 means that 100% of the words from the input appeared in the source with the
        // same frequency.
        var frequencyScore = compareWordCounts(getWordCounts(inputWords), getWordCounts(sourceWords));

        return [prevScore, thisScore, frequencyScore].sort()[2];
    }
}
