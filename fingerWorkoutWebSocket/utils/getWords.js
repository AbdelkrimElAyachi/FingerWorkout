// Function to shuffle an array using Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function getWords() {
    const wordsString = "species|teeth|with|hearing|Communication|exception|number|developed|by|dog|herding|possess|physical|assisting|and|companionship|in|descendant|rich|on|loads|starch|Late|of|to|lupus|powerful|protection|thrive|as|have|a|Dogs|over|such|the|Due|other|gustatory|wolf|was|hunter|capabilities|ago|bred|wolves|posture|military|scents|domesticated|people|humans|jaws|selectively|size|well|includes|development|aiding|called|including|hunting|inferior|color|same|for|be|superior|They|perform|14|Canis|42|diet|attributes|Pleistocene|would|gaze|pulling|before|their|familiaris|dogs|The|000|widely|facial|but|Compared|pheromones|sense|first|smell|Also|been|is|eye|sensory|during|communication|senses|long|association|expression|population|acuity|tail|house|taste|around|ability|shape|roles|limbs|movements|gained|sight|years|it|domestic|inadequate|vary|agriculture|canids|many|visual|breeds|gatherers|that|Dog|police|therapy|desired|bodies|or|disabled|behaviors|body|gray|from|bones|vocalization";

    // Convert string to array
    const wordsArray = wordsString.split("|");

    // Shuffle
    const shuffledWords = shuffleArray(wordsArray);

    return shuffledWords;
}

module.exports = getWords;

