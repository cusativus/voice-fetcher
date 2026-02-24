function constructList(array) {
    var list = "";
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (i > 0) list += "\n";
        list += `${i} ${element}`;
    }
    return list;
}
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
    return `${sanitizeFilename(voice)}/${sanitizeFilename(text)}.${filetype}`;
}
async function lazypyTTS(service, voice, text) {
    const postResponse = await fetch(`https://lazypy.ro/tts/request_tts.php?service=${encodeURIComponent(service)}&voice=${encodeURIComponent(voice)}&text=${encodeURIComponent(text)}`, {
        method: "POST"
    });
    if (postResponse.ok) {
        const postJSON = JSON.parse(await postResponse.text());
        if (!postJSON.success)
            return;
        console.log("Received download URL, downloading...");
        const response = await fetch(postJSON["audio_url"]);
        if (response.ok) {
            const bytes = await response.bytes();
            console.log("Writing file...");
            const filepath = getFilePath(`${service} ${voice}`, text, "mp3");
            return {
                filepath,
                bytes
            };
        } else {
            console.log("An error occurred, please exit the window.");
            console.log(`Error Code ${response.status}`, response.statusText);
            return {};
        }
    } else {
        console.log("An error occurred, please exit the window.");
        console.log(`Error Code ${postResponse.status}`, postResponse.statusText);
        return {};
    }
}

const voices = [
    "usenglishfemale",
    "usenglishmale",
    "ukenglishfemale",
    "ukenglishmale",
    "auenglishfemale",
    "caenglishfemale"
];
const service = "iSpeech";
function Query(text, options) {
    return lazypyTTS(service, options.voice, text);
}
function Choices() {
    return {
        voice: {
            text: `Input Voice\n${constructList(voices)}`,
            type: "array",
            array: voices
        }
    }
}

module.exports = {Query, Choices}
