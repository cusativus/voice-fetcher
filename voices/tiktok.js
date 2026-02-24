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
    "en_uk_001",
    "en_uk_003",
    "en_female_emotional",
    "en_au_001",
    "en_au_002",
    "en_us_002",
    "en_us_006",
    "en_us_007",
    "en_us_009",
    "en_us_010",
    "en_female_samc",
    "en_male_cody",
    "en_male_narration",
    "en_male_funny",
    "en_male_jarvis",
    "en_male_ashmagic",
    "en_male_santa_narration",
    "en_female_betty",
    "en_female_makeup",
    "en_female_richgirl",
    "en_female_amie",
    "en_male_jason",
    "en_male_chris",
    "en_male_miki",
    "en_male_cupid",
    "en_female_shenna",
    "en_male_whitney",
    "en_female_doll",
    "en_male_adam_elf",
    "en_male_adrian",
    "en_male_jomboy",
    "en_female_ghost",
    "en_male_ghosthost",
    "en_male_david_gingerman",
    "en_female_grandma",
    "en_male_ukneighbor",
    "en_male_wizard",
    "en_male_trevor",
    "en_male_deadpool",
    "en_male_ukbutler",
    "en_male_olantekkers",
    "en_male_petercullen",
    "en_male_pirate",
    "en_male_santa",
    "en_male_santa_effect",
    "en_male_corey_santa",
    "en_male_maxwell",
    "en_female_pansino",
    "en_female_erika",
    "en_female_werewolf",
    "en_female_witch",
    "en_female_zombie",
    "en_male_grinch",
    "en_us_ghostface",
    "en_us_chewbacca",
    "en_us_c3po",
    "en_us_stormtrooper",
    "en_us_stitch",
    "en_us_rocket",
    "en_female_madam_leota",
    "en_male_sing_deep_jingle",
    "en_male_m03_classical",
    "en_female_f08_salut_damour",
    "en_male_m2_xhxs_m03_christmas",
    "en_female_f08_warmy_breeze",
    "en_female_ht_f08_halloween",
    "en_female_ht_f08_glorious",
    "en_male_sing_funny_it_goes_up",
    "en_male_m03_lobby",
    "en_female_ht_f08_wonderful_world",
    "en_female_ht_f08_newyear",
    "en_male_sing_funny_thanksgiving",
    "en_male_m03_sunshine_soon",
    "en_female_f08_twinkle",
    "en_male_m2_xhxs_m03_silly"
];
const service = "TikTok";
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
