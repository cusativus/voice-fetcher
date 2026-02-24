// ts pmo

function sanitizeFilename(filename) {
    // Replace illegal characters with an underscore
    const sanitized = filename.replace(/<\/?[<>:"\/\\|?*\x00-\x1F]/g, '_');

    // Optional: replace spaces with underscores/dashes and convert to lowercase
    return sanitized.replace(/\s/g, '_').toLowerCase();
}

/**
 * 
 * @param {String} voice 
 * @param {String} text 
 * @param {String} filetype 
 */
function getFilePath(voice, text, filetype) {
    return `./outputs/${sanitizeFilename(voice)}/${sanitizeFilename(text)}.${filetype}`;
}

async function fetchSAMVoice(voice, text, speed, pitch) {
    const url = `https://www.tetyys.com/SAPI4/SAPI4?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}&pitch=${pitch}&speed=${speed}`;
    const result = await fetch(url);
    if (result.ok) {
        const filepath = getFilePath(voice, text, "wav");
        return {
            filepath,
            bytes: await result.bytes()
        };
    } else {
        console.log("an error occured");
        return {};
    }
}

const voices = [
    "Adult Female #1, American English (TruVoice)",
    "Adult Female #2, American English (TruVoice)",
    "Adult Male #1, American English (TruVoice)",
    "Adult Male #2, American English (TruVoice)",
    "Adult Male #3, American English (TruVoice)",
    "Adult Male #4, American English (TruVoice)",
    "Adult Male #5, American English (TruVoice)",
    "Adult Male #6, American English (TruVoice)",
    "Adult Male #7, American English (TruVoice)",
    "Adult Male #8, American English (TruVoice)",
    "Mary",
    "Mary (for Telephone)",
    "Mary in Hall",
    "Mary in Space",
    "Mary in Stadium",
    "Mike",
    "Mike (for Telephone)",
    "Mike in Hall",
    "Mike in Space",
    "Mike in Stadium",
    "RoboSoft One",
    "RoboSoft Two",
    "RoboSoft Three",
    "RoboSoft Four",
    "RoboSoft Five",
    "RoboSoft Six",
    "Sam"
];

function constructList(array) {
    var list = "";
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (i > 0) list += "\n";
        list += `${i} ${element}`;
    }
    return list;
}

function Choices() {
    return {
        voice: {
            text: `Input Voice\n${constructList(voices)}`,
            type: "array",
            array: voices
        }
    };
}

async function Query(text, options) {
    const voice = options.voice;
    const limitations = JSON.parse(await (await fetch(`https://www.tetyys.com/SAPI4/VoiceLimitations?voice=${encodeURIComponent(voice)}`)).text());
    return await fetchSAMVoice(voice, text, limitations.defSpeed, limitations.defPitch);
}

module.exports = {Query, Choices}
